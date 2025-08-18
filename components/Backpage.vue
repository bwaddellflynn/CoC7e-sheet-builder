<script setup lang="ts">
import { useCharacterStore } from '~/stores/character'
const store = useCharacterStore()

function addRow(arr: any[], val: any) { arr.push(val) }
function removeRow(arr: any[], idx: number) { arr.splice(idx, 1) }
</script>

<template>
  <!-- Force 2 cols on print -->
  <div class="grid gap-4 grid-cols-1 md:grid-cols-2 print:grid-cols-2 print:gap-2">
    <!-- LEFT COLUMN -->
    <div class="space-y-4 print:space-y-2">
      <!-- Backstory blocks -->
      <section class="p-3 rounded-xl border bg-white avoid-break">
        <h3 class="text-sm font-semibold mb-2">Personal Description</h3>
        <textarea v-model="store.c.back.personalDescription" class="w-full border rounded p-2 text-sm" rows="3" />
      </section>

      <section class="p-3 rounded-xl border bg-white avoid-break">
        <h3 class="text-sm font-semibold mb-2">Ideology / Beliefs</h3>
        <textarea v-model="store.c.back.ideology" class="w-full border rounded p-2 text-sm" rows="3" />
      </section>

      <section class="p-3 rounded-xl border bg-white avoid-break">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">Significant People</h3>
          <button class="px-2 py-1 rounded border text-xs" @click="addRow(store.c.back.significantPeople, { name:'', why:'' })">Add</button>
        </div>
        <div class="mt-2 space-y-2 print:space-y-1">
          <div v-for="(p, i) in store.c.back.significantPeople" :key="i" class="rounded border p-2">
            <div class="flex gap-2">
              <input v-model="p.name" class="flex-1 border rounded px-2 py-1 text-sm" placeholder="Name" />
              <button class="px-2 rounded border text-xs" @click="removeRow(store.c.back.significantPeople, i)">✕</button>
            </div>
            <input v-model="p.why" class="mt-2 w-full border rounded px-2 py-1 text-sm" placeholder="Why significant?" />
          </div>
        </div>
      </section>

      <section class="p-3 rounded-xl border bg-white avoid-break">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">Meaningful Locations</h3>
          <button class="px-2 py-1 rounded border text-xs" @click="addRow(store.c.back.meaningfulLocations, '')">Add</button>
        </div>
        <div class="mt-2 space-y-2 print:space-y-1">
          <div v-for="(loc, i) in store.c.back.meaningfulLocations" :key="i" class="flex gap-2">
            <input v-model="store.c.back.meaningfulLocations[i]" class="flex-1 border rounded px-2 py-1 text-sm" />
            <button class="px-2 rounded border text-xs" @click="removeRow(store.c.back.meaningfulLocations, i)">✕</button>
          </div>
        </div>
      </section>

      <section class="p-3 rounded-xl border bg-white avoid-break">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">Treasured Possessions</h3>
          <button class="px-2 py-1 rounded border text-xs" @click="addRow(store.c.back.treasuredPossessions, '')">Add</button>
        </div>
        <div class="mt-2 space-y-2 print:space-y-1">
          <div v-for="(v, i) in store.c.back.treasuredPossessions" :key="i" class="flex gap-2">
            <input v-model="store.c.back.treasuredPossessions[i]" class="flex-1 border rounded px-2 py-1 text-sm" />
            <button class="px-2 rounded border text-xs" @click="removeRow(store.c.back.treasuredPossessions, i)">✕</button>
          </div>
        </div>
      </section>

      <section class="p-3 rounded-xl border bg-white avoid-break">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">Traits</h3>
          <button class="px-2 py-1 rounded border text-xs" @click="addRow(store.c.back.traits, '')">Add</button>
        </div>
        <div class="mt-2 space-y-2 print:space-y-1">
          <div v-for="(v, i) in store.c.back.traits" :key="i" class="flex gap-2">
            <input v-model="store.c.back.traits[i]" class="flex-1 border rounded px-2 py-1 text-sm" />
            <button class="px-2 rounded border text-xs" @click="removeRow(store.c.back.traits, i)">✕</button>
          </div>
        </div>
      </section>
    </div>

    <!-- RIGHT COLUMN -->
    <div class="space-y-4 print:space-y-2">
      <section class="p-3 rounded-xl border bg-white avoid-break">
        <h3 class="text-sm font-semibold mb-2">Injuries & Scars</h3>
        <textarea v-model="store.c.back.injuriesScars" class="w-full border rounded p-2 text-sm" rows="3" />
      </section>

      <section class="p-3 rounded-xl border bg-white avoid-break">
        <h3 class="text-sm font-semibold mb-2">Phobias & Manias</h3>
        <textarea v-model="store.c.back.phobiasManias" class="w-full border rounded p-2 text-sm" rows="3" />
      </section>

      <section class="p-3 rounded-xl border bg-white avoid-break">
        <h3 class="text-sm font-semibold mb-2">Arcane Tomes, Spells & Artifacts</h3>
        <textarea v-model="store.c.back.arcaneTomesSpellsArtifacts" class="w-full border rounded p-2 text-sm" rows="3" />
      </section>

      <section class="p-3 rounded-xl border bg-white avoid-break">
        <h3 class="text-sm font-semibold mb-2">Encounters with Strange Entities</h3>
        <textarea v-model="store.c.back.encounters" class="w-full border rounded p-2 text-sm" rows="3" />
      </section>

      <section class="p-3 rounded-xl border bg-white avoid-break">
        <h3 class="text-sm font-semibold mb-2">Equipment & Gear</h3>
        <textarea v-model="store.c.back.gear" class="w-full border rounded p-2 text-sm" rows="4" />
      </section>

      <section class="p-3 rounded-xl border bg-white avoid-break">
        <h3 class="text-sm font-semibold mb-2">Cash & Assets</h3>
        <div class="grid grid-cols-3 gap-2 print:gap-1">
          <div>
            <div class="text-[11px] uppercase text-gray-500">Spending Level</div>
            <input type="number" v-model.number="store.c.back.cash.spendingLevel" class="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <div class="text-[11px] uppercase text-gray-500">Cash</div>
            <input type="number" v-model.number="store.c.back.cash.cash" class="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div class="col-span-3">
            <div class="text-[11px] uppercase text-gray-500">Assets</div>
            <textarea v-model="store.c.back.cash.assets" class="w-full border rounded p-2 text-sm" rows="2" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Keep cards from splitting across pages when printing */
@media print {
  .avoid-break { break-inside: avoid; }
  /* Optional: reduce big rounding/padding a bit on paper */
  .rounded-xl { border-radius: 10px; }
}
</style>
