<script setup lang="ts">
import { computed } from 'vue'
import { useCharacterStore } from '~/stores/character'
import ValueSplit from '@/components/ValueSplit.vue'

const store = useCharacterStore()

// --- DB / Build from derived (avoid re-implementing tables)
const dbStr   = computed(() => store.derivedMax.db)      // e.g., '0', '+1d4', '-1'
const buildNo = computed(() => store.derivedMax.build)   // number

// Unarmed/Brawl damage: 1d3 plus DB string (pretty print)
const brawlDamage = computed(() => {
  const db = dbStr.value
  if (!db || db === '0') return '1d3'
  return db.startsWith('-') ? `1d3 ${db}` : `1d3${db}`
})

// --- Dodge editing: base = DEX/2; total = base + occ + personal
const dodgeBase  = computed(() => Math.floor(store.c.stats.DEX / 2))
const dodgeTotal = computed(() => {
  const v = store.c.skills['Dodge']
  if (!v) return dodgeBase.value
  return dodgeBase.value + (v.occ ?? 0) + (v.personal ?? 0)
})
function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)) }
function setDodgeTotal(total: number) {
  const v = store.c.skills['Dodge']
  if (!v) return
  const occ = v.occ ?? 0
  const personal = clamp(Math.round(total - dodgeBase.value - occ), 0, 99)
  // Prefer explicit setter; fall back to old one if present
  ;(store as any).setPersonalPoints?.('Dodge', personal) ?? store.setSkillPoints('Dodge', personal)
}
</script>

<template>
  <div class="p-1.5 rounded-md border bg-white">
    <h2 class="text-xs font-semibold mb-1.5">Combat</h2>

    <!-- DB / Build tiles -->
    <div class="grid grid-cols-2 gap-1">
      <div class="p-1 rounded border">
        <div class="text-[10px] uppercase tracking-wide text-gray-500">Damage Bonus</div>
        <div class="mt-0.5 text-base font-bold tabular-nums text-center">{{ dbStr }}</div>
      </div>
      <div class="p-1 rounded border">
        <div class="text-[10px] uppercase tracking-wide text-gray-500">Build</div>
        <div class="mt-0.5 text-base font-bold tabular-nums text-center">{{ buildNo }}</div>
      </div>
    </div>

    <!-- Dodge using ValueSplit -->
    <div class="mt-1.5 p-1 rounded border">
      <div class="grid grid-cols-[auto,1fr] items-center gap-2">
        <div class="text-xs font-semibold">Dodge</div>
        <div class="min-w-[72px] w-[72px] mx-auto">
          <ValueSplit
            :model-value="dodgeTotal"
            size="xs"
            :min="0"
            :max="99"
            @update:modelValue="setDodgeTotal"
          />
        </div>
      </div>
      <div class="mt-0.5 text-[10px] text-gray-600">
        Base = DEX ÷ 2 ({{ dodgeBase }})
      </div>
    </div>

    <!-- Unarmed (Brawl) -->
    <div class="mt-1.5 p-1 rounded border">
      <div class="flex items-baseline justify-between gap-2">
        <div class="text-xs font-semibold">Unarmed (Brawl)</div>
        <div class="text-sm font-bold tabular-nums">{{ brawlDamage }}</div>
      </div>
      <div class="mt-0.5 text-[10px] text-gray-600 leading-tight">
        Melee: defender <span class="font-medium">Dodge</span> or <span class="font-medium">Fight Back</span>;
        higher success level wins (ties → lower roll).
      </div>
    </div>
  </div>
</template>
