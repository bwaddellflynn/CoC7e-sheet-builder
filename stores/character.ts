import { defineStore } from 'pinia'
import { BASE_SKILLS } from '~/stores/constants/skills'
import type { Character, StatKey, Weapon } from '~/stores/types/coc'
import { calcDerivedMax } from '~/stores/utils/derived'

const genId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? (crypto as any).randomUUID()
    : Math.random().toString(36).slice(2)

function makeDefaultCharacter(): Character {
  const stats: Record<StatKey, number> = {
    STR: 50, CON: 60, SIZ: 55, DEX: 60, APP: 55, INT: 65, POW: 60, EDU: 70
  }
  const skills = Object.fromEntries(
    Object.entries(BASE_SKILLS).map(([k, base]) => [k, { base, points: 0 }])
  )

  const c: Character = {
    name: 'Investigator',
    player: '',
    occupation: '',
    age: 25,
    residence: '',
    background: '',
    creditRating: 0,
    stats,
    skills,
    weapons: [],
    portraitDataUrl: '',
    hp: 0, mp: 0, san: 0, luck: 50
  }

  const { hpMax, mpMax, sanMax } = calcDerivedMax(c)
  c.hp = hpMax; c.mp = mpMax; c.san = sanMax
  return c
}

export const useCharacterStore = defineStore('character', {
  state: () => ({ c: makeDefaultCharacter() }),

  getters: {
    derivedMax: (s) => calcDerivedMax(s.c),
    dodge:      (s) => Math.floor(s.c.stats.DEX / 2),
    langOwn:    (s) => s.c.stats.EDU
  },

  actions: {
    setStat(k: StatKey, v: number) {
      this.c.stats[k] = Math.max(15, Math.min(90, Math.round(v)))
      const { hpMax, mpMax, sanMax } = calcDerivedMax(this.c)
      this.c.hp  = Math.min(this.c.hp,  hpMax)
      this.c.mp  = Math.min(this.c.mp,  mpMax)
      this.c.san = Math.min(this.c.san, sanMax)
    },

    setSkillPoints(name: string, pts: number) {
      if (!this.c.skills[name]) return
      // cap to 99 unless you deliberately want 90
      this.c.skills[name].points = Math.max(0, Math.min(99, Math.round(pts)))
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

    addSkillSpecialization(parentKey: string, label: string) {
        const name = label.trim()
        if (!name) return

        // Decide the new key prefix and the base to copy
        let newKeyPrefix = parentKey
        let baseKey = parentKey

        // Language: always use "Language (Other)" as base, and key as "Language (Other) (X)"
        if (parentKey.startsWith('Language')) {
            newKeyPrefix = 'Language (Other)'
            baseKey = 'Language (Other)'
        }

        // Fighting: create "Fighting (X)" regardless of which Fighting parent was clicked,
        // copy that parent's base (e.g., Brawl 25)
        if (parentKey.startsWith('Fighting')) {
            newKeyPrefix = 'Fighting'
            // Keep the clicked parent's base (e.g., Brawl 25) if present, else generic Fighting base
            baseKey = (parentKey in BASE_SKILLS) ? parentKey : 'Fighting'
        }

        // Firearms: create "Firearms (X)" and copy the clicked parent's base
        if (parentKey.startsWith('Firearms')) {
            newKeyPrefix = 'Firearms'
            baseKey = (parentKey in BASE_SKILLS) ? parentKey : 'Firearms'
        }

        const key = `${newKeyPrefix} (${name})`
        if (this.c.skills[key]) return

        const base = BASE_SKILLS[baseKey] ?? 1
        this.c.skills[key] = { base, points: 0 }
    },


    // handy extra
    reset() {
      this.c = makeDefaultCharacter()
    }
  },

  // Using pinia-plugin-persistedstate
  persist: { key: 'coc7e-builder', paths: ['c'] } as any
})
