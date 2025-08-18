<script setup lang="ts">
import { ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import BackPage from '@/components/BackPage.vue'

import SheetHeader from '@/components/SheetHeader.vue'
import CharacteristicsCard from '@/components/CharacteristicsCard.vue'
import PortraitUpload from '@/components/PortraitUpload.vue'
import TrackerStrip from '@/components/TrackerStrip.vue'
import SkillsTable from '@/components/SkillsTable.vue'
import WeaponsTable from '@/components/WeaponsTable.vue'
import CombatPanel from '@/components/CombatPanel.vue'

const active = ref<'p1'|'p2'>('p1')
const tabs = [
  { key: 'p1', label: 'Page 1: Character' },
  { key: 'p2', label: 'Page 2: Backstory & Gear' },
]
</script>

<template>
  <div class="mx-auto max-w-6xl p-6 space-y-4">
    <Tabs v-model="active" :tabs="tabs">
      <template #default="{ active }">
        <!-- PAGE 1 -->
        <div v-show="active === 'p1'" class="space-y-6 print:block">
          <section class="grid gap-4 items-start md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_auto]">
            <SheetHeader class="h-full" />
            <CharacteristicsCard class="h-full" />
            <div class="justify-self-end">
              <PortraitUpload class="h-full" />
            </div>
          </section>

          <!-- NEW strip -->
          <TrackerStrip />

          <SkillsTable />

          <!-- 4/5 + 1/5 layout for weapons/combat -->
          <section class="grid gap-4 items-start md:grid-cols-5">
            <WeaponsTable class="md:col-span-4" />
            <CombatPanel class="md:col-span-1" />
          </section>
        </div>

        <!-- PAGE 2 -->
        <div v-show="active === 'p2'" class="space-y-6 print:block">
          <BackPage />
        </div>
      </template>
    </Tabs>
  </div>
</template>

<style>
/* Print both tabs as two pages */
@media print {
  /* Always show both panels during print */
  .print\:block { display: block !important; }
  /* Force page break between Page 1 and Page 2 */
  .print\:block + .print\:block { page-break-before: always; }
  /* Hide the tab bar when printing */
  .border-b.bg-white.rounded-t-lg { display: none !important; }
  /* Optional: narrower margins on print */
  @page { margin: 10mm; }
}
</style>
