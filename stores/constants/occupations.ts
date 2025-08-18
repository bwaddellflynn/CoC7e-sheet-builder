// ~/stores/constants/occupations.ts
import type { StatKey } from '~/stores/types/coc'

export type OspFormula = (stats: Record<StatKey, number>) => number

export const EDUx4: OspFormula        = s => s.EDU * 4
export const EDU2_DEX2: OspFormula    = s => s.EDU * 2 + s.DEX * 2
export const EDU2_APP2: OspFormula    = s => s.EDU * 2 + s.APP * 2

type SkillChoice =
  | { type: 'fixed'; name: string }
  | { type: 'any'; category: 'Language'|'Science'|'Art/Craft'|'Pilot'|'Survival'|'Fighting'|'Firearms'; count: number }
  | { type: 'choose'; count: number; from: string[] }  // simple pick list

export interface OccupationDef {
  key: string
  label: string
  creditRange: [number, number]
  formula: OspFormula
  skills: SkillChoice[]
}

export const OCCUPATIONS: OccupationDef[] = [
  {
    key: 'student',
    label: 'Student (Miskatonic)',
    creditRange: [5, 40],
    formula: EDUx4,
    skills: [
      { type: 'fixed', name: 'Library Use' },
      { type: 'fixed', name: 'Listen' },
      { type: 'fixed', name: 'Psychology' },
      { type: 'fixed', name: 'Spot Hidden' },
      { type: 'any', category: 'Language', count: 1 },
      { type: 'any', category: 'Science', count: 1 },
      { type: 'choose', count: 2, from: ['First Aid','History','Navigate','Occult','Persuade','Ride','Stealth','Sleight of Hand'] },
      // Credit Rating always allowed (handled in store)
    ]
  },
  {
    key: 'prof_science',
    label: 'Professor (Science)',
    creditRange: [20, 60],
    formula: EDUx4,
    skills: [
      { type: 'fixed', name: 'Library Use' },
      { type: 'any', category: 'Science', count: 2 },        // e.g., Meteorology, Biology
      { type: 'choose', count: 1, from: ['History','Anthropology'] },
      { type: 'choose', count: 1, from: ['Persuade','Psychology'] },
      { type: 'any', category: 'Language', count: 1 }
    ]
  },
  {
    key: 'prof_occult',
    label: 'Professor (Occult/Anthro)',
    creditRange: [10, 60],
    formula: EDUx4,
    skills: [
      { type: 'fixed', name: 'Library Use' },
      { type: 'fixed', name: 'History' },
      { type: 'fixed', name: 'Anthropology' },
      { type: 'fixed', name: 'Occult' },
      { type: 'any', category: 'Language', count: 1 },
      { type: 'choose', count: 1, from: ['Persuade','Psychology'] }
    ]
  },
  {
    key: 'sailor',
    label: 'Sailor (Captain/Seaman)',
    creditRange: [9, 40],
    formula: EDU2_DEX2,
    skills: [
      { type: 'fixed', name: 'Navigate' },
      { type: 'any', category: 'Pilot', count: 1 },          // Pilot (Boat)
      { type: 'fixed', name: 'Swim' },
      { type: 'fixed', name: 'Climb' },
      { type: 'fixed', name: 'Mechanical Repair' },
      { type: 'fixed', name: 'Spot Hidden' },
      { type: 'choose', count: 1, from: ['Fighting (Brawl)','Firearms (Rifle/Shotgun)'] },
      { type: 'choose', count: 1, from: ['First Aid','Survival (Sea)'] }
    ]
  },
  {
    key: 'engineer_civil',
    label: 'Engineer (Civil)',
    creditRange: [30, 60],
    formula: EDUx4,
    skills: [
      { type: 'fixed', name: 'Mechanical Repair' },
      { type: 'fixed', name: 'Operate Heavy Machinery' },
      { type: 'fixed', name: 'Navigate' },
      { type: 'fixed', name: 'Spot Hidden' },
      { type: 'any', category: 'Science', count: 1 },        // e.g., Engineering
      { type: 'choose', count: 1, from: ['Library Use','Persuade'] }
    ]
  },
  {
    key: 'medic',
    label: 'Medic / Doctor',
    creditRange: [30, 80],
    formula: EDUx4,
    skills: [
      { type: 'fixed', name: 'First Aid' },
      { type: 'fixed', name: 'Medicine' },
      { type: 'fixed', name: 'Psychology' },
      { type: 'any', category: 'Science', count: 2 },        // e.g., Biology, Pharmacy
      { type: 'choose', count: 1, from: ['Library Use','Persuade','Science (Biology)'] },
      { type: 'any', category: 'Language', count: 1 }
    ]
  }
]

// helper to resolve category name from a concrete skill label
export function categoryOf(skillName: string): null | 'Language'|'Science'|'Art/Craft'|'Pilot'|'Survival'|'Fighting'|'Firearms' {
  if (skillName.startsWith('Language (')) return 'Language'
  if (skillName.startsWith('Science (')) return 'Science'
  if (skillName.startsWith('Art/Craft (')) return 'Art/Craft'
  if (skillName.startsWith('Pilot (')) return 'Pilot'
  if (skillName.startsWith('Survival (')) return 'Survival'
  if (skillName.startsWith('Fighting (')) return 'Fighting'
  if (skillName.startsWith('Firearms (')) return 'Firearms'
  return null
}
