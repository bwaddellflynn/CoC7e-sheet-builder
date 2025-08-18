// ~/stores/character.ts
import { defineStore } from 'pinia'
import { BASE_SKILLS } from '~/stores/constants/skills'
import { calcDerivedMax } from '~/stores/utils/derived'
import type { Character, StatKey, Weapon, SkillEntry } from '~/stores/types/coc'

// Occupations (optional – if you’re using them)
import {
  OCCUPATIONS,
  EDUx4,
  categoryOf,
  type OccupationDef,
} from '~/stores/constants/occupations'

const genId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? (crypto as any).randomUUID()
    : Math.random().toString(36).slice(2)

function makeDefaultCharacter(): Character {
  const stats: Record<StatKey, number> = {
    STR: 50, CON: 60, SIZ: 55, DEX: 60, APP: 55, INT: 65, POW: 60, EDU: 70
  }

  const skills: Record<string, SkillEntry> = Object.fromEntries(
    Object.entries(BASE_SKILLS).map(([k, base]) => [k, { base, occ: 0, personal: 0 }])
  )

  const c: Character = {
    name: 'Investigator',
    player: '',
    occupation: '',
    occupationKey: null,
    age: 25,
    sex: '',
    residence: '',
    birthplace: '',
    background: '',
    creditRating: 0,
    stats,
    skills,
    weapons: [],
    portraitDataUrl: '',
    hp: 0, mp: 0, san: 0, luck: 50,
    statuses: { majorWound: false, tempInsane: false, indefInsane: false },
    sanStart: stats.POW,
    back: {
      personalDescription: '',
      ideology: '',
      significantPeople: [],
      meaningfulLocations: [],
      treasuredPossessions: [],
      traits: [],
      injuriesScars: '',
      phobiasManias: '',
      arcaneTomesSpellsArtifacts: '',
      encounters: '',
      gear: '',
      cash: { spendingLevel: 0, cash: 0, assets: '' },
    },
  }

  const { hpMax, mpMax, sanMax } = calcDerivedMax(c)
  c.hp = hpMax; c.mp = mpMax; c.san = sanMax
  return c
}

function baseForParent(parent: string): number {
  if (BASE_SKILLS[parent] !== undefined) return BASE_SKILLS[parent]
  if (parent.startsWith('Fighting')) return BASE_SKILLS['Fighting (Brawl)'] ?? 25
  if (parent.startsWith('Firearms'))  return BASE_SKILLS['Firearms (Handgun)'] ?? 20
  switch (parent) {
    case 'Art/Craft': return 5
    case 'Science':   return 1
    case 'Pilot':     return 1
    case 'Survival':  return 10
    case 'Language':
    case 'Language (Other)': return 1
    default: return 0
  }
}

// ---------- Import/Export helpers ----------
type ImportResult = { ok: true } | { ok: false; errors: string[] }
type ImportOpts = { merge?: boolean }

/** clamp integer helper */
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)))

/** make a safe SkillEntry from loose input */
function normalizeSkillEntry(name: string, raw: any): SkillEntry {
  // Allow shorthand: number => personal points only
  if (typeof raw === 'number') {
    const base = BASE_SKILLS[name] ?? baseForParent(name)
    return { base, occ: 0, personal: clamp(raw, 0, 99) }
  }

  const baseDefault = BASE_SKILLS[name] ?? baseForParent(name)
  const base =
    name === 'Dodge' || name === 'Language (Own)'
      ? 0 // these bases are derived in UI
      : (typeof raw?.base === 'number' ? clamp(raw.base, 0, 99) : baseDefault)

  const occ = typeof raw?.occ === 'number' ? clamp(raw.occ, 0, 99) : 0
  // Support legacy "points" => treat as personal pool
  const personalFromLegacy = typeof raw?.points === 'number' ? clamp(raw.points, 0, 99) : 0
  const personal = typeof raw?.personal === 'number' ? clamp(raw.personal, 0, 99) : personalFromLegacy

  return { base, occ, personal }
}

/** Build a full skill map: include all core skills + any custom ones from data */
function buildSkillMap(incoming?: Record<string, any>): Record<string, SkillEntry> {
  const out: Record<string, SkillEntry> = {}
  // Start with all core skills
  for (const [k, base] of Object.entries(BASE_SKILLS)) {
    out[k] = { base, occ: 0, personal: 0 }
  }
  // Merge incoming (adds customs and overrides cores)
  if (incoming && typeof incoming === 'object') {
    for (const [name, raw] of Object.entries(incoming)) {
      out[name] = normalizeSkillEntry(name, raw)
    }
  }
  // Enforce derived-base exceptions
  if (out['Dodge']) out['Dodge'].base = 0
  if (out['Language (Own)']) out['Language (Own)'].base = 0
  return out
}

