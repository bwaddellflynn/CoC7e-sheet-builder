import type { Character } from '~/stores/types/coc' // keep your Option B path

const dbTable = [
  { max: 64, db: '-2', build: -2 },
  { max: 84, db: '-1', build: -1 },
  { max:124, db: '0',  build: 0  },
  { max:164, db: '+1D4', build: 1 },
  { max:204, db: '+1D6', build: 2 },
  { max:284, db: '+2D6', build: 3 }
]

function moveFromStatsAndAge(STR:number, DEX:number, SIZ:number, age:number) {
  // RAW comparison vs SIZ
  let move = (STR > SIZ && DEX > SIZ) ? 9
           : (STR < SIZ && DEX < SIZ) ? 7
           : 8
  // Age modifiers
  if (age >= 80) move -= 5
  else if (age >= 70) move -= 4
  else if (age >= 60) move -= 3
  else if (age >= 50) move -= 2
  else if (age >= 40) move -= 1

  return Math.max(2, move) // keep a sensible floor
}

export function calcDerivedMax(c: Character) {
  const { STR, CON, SIZ, DEX, POW } = c.stats
  const hpMax = Math.ceil((CON + SIZ) / 10)
  const mpMax = Math.floor(POW / 5)
  const sanMax = POW
  const sum = STR + SIZ
  const row = dbTable.find(r => sum <= r.max) ?? dbTable[dbTable.length-1]
  const move = moveFromStatsAndAge(STR, DEX, SIZ, c.age ?? 25)

  return { hpMax, mpMax, sanMax, db: row.db, build: row.build, move }
}
