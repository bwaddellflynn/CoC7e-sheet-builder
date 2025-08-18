import { defineStore } from 'pinia'
import { BASE_SKILLS } from '~/stores/constants/skills'
import { calcDerivedMax } from '~/stores/utils/derived'
import type { Character, StatKey, Weapon } from '~/stores/types/coc'

// NEW: occupation table & helpers (add this file per earlier message)
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

  // CHANGED: skills now have { base, occ, personal }
  const skills = Object.fromEntries(
    Object.entries(BASE_SKILLS).map(([k, base]) => [k, { base, occ: 0, personal: 0 }])
  )

  const c: Character = {
    name: 'Investigator',
    player: '',
    occupation: '',
    occupationKey: null,            // NEW: link to OCCUPATIONS
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

export const useCharacterStore = defineStore('character', {
  state: () => ({ c: makeDefaultCharacter() }),

  getters: {
    // ok to keep as arrow (uses only state)
    derivedMax: (s) => calcDerivedMax(s.c),

    // ok as arrow (only state)
    occDef: (s): OccupationDef | undefined =>
        OCCUPATIONS.find(o => o.key === s.c.occupationKey),

    // use function syntax to access other getters via `this`
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

    // getter that returns a function; uses `this` to see occDef
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

    // convenience getters
    dodge:   (s) => Math.floor(s.c.stats.DEX / 2),
    langOwn: (s) => s.c.stats.EDU,
    },


  actions: {
    // NEW: choose an occupation (updates display name too)
    setOccupation(key: string | null) {
      this.c.occupationKey = key
      const def = OCCUPATIONS.find(o => o.key === key)
      this.c.occupation = def?.label ?? ''
    },

    setStat(k: StatKey, v: number) {
      this.c.stats[k] = Math.max(15, Math.min(90, Math.round(v)))
      const { hpMax, mpMax, sanMax } = calcDerivedMax(this.c)
      this.c.hp  = Math.min(this.c.hp,  hpMax)
      this.c.mp  = Math.min(this.c.mp,  mpMax)
      this.c.san = Math.min(this.c.san, sanMax)
    },

    // BACK-COMPAT: treat this as editing Personal Interest points
    setSkillPoints(name: string, pts: number) {
      const v = this.c.skills[name]; if (!v) return
      v.personal = Math.max(0, Math.min(99, Math.round(pts)))
    },

    // NEW: explicit spend setters
    setOccPoints(name: string, pts: number) {
      const v = this.c.skills[name]; if (!v) return
      v.occ = Math.max(0, Math.min(99, Math.round(pts)))
    },
    setPersonalPoints(name: string, pts: number) {
      const v = this.c.skills[name]; if (!v) return
      v.personal = Math.max(0, Math.min(99, Math.round(pts)))
    },

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

    setPortraitDataUrl(dataUrl: string) {
      this.c.portraitDataUrl = dataUrl
    },

    clearPortrait() {
      this.c.portraitDataUrl = ''
    },

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
      // don't delete core skills
      if (name in BASE_SKILLS) return
      if (!this.c.skills[name]) return

      delete this.c.skills[name]

      // clear weapons referencing it
      this.c.weapons = this.c.weapons.map(w =>
        w.skill === name ? { ...w, skill: '' } : w
      )
    },

    reset() {
      this.c = makeDefaultCharacter()
    }
  },

  // pinia-plugin-persistedstate
  persist: { key: 'coc7e-builder', paths: ['c'] } as any
})