// ------------------------------------------

export const useCharacterStore = defineStore('character', {
  state: () => ({ c: makeDefaultCharacter() }),

  getters: {
    derivedMax: (s) => calcDerivedMax(s.c),

    occDef: (s): OccupationDef | undefined =>
      OCCUPATIONS.find(o => o.key === s.c.occupationKey),

    occBudget(): number {
      const formula = this.occDef?.formula ?? EDUx4
      return formula(this.c.stats)
    },

    piBudget(): number {
      return this.c.stats.INT * 2
    },

    occSpent(): number {
      return Object.values(this.c.skills).reduce((t, v) => t + (v.occ ?? 0), 0)
    },

    piSpent(): number {
      return Object.values(this.c.skills).reduce((t, v) => t + (v.personal ?? 0), 0)
    },

    isOccSkill(): (skillName: string) => boolean {
      return (skillName: string) => {
        const def = this.occDef
        if (!def) return true
        if (skillName === 'Credit Rating') return true
        for (const entry of def.skills) {
          if (entry.type === 'fixed' && entry.name === skillName) return true
          if (entry.type === 'choose' && entry.from.includes(skillName)) return true
          if (entry.type === 'any') {
            const cat = categoryOf(skillName)
            if (cat === entry.category) return true
          }
        }
        return false
      }
    },

    dodge:   (s) => Math.floor(s.c.stats.DEX / 2),
    langOwn: (s) => s.c.stats.EDU,
  },

  actions: {
    // ---------- occupation ----------
    setOccupation(key: string | null) {
      this.c.occupationKey = key
      const def = OCCUPATIONS.find(o => o.key === key)
      this.c.occupation = def?.label ?? ''
    },

    // ---------- stats / points ----------
    setStat(k: StatKey, v: number) {
      this.c.stats[k] = clamp(v, 15, 90)
      const { hpMax, mpMax, sanMax } = calcDerivedMax(this.c)
      this.c.hp  = Math.min(this.c.hp,  hpMax)
      this.c.mp  = Math.min(this.c.mp,  mpMax)
      this.c.san = Math.min(this.c.san, sanMax)
    },

    // Back-compat: treat as Personal Interest
    setSkillPoints(name: string, pts: number) {
      const v = this.c.skills[name]; if (!v) return
      v.personal = clamp(pts, 0, 99)
    },

    setOccPoints(name: string, pts: number) {
      const v = this.c.skills[name]; if (!v) return
      v.occ = clamp(pts, 0, 99)
    },
    setPersonalPoints(name: string, pts: number) {
      const v = this.c.skills[name]; if (!v) return
      v.personal = clamp(pts, 0, 99)
    },

    // ---------- weapons ----------
    addWeapon(w: Partial<Weapon>) {
      const id = genId()
      this.c.weapons.push({
        id,
        name: w.name ?? '',
        skill: w.skill ?? '',
        damage: w.damage ?? '',
        range: w.range ?? '',
        attacks: w.attacks ?? 1,
        ammo: w.ammo ?? '',
        malfunction: w.malfunction ?? ''
      })
    },
    removeWeapon(id: string) {
      this.c.weapons = this.c.weapons.filter(w => w.id !== id)
    },

    // ---------- portrait ----------
    setPortraitDataUrl(dataUrl: string) {
      this.c.portraitDataUrl = dataUrl
    },
    clearPortrait() {
      this.c.portraitDataUrl = ''
    },

    // ---------- skills: add/remove customs ----------
    addSkillSpecialization(parentKey: string, spec: string) {
      const label = spec.trim()
      if (!label) return

      let name: string
      if (parentKey === 'Language (Other)' || parentKey.startsWith('Language')) {
        name = `Language (${label})`
      } else if (parentKey === 'Art/Craft') {
        name = `Art/Craft (${label})`
      } else if (parentKey === 'Science') {
        name = `Science (${label})`
      } else if (parentKey === 'Pilot') {
        name = `Pilot (${label})`
      } else if (parentKey === 'Survival') {
        name = `Survival (${label})`
      } else if (parentKey.startsWith('Fighting')) {
        name = `Fighting (${label})`
      } else if (parentKey.startsWith('Firearms')) {
        name = `Firearms (${label})`
      } else {
        name = `${parentKey} (${label})`
      }

      if (this.c.skills[name]) return
      this.c.skills[name] = { base: baseForParent(parentKey), occ: 0, personal: 0 }
    },

    removeCustomSkill(name: string) {
      if (name in BASE_SKILLS) return
      if (!this.c.skills[name]) return
      delete this.c.skills[name]
      this.c.weapons = this.c.weapons.map(w =>
        w.skill === name ? { ...w, skill: '' } : w
      )
    },

    // ---------- import / export ----------
    exportAsJson(pretty = true): string {
      // include a version so we can evolve format later
      const payload = { version: 1, character: this.c }
      return JSON.stringify(payload, null, pretty ? 2 : 0)
    },

    importFromJson(input: any, opts: ImportOpts = {}): ImportResult {
      try {
        const errors: string[] = []
        const merge = !!opts.merge

        // accept envelope or raw character object
        const data = (input && typeof input === 'object' && 'character' in input)
          ? (input.character as any)
          : input

        if (!data || typeof data !== 'object') {
          return { ok: false, errors: ['No character object found.'] }
        }

        // Start from either fresh default (replace) or clone current (merge)
        const target: Character = merge
          ? structuredClone(this.c)
          : makeDefaultCharacter()

        // --- shallow fields
        const assignIf = (key: keyof Character) => {
          if (key in data) (target as any)[key] = (data as any)[key]
        }
        ;[
          'name','player','occupation','occupationKey','age','sex',
          'residence','birthplace','background','creditRating',
          'portraitDataUrl','luck','sanStart','statuses'
        ].forEach(k => assignIf(k as keyof Character))

        // --- stats
        if (data.stats && typeof data.stats === 'object') {
          for (const k of ['STR','CON','SIZ','DEX','APP','INT','POW','EDU'] as StatKey[]) {
            const v = Number(data.stats[k])
            if (Number.isFinite(v)) target.stats[k] = clamp(v, 15, 90)
          }
        }

        // --- skills
        target.skills = buildSkillMap(data.skills)

        // --- weapons
        if (Array.isArray(data.weapons)) {
          const mapped: Weapon[] = data.weapons.map((w: any) => ({
            id: typeof w?.id === 'string' && w.id ? w.id : genId(),
            name: String(w?.name ?? ''),
            skill: String(w?.skill ?? ''),
            damage: String(w?.damage ?? ''),
            range: String(w?.range ?? ''),
            attacks: Number.isFinite(+w?.attacks) ? +w.attacks : 1,
            ammo: String(w?.ammo ?? ''),
            malfunction: String(w?.malfunction ?? '')
          }))
          target.weapons = merge ? [...target.weapons, ...mapped] : mapped
        }

        // --- back page
        if (data.back && typeof data.back === 'object') {
          const b = data.back
          target.back.personalDescription = String(b.personalDescription ?? target.back.personalDescription)
          target.back.ideology = String(b.ideology ?? target.back.ideology)
          target.back.injuriesScars = String(b.injuriesScars ?? target.back.injuriesScars)
          target.back.phobiasManias = String(b.phobiasManias ?? target.back.phobiasManias)
          target.back.arcaneTomesSpellsArtifacts = String(b.arcaneTomesSpellsArtifacts ?? target.back.arcaneTomesSpellsArtifacts)
          target.back.encounters = String(b.encounters ?? target.back.encounters)
          target.back.gear = String(b.gear ?? target.back.gear)
          if (Array.isArray(b.significantPeople)) target.back.significantPeople = b.significantPeople
          if (Array.isArray(b.meaningfulLocations)) target.back.meaningfulLocations = b.meaningfulLocations
          if (Array.isArray(b.treasuredPossessions)) target.back.treasuredPossessions = b.treasuredPossessions
          if (Array.isArray(b.traits)) target.back.traits = b.traits
          if (b.cash && typeof b.cash === 'object') {
            target.back.cash.spendingLevel = Number.isFinite(+b.cash.spendingLevel) ? +b.cash.spendingLevel : target.back.cash.spendingLevel
            target.back.cash.cash = Number.isFinite(+b.cash.cash) ? +b.cash.cash : target.back.cash.cash
            target.back.cash.assets = String(b.cash.assets ?? target.back.cash.assets)
          }
        }

        // --- recalc and clamp trackers
        const { hpMax, mpMax, sanMax } = calcDerivedMax(target)
        if (Number.isFinite(+data.hp))  target.hp  = clamp(+data.hp,  0, hpMax)
        else                            target.hp  = Math.min(target.hp, hpMax)
        if (Number.isFinite(+data.mp))  target.mp  = clamp(+data.mp,  0, mpMax)
        else                            target.mp  = Math.min(target.mp, mpMax)
        if (Number.isFinite(+data.san)) target.san = clamp(+data.san, 0, sanMax)
        else                            target.san = Math.min(target.san, sanMax)

        // apply
        this.c = target
        return errors.length ? { ok: false, errors } : { ok: true }
      } catch (e: any) {
        return { ok: false, errors: [String(e?.message ?? e)] }
      }
    },

    // ---------- misc ----------
    reset() {
      this.c = makeDefaultCharacter()
    }
  },

  // pinia-plugin-persistedstate
  persist: { key: 'coc7e-builder', paths: ['c'] } as any
})
