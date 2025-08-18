<!-- components/ValueSplit.vue -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  size?: 'xxs' | 'xs' | 'sm' | 'md'
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
  props.size === 'xxs' ? 'p-1'   :
  props.size === 'xs'  ? 'p-1.5' :
  props.size === 'sm'  ? 'p-2'   : 'p-3'
)
const padSmall = computed(() =>
  props.size === 'xxs' ? 'p-0.5' :
  props.size === 'xs'  ? 'p-1'   :
  props.size === 'sm'  ? 'p-1.5' : 'p-2'
)
const totalText = computed(() =>
  props.size === 'xxs' ? 'text-base'   :
  props.size === 'xs'  ? 'text-lg'   :
  props.size === 'sm'  ? 'text-xl' : 'text-2xl'
)
const smallText = computed(() =>
  props.size === 'xxs' ? 'text-[10px]' :
  props.size === 'xs'  ? 'text-[11px]' :
  props.size === 'sm'  ? 'text-xs'     : 'text-sm'
)
const gapClass = computed(() => (props.size === 'xxs' ? 'gap-0.5' : 'gap-1'))
const roundMain = computed(() => (props.size === 'xxs' ? 'rounded'    : 'rounded-md'))
const roundSmall = computed(() => (props.size === 'xxs' ? 'rounded'   : 'rounded-md'))

function onInput(e: Event) {
  const raw = +(e.target as HTMLInputElement).value
  const clamped = Math.max(props.min, Math.min(props.max, Math.round(isNaN(raw) ? 0 : raw)))
  emit('update:modelValue', clamped)
}
</script>

<template>
  <div :class="['grid grid-cols-3 grid-rows-2 w-full', gapClass]">
    <!-- Total -->
    <div :class="['col-span-2 row-span-2 border flex items-center justify-center', roundMain, padMain]">
        <input
        v-if="!readonly"
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        :min="min" :max="max" :step="step" :value="modelValue"
        @input="onInput"
        class="no-spin w-full bg-transparent outline-none text-center font-semibold tabular-nums"
        :class="totalText"
        />
    <div v-else :class="['font-bold tabular-nums leading-tight text-center', totalText]">
        {{ modelValue }}
    </div>
    </div>
    <!-- Half -->
    <div :class="['col-span-1 row-span-1 border flex items-center justify-center', roundSmall, padSmall]">
      <div :class="['font-medium', smallText]">{{ half }}</div>
    </div>
    <!-- Fifth -->
    <div :class="['col-span-1 row-span-1 border flex items-center justify-center', roundSmall, padSmall]">
      <div :class="['font-medium', smallText]">{{ fifth }}</div>
    </div>
  </div>
</template>

<style scoped>
    /* remove number spinners (WebKit) */
    .no-spin::-webkit-outer-spin-button,
    .no-spin::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }
    /* remove number spinners (Firefox) */
    .no-spin {
    -moz-appearance: textfield;
    appearance: textfield;
    }
</style>
