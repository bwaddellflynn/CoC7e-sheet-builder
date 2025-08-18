<template class="--p1-print-scale">
  <div class="p-3 rounded-xl border bg-white avoid-break">
    <h2 class="text-lg font-bold tracking-wide text-gray-800 mb-2 uppercase">
      Quick Reference Rules
    </h2>

    <div class="space-y-3 text-[12px] leading-snug text-gray-800">
      <div>
        <div class="font-semibold">Skill & Characteristic Rolls</div>
        <div class="grid grid-cols-2 print:grid-cols-2 gap-x-4 gap-y-1 mt-1">
          <div>Fumble — <span class="font-mono">100</span>/<span class="font-mono">96+</span></div>
          <div>Fail — <span class="font-mono">&gt; skill</span></div>
          <div>Regular — <span class="font-mono">≤ skill</span></div>
          <div>Hard — <span class="font-mono">½ skill</span></div>
          <div>Extreme — <span class="font-mono">⅕ skill</span></div>
          <div>Critical — <span class="font-mono">01</span></div>
        </div>
        <div class="mt-2 italic text-[11px]">
          Pushing Rolls: Must justify reroll; cannot Push Combat or Sanity rolls.
        </div>
      </div>

      <hr class="border-gray-300" />

      <div class="space-y-1">
        <div class="font-semibold">Wounds & Healing</div>
        <ul class="list-disc pl-5">
          <li>First Aid heals 1 HP; Medicine heals 1d3 HP.</li>
          <li><span class="font-semibold">Major Wound:</span> loss of ≥½ max HP in one attack.</li>
          <li>Reach 0 HP without Major Wound = <span class="italic">Unconscious</span>.</li>
          <li>Reach 0 HP with Major Wound = <span class="italic">Dying</span>.</li>
          <li><span class="italic">Dying:</span> First Aid = temp. stabilized; then require Medicine.</li>
          <li><span class="font-semibold">Natural heal rate:</span> 1 HP/day (no Major Wound).</li>
          <li>With Major Wound: weekly healing roll.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// purely presentational
</script>
