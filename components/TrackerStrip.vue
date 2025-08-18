<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useCharacterStore } from '~/stores/character'
import NumberTrack from '~/components/NumberTrack.vue'

const store = useCharacterStore()

// Derived maxima (used for marking the max on the track)
const hpMax  = computed(() => store.derivedMax.hpMax)   // ring marker only
const mpMax  = computed(() => store.derivedMax.mpMax)   // ring marker only
const sanMax = computed(() => store.derivedMax.sanMax)  // ring marker

// Clamp currents to the printed ranges (HP 0–20, MP 0–24, SAN/Luck 1–99)
watchEffect(() => {
  store.c.hp   = Math.min(Math.max(store.c.hp,   0),  20)
  store.c.mp   = Math.min(Math.max(store.c.mp,   0),  24)
  store.c.san  = Math.min(Math.max(store.c.san,  1),  99)
  store.c.luck = Math.min(Math.max(store.c.luck, 1),  99)
})
</script>

<template>
  <div class="p-3 rounded-xl border bg-white">
    <!-- Row 1: HP (narrow) | SAN (wide) -->
    <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
      <!-- Hit Points: fixed 0–20; mark = derived max -->
      <div class="p-2 rounded-lg border bg-gradient-to-b from-white to-gray-50">
        <NumberTrack
          v-model="store.c.hp"
          :mark="hpMax"
          label="Hit Points (Max 20)"
          :start="0"
          :end="20"
          :rows="5"
          head-label="Dying|Unconscious"
          :head-span="4"
        />
        <div class="mt-2 flex items-center gap-3 text-[11px] text-gray-700">
          <label class="inline-flex items-center gap-1">
            <input type="checkbox" v-model="(store.c.statuses as any).majorWound" class="h-3.5 w-3.5">
            <span class="uppercase tracking-wide">Major Wound</span>
          </label>
          <span v-if="store.c.hp === 0" class="px-1.5 py-0.5 rounded bg-red-100 text-red-700">
            Unconscious / Dying
          </span>
        </div>
      </div>

      <!-- Sanity: 1–99; mark = SAN max -->
      <div class="p-2 rounded-lg border bg-gradient-to-b from-white to-gray-50">
        <NumberTrack
            v-model="store.c.san"
            :mark="sanMax"
            label="Sanity (01–99)"
            :start="1"
            :end="99"
            :rows="5"
            head-label="Insane"
            :head-span="6"
        />
        <div class="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-700">
          <label class="inline-flex items-center gap-1">
            <input type="checkbox" v-model="(store.c.statuses as any).tempInsane" class="h-3.5 w-3.5">
            <span class="uppercase tracking-wide">Temp. Insane</span>
          </label>
          <label class="inline-flex items-center gap-1">
            <input type="checkbox" v-model="(store.c.statuses as any).indefInsane" class="h-3.5 w-3.5">
            <span class="uppercase tracking-wide">Indef. Insane</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Row 2: Luck (wide) | Magic Points (narrow) -->
    <div class="mt-3 grid gap-3 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
      <!-- Luck: 1–99 (no separate max; leave mark unset or 99 if you prefer) -->
      <div class="p-2 rounded-lg border bg-gradient-to-b from-white to-gray-50">
        <NumberTrack
            v-model="store.c.luck"
            label="Luck (01–99)"
            :start="1"
            :end="99"
            :rows="5"
            head-label="Out of Luck"
            :head-span="6"
        />
        <div class="mt-2 text-[11px] text-amber-800" v-if="store.c.luck === 0">
          <span class="px-1.5 py-0.5 rounded bg-amber-100">Out of Luck</span>
        </div>
      </div>

      <!-- Magic Points: fixed 0–24; mark = derived max -->
      <div class="p-2 rounded-lg border bg-gradient-to-b from-white to-gray-50">
        <NumberTrack
          v-model="store.c.mp"
          :mark="mpMax"
          label="Magic Points (Max 24)"
          :start="0"
          :end="24"
          :rows="5"
        />
      </div>
    </div>
  </div>
</template>
