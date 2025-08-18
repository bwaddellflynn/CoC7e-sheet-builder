<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number               // current value (click to set)
  mark?: number | null             // ring marker (e.g., max)
  start?: number
  end?: number
  rows?: number                    // fixed rows (default 5)
  label?: string | null            // caption above grid
  pad?: number                     // 2 => 01
  /* NEW: optional labeled spans */
  headLabel?: string | null        // label BEFORE the number track
  headSpan?: number                // width in “number boxes”
  tailLabel?: string | null        // label AFTER the number track
  tailSpan?: number
}>(), {
  mark: null,
  start: 0,
  end: 99,
  rows: 5,
  label: null,
  pad: 2,
  headLabel: null,
  headSpan: 0,
  tailLabel: null,
  tailSpan: 0,
})

const emit = defineEmits<{ (e:'update:modelValue', v:number): void }>()
const count = computed(() => props.end - props.start + 1)

/* account for head/tail spans when sizing columns */
const cols  = computed(() =>
  Math.ceil((count.value + (props.headSpan||0) + (props.tailSpan||0)) / props.rows)
)

const items = computed(() =>
  Array.from({ length: count.value }, (_, i) => props.start + i)
)

const fmt = (n:number) => String(n).padStart(props.pad, '0')
const set = (n:number) => emit('update:modelValue', n)
</script>

<template>
  <div class="w-full">
    <div v-if="label" class="mb-1 flex items-center justify-between">
      <div class="text-[11px] uppercase tracking-wide text-gray-600">{{ label }}</div>
      <div class="text-[11px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700 tabular-nums">
        {{ fmt(modelValue) }}
      </div>
    </div>

    <div class="grid gap-1" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }">
      <!-- HEAD SPAN -->
      <div
        v-if="headLabel && headSpan"
        class="cell h-6 leading-6 text-[11px] border border-gray-300 bg-gray-50
               flex items-center justify-center font-medium rounded"
        :style="{ gridColumn: `span ${headSpan}` }"
      >
        {{ headLabel }}
      </div>

      <!-- NUMBER CELLS -->
      <button
        v-for="n in items"
        :key="n"
        type="button"
        class="cell relative h-6 leading-6 text-[11px] border border-gray-300 bg-white
               flex items-center justify-center tabular-nums select-none cursor-pointer
               hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
        :class="{
          'is-mark': n === mark,
          'is-current': n === modelValue
        }"
        @click="set(n)"
        :aria-pressed="n === modelValue"
      >
        {{ fmt(n) }}
      </button>

      <!-- TAIL SPAN -->
      <div
        v-if="tailLabel && tailSpan"
        class="cell h-6 leading-6 text-[11px] border border-gray-300 bg-gray-50
               flex items-center justify-center font-medium rounded"
        :style="{ gridColumn: `span ${tailSpan}` }"
      >
        {{ tailLabel }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.cell { padding: 0 2px; }

/* ring for “mark” (max) */
.is-mark::after{
  content:'';
  position:absolute; left:50%; top:50%;
  width:1.05rem; height:1.05rem;
  transform:translate(-50%,-50%);
  border:2px solid black; border-radius:9999px;
}

/* filled dot for current */
.is-current::before{
  content:''; position:absolute; left:50%; top:50%;
  width:0.35rem; height:0.35rem; transform:translate(-50%,-50%);
  background:black; border-radius:9999px;
}

@media print { .cell { border-color:black !important; } }
</style>
