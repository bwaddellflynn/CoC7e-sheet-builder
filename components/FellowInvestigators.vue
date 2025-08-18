<template>
  <div class="p-3 rounded-xl border bg-white avoid-break min-w-0">
    <h2 class="text-lg font-bold tracking-wide text-gray-800 mb-2 uppercase">
      Fellow Investigators
    </h2>

    <!-- 3x3 grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-3">
      <div
        v-for="(slot, i) in slots"
        :key="i"
        class="rounded-lg border p-2 bg-white min-w-0"
      >
        <!-- Char. -->
        <div class="flex print:flex items-center gap-2">
          <label
            :for="`fi-char-${i}`"
            class="w-14 shrink-0 text-[11px] font-semibold text-gray-700"
          >
            Char.
          </label>
          <input
            :id="`fi-char-${i}`"
            v-model="slot.char"
            type="text"
            class="flex-1 border rounded px-2 py-1 text-[12px]"
            placeholder=""
          />
        </div>

        <!-- Player -->
        <div class="flex print:flex items-center gap-2 mt-2">
          <label
            :for="`fi-player-${i}`"
            class="w-14 shrink-0 text-[11px] font-semibold text-gray-700"
          >
            Player
          </label>
          <input
            :id="`fi-player-${i}`"
            v-model="slot.player"
            type="text"
            class="flex-1 border rounded px-2 py-1 text-[12px]"
            placeholder=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = withDefaults(defineProps<{ count?: number }>(), { count: 9 })
const slots = reactive(
  Array.from({ length: props.count }, () => ({ char: '', player: '', notes: '' }))
)
</script>
