<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  modelValue: string
  tabs: Array<{ key: string; label: string }>
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const current = ref(props.modelValue)
watchEffect(() => (current.value = props.modelValue))
function setTab(k: string) {
  current.value = k
  emit('update:modelValue', k)
}
</script>

<template>
  <div class="border-b bg-white rounded-t-lg">
    <div class="flex gap-1 p-1">
      <button
        v-for="t in tabs" :key="t.key"
        class="px-3 py-1.5 rounded-md text-sm"
        :class="current === t.key ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'"
        @click="setTab(t.key)"
      >
        {{ t.label }}
      </button>
    </div>
  </div>
  <div class="pt-3">
    <slot :active="current" />
  </div>
</template>
