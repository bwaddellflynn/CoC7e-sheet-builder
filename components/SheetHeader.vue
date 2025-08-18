<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '~/stores/character'
import { OCCUPATIONS } from '~/stores/constants/occupations'

const store = useCharacterStore()
const { occDef, occBudget, piBudget, occSpent, piSpent } = storeToRefs(store)

const crMin = computed(() => occDef.value?.creditRange[0] ?? 0)
const crMax = computed(() => occDef.value?.creditRange[1] ?? 99)
const crInRange = computed(() =>
  store.c.creditRating >= crMin.value && store.c.creditRating <= crMax.value
)

function onSelectOccupation(ev: Event) {
  const key = (ev.target as HTMLSelectElement).value || null
  store.setOccupation(key)
}
</script>

<template>
  <div class="p-2 rounded-lg border bg-white">
    <h2 class="text-sm font-semibold mb-2">Investigator</h2>

    <div class="space-y-2">
      <!-- Name -->
      <div class="row">
        <label for="name" class="field-label">Investigator</label>
        <input
          id="name"
          v-model="store.c.name"
          type="text"
          class="input-line"
          placeholder="Margaret Donnelly"
        />
      </div>

      <!-- Occupation (select) -->
      <div class="row">
        <label for="occupationKey" class="field-label">Select Occ</label>
        <select
          id="occupationKey"
          class="input-line !border-b !border-gray-300 !rounded-none !px-0 !py-0.5 text-xs"
          :value="store.c.occupationKey ?? ''"
          @change="onSelectOccupation"
        >
          <option value="">— Select an occupation —</option>
          <option v-for="o in OCCUPATIONS" :key="o.key" :value="o.key">
            {{ o.label }}
          </option>
        </select>
      </div>

      <!-- (Optional) show resolved occupation label as read-only text -->
      <div v-if="store.c.occupation" class="row">
        <label class="field-label">Occupation</label>
        <div class="text-xs">{{ store.c.occupation }}</div>
      </div>

      <!-- Player -->
      <div class="row">
        <label for="player" class="field-label">Player</label>
        <input
          id="player"
          v-model="store.c.player"
          type="text"
          class="input-line"
          placeholder="Player name"
        />
      </div>

      <!-- Age + Sex -->
      <div class="grid grid-cols-2 gap-2">
        <div class="row">
          <label for="age" class="field-label">Age</label>
          <input
            id="age"
            v-model.number="store.c.age"
            type="number"
            min="10"
            max="99"
            class="input-line text-right w-20"
          />
        </div>

        <div class="row">
          <label for="sex" class="field-label">Sex</label>
          <input
            id="sex"
            v-model="store.c.sex"
            type="text"
            class="input-line"
            placeholder=""
          />
        </div>
      </div>

      <!-- Residence -->
      <div class="row">
        <label for="residence" class="field-label">Residence</label>
        <input
          id="residence"
          v-model="store.c.residence"
          type="text"
          class="input-line"
          placeholder="Arkham, MA"
        />
      </div>

      <!-- Birthplace -->
      <div class="row">
        <label for="birthplace" class="field-label">Birthplace</label>
        <input
          id="birthplace"
          v-model="store.c.birthplace"
          type="text"
          class="input-line"
          placeholder="Boston, MA"
        />
      </div>

      <!-- Credit Rating + range hint -->
      <div class="row">
        <label for="credit" class="field-label">Credit Rating</label>
        <input
          id="credit"
          v-model.number="store.c.creditRating"
          type="number"
          min="0"
          max="99"
          :class="[
            'input-line text-right w-20',
            occDef ? (crInRange ? 'border-b-gray-300' : 'border-b-red-500') : ''
          ]"
        />
      </div>
      <div v-if="occDef" class="text-[11px] text-gray-600 -mt-1">
        Credit Rating range for {{ occDef.label }}:
        <span :class="crInRange ? '' : 'text-red-600 font-medium'">
          {{ crMin }}–{{ crMax }}
        </span>
      </div>

      <!-- Skill point budgets / totals -->
      <div class="flex flex-wrap items-center gap-2 text-[11px] mt-1">
        <span class="px-2 py-0.5 rounded border tabular-nums">
          Occupation: <strong>{{ occSpent }}</strong> / {{ occBudget }}
        </span>
        <span class="px-2 py-0.5 rounded border tabular-nums">
          Personal: <strong>{{ piSpent }}</strong> / {{ piBudget }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row { @apply flex items-center gap-2; }
.field-label { @apply w-auto shrink-0 text-[11px] uppercase tracking-wide text-gray-500 text-right; }
.input-line {
  @apply flex-1 bg-transparent border-0 border-b border-gray-300 rounded-none
         px-0 py-0.5 text-xs focus:outline-none focus:ring-0 focus:border-gray-800;
}
</style>
