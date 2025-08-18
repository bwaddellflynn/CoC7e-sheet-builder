<script setup lang="ts">
import { useCharacterStore } from '~/stores/character'
import type { StatKey } from '~/stores/types/coc'
import ValueSplit from '@/components/ValueSplit.vue'

type StatCell = { kind: 'stat'; key: StatKey }
type MoveCell = { kind: 'move' }
type Cell = StatCell | MoveCell

// Row-major 3x3: STR | DEX | POW / CON | APP | EDU / SIZ | INT | MOVE
const cells: Cell[] = [
  { kind: 'stat', key: 'STR' }, { kind: 'stat', key: 'DEX' }, { kind: 'stat', key: 'POW' },
  { kind: 'stat', key: 'CON' }, { kind: 'stat', key: 'APP' }, { kind: 'stat', key: 'EDU' },
  { kind: 'stat', key: 'SIZ' }, { kind: 'stat', key: 'INT' }, { kind: 'move' }
]

const store = useCharacterStore()
function setStat(key: StatKey, val: number) { store.setStat(key, val) }
</script>

<template>
  <div class="p-3 rounded-xl border bg-white">
    <h2 class="text-base font-semibold mb-2">Characteristics</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div
        v-for="cell in cells"
        :key="cell.kind === 'stat' ? cell.key : 'MOVE'"
        class="p-2 rounded-lg border"
      >
        <!-- Stat cells: label ABOVE the control -->
        <template v-if="cell.kind === 'stat'">
          <div class="space-y-1">
            <div class="text-sm font-semibold leading-tight">{{ cell.key }}</div>
            <ValueSplit
              :model-value="store.c.stats[cell.key]"
              size="xxs"
              :min="15" :max="90" :step="5"
              @update:modelValue="v => setStat(cell.key, v)"
            />
          </div>
        </template>

        <!-- Move Rate: label ABOVE the value -->
        <template v-else>
          <div class="space-y-1">
            <div class="text-sm font-semibold leading-tight">Move Rate</div>
            <div class="flex items-baseline gap-2">
              <div class="text-base font-semibold">{{ store.derivedMax.move }}</div>
              <div class="text-[10px] text-gray-500">STR/DEX vs SIZ · age {{ store.c.age }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
