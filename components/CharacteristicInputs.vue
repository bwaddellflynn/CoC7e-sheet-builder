<script setup lang="ts">
import type { StatKey } from '~/stores/types/coc'
import { useCharacterStore } from '~/stores/character'

const store = useCharacterStore()

// Columns
const col1: StatKey[] = ['STR','CON','SIZ']
const col2: StatKey[] = ['DEX','APP','INT']
const col3: StatKey[] = ['POW','EDU'] // the 3rd "row" here will be Move Rate cell

function step(k: StatKey, delta: number) {
  store.setStat(k, store.c.stats[k] + delta)
}
</script>

<template>
  <div class="p-4 rounded-2xl border bg-white">
    <h2 class="font-semibold mb-3">Characteristics</h2>

    <!-- 3 columns -->
    <div class="grid md:grid-cols-3 print:grid-cols-3 gap-3">
      <!-- Column 1 -->
      <div class="space-y-3">
        <div v-for="k in col1" :key="k" class="p-3 rounded-xl border">
          <div class="text-sm font-medium">{{ k }}</div>
          <div class="mt-2 flex print:flex items-center gap-2">
            <button class="px-2 py-1 rounded bg-gray-100" @click="step(k,-5)">–5</button>
            <input
              type="number"
              class="w-24 border rounded px-2 py-1 text-right"
              :value="store.c.stats[k]"
              @input="store.setStat(k, +($event.target as HTMLInputElement).value)"
            />
            <button class="px-2 py-1 rounded bg-gray-100" @click="step(k,5)">+5</button>
          </div>
        </div>
      </div>

      <!-- Column 2 -->
      <div class="space-y-3">
        <div v-for="k in col2" :key="k" class="p-3 rounded-xl border">
          <div class="text-sm font-medium">{{ k }}</div>
          <div class="mt-2 flex print:flex items-center gap-2">
            <button class="px-2 py-1 rounded bg-gray-100" @click="step(k,-5)">–5</button>
            <input
              type="number"
              class="w-24 border rounded px-2 py-1 text-right"
              :value="store.c.stats[k]"
              @input="store.setStat(k, +($event.target as HTMLInputElement).value)"
            />
            <button class="px-2 py-1 rounded bg-gray-100" @click="step(k,5)">+5</button>
          </div>
        </div>
      </div>

      <!-- Column 3 -->
      <div class="space-y-3">
        <!-- POW / EDU -->
        <div v-for="k in col3" :key="k" class="p-3 rounded-xl border">
          <div class="text-sm font-medium">{{ k }}</div>
          <div class="mt-2 flex print:flex items-center gap-2">
            <button class="px-2 py-1 rounded bg-gray-100" @click="step(k,-5)">–5</button>
            <input
              type="number"
              class="w-24 border rounded px-2 py-1 text-right"
              :value="store.c.stats[k]"
              @input="store.setStat(k, +($event.target as HTMLInputElement).value)"
            />
            <button class="px-2 py-1 rounded bg-gray-100" @click="step(k,5)">+5</button>
          </div>
        </div>

        <!-- Move Rate cell (3rd row of column 3) -->
        <div class="p-3 rounded-xl border">
          <div class="text-sm font-medium">Move Rate</div>
          <div class="mt-2 flex items-baseline gap-2">
            <div class="text-2xl font-semibold">{{ store.derivedMax.move }}</div>
            <div class="text-xs text-gray-500">
              Based on STR/DEX vs SIZ and age {{ store.c.age || 25 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
