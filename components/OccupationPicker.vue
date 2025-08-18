<!-- components/OccupationPicker.vue -->
<script setup lang="ts">
import { useCharacterStore } from '~/stores/character'
import { OCCUPATIONS } from '~/stores/constants/occupations'
const store = useCharacterStore()
</script>

<template>
  <div class="p-3 rounded-xl border bg-white">
    <label class="block text-xs font-semibold mb-1">Occupation</label>
    <select
      class="w-full border rounded px-2 py-1"
      :value="store.c.occupationKey ?? ''"
      @change="store.setOccupation(($event.target as HTMLSelectElement).value || null)"
    >
      <option value="">— Select an occupation —</option>
      <option v-for="o in OCCUPATIONS" :key="o.key" :value="o.key">{{ o.label }}</option>
    </select>

    <div v-if="store.occDef" class="mt-2 text-xs text-gray-600">
      Credit Rating: {{ store.occDef.creditRange[0] }}–{{ store.occDef.creditRange[1] }} ·
      OSP: {{ store.occBudget }} · PI: {{ store.piBudget }}
    </div>
  </div>
</template>
