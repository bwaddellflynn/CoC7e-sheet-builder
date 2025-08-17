<!-- components/ValueSplit.vue -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  size?: 'xs' | 'sm' | 'md'
  min?: number
  max?: number
  step?: number
  readonly?: boolean
}>(), {
  size: 'md',
  min: 0,
  max: 999,
  step: 1,
  readonly: false
})

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()

const half  = computed(() => Math.floor(props.modelValue / 2))
const fifth = computed(() => Math.floor(props.modelValue / 5))

const padMain  = computed(() =>
  props.size === 'xs' ? 'p-1.5' : props.size === 'sm' ? 'p-2' : 'p-3'
)
const padSmall = computed(() =>
  props.size === 'xs' ? 'p-1'   : props.size === 'sm' ? 'p-1.5' : 'p-2'
)
const totalText = computed(() =>
  props.size === 'xs' ? 'text-sm' : props.size === 'sm' ? 'text-base' : 'text-xl'
)
const smallText = computed(() =>
  props.size === 'xs' ? 'text-[11px]' : props.size === 'sm' ? 'text-xs' : 'text-sm'
)

function onInput(e: Event) {
  const raw = +(e.target as HTMLInputElement).value
  const clamped = Math.max(props.min, Math.min(props.max, Math.round(isNaN(raw) ? 0 : raw)))
  emit('update:modelValue', clamped)
}
</script>

<template>
  <div class="grid grid-cols-3 grid-rows-2 gap-1 w-full">
    <div :class="['col-span-2 row-span-2 border rounded-md flex items-center justify-center', padMain]">
      <input
        v-if="!readonly"
        type="number"
        :min="min" :max="max" :step="step" :value="modelValue"
        @input="onInput"
        :class="['w-full bg-transparent outline-none text-center font-semibold', totalText]"
      />
      <div v-else :class="['font-semibold', totalText]">{{ modelValue }}</div>
    </div>
    <div :class="['col-span-1 row-span-1 border rounded-md flex items-center justify-center', padSmall]">
      <div :class="['font-medium', smallText]">{{ half }}</div>
    </div>
    <div :class="['col-span-1 row-span-1 border rounded-md flex items-center justify-center', padSmall]">
      <div :class="['font-medium', smallText]">{{ fifth }}</div>
    </div>
  </div>
</template>
