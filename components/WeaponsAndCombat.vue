<!-- components/WeaponsAndCombat.vue -->
<template>
  <div class="grid md:grid-cols-2 gap-3">
    <WeaponsTable />
    <CombatPanel />
  </div>
</template>

<script setup lang="ts">
import WeaponsTable from '@/components/WeaponsTable.vue'
import CombatPanel from '@/components/CombatPanel.vue'
</script>
