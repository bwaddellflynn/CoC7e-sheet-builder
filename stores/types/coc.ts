export type StatKey = 'STR'|'CON'|'SIZ'|'DEX'|'APP'|'INT'|'POW'|'EDU'
export type SkillKey = string

export type SkillEntry = { base: number; points: number }
export type SkillsMap = Record<SkillKey, SkillEntry>

export interface Weapon {
  id: string
  name: string
  skill: string
  damage: string
  range?: string
  attacks?: number
  ammo?: string
  malfunction?: string
}

export interface Character {
  // Identity
  name: string
  player: string
  occupation: string
  age: number
  residence: string
  background: string

  // Money/standing
  creditRating: number

  // Core stats & skills
  stats: Record<StatKey, number>   // 3–18 ×5 values (e.g., 60)
  skills: SkillsMap
  weapons: Weapon[]

  // Current trackers
  hp: number
  mp: number
  san: number
  luck: number

  // Portrait (persisted as base64 data URL)
  portraitDataUrl?: string
}

// Optional: type for your derived helper result
export interface DerivedMax {
  hpMax: number
  mpMax: number
  sanMax: number
  db: string
  build: number
  move: number
}
