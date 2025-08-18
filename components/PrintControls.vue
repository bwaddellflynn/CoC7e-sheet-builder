<script setup lang="ts">
import { nextTick } from 'vue'

const props = withDefaults(defineProps<{
  active?: 'p1' | 'p2'
}>(), { active: 'p1' })

const emit = defineEmits<{ (e: 'update:active', v: 'p1' | 'p2'): void }>()

async function printAll() {
  // Ensure Page 1 is selected for consistency (tabs are hidden in print anyway)
  emit('update:active', 'p1')
  await nextTick()
  window.print()
}

function printCurrent() {
  // If you ever switch to per-page printing, call window.print() directly
  window.print()
}
</script>

<template>
  <div class="no-print flex items-center gap-2">
    <button class="px-3 py-1.5 rounded-md border" @click="printAll" title="Print both pages">
      Print
    </button>
  </div>
</template>
