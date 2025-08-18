export type StatKey = 'STR'|'CON'|'SIZ'|'DEX'|'APP'|'INT'|'POW'|'EDU'

export interface SkillEntry {
  base: number
  occ: number       // Occupation points spent
  personal: number  // Personal Interest points spent
}

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

export interface StatusFlags {
  majorWound: boolean
  tempInsane: boolean
  indefInsane: boolean
}

export interface Backstory {
  personalDescription: string
  ideology: string
  significantPeople: Array<{ name: string; why: string }>
  meaningfulLocations: string[]
  treasuredPossessions: string[]
  traits: string[]
  injuriesScars: string
  phobiasManias: string
  arcaneTomesSpellsArtifacts: string
  encounters: string
  gear: string
  cash: { spendingLevel: number; cash: number; assets: string }
}

export interface Character {
  // Identity
  name: string
  player: string
  occupation: string
  occupationKey: string | null   // key into OCCUPATIONS (null if none selected)
  age: number
  sex: string
  residence: string
  birthplace: string
  background: string

  // Money/standing
  creditRating: number

  // Core stats & skills
  stats: Record<StatKey, number>           // 3–18 ×5 values (e.g., 60)
  skills: Record<string, SkillEntry>       // includes custom/specialized skills
  weapons: Weapon[]

  // Current trackers
  hp: number
  mp: number
  san: number
  luck: number

  // Portrait (persisted as base64 data URL)
  portraitDataUrl: string

  // Status flags & starting SAN
  statuses: StatusFlags
  sanStart: number

  // Backstory components
  back: Backstory
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
