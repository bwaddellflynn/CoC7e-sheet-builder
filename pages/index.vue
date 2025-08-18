<!-- pages/index.vue -->
<script setup lang="ts">
import { ref } from 'vue'

import Tabs from '@/components/Tabs.vue'
import PrintControls from '@/components/PrintControls.vue'
import ExportPdfButton from '@/components/ExportPdfButton.vue'
import JsonImportExport from '@/components/JsonImportExport.vue'
import BackPage from '@/components/BackPage.vue'

import SheetHeader from '@/components/SheetHeader.vue'
import CharacteristicsCard from '@/components/CharacteristicsCard.vue'
import PortraitUpload from '@/components/PortraitUpload.vue'
import TrackerStrip from '@/components/TrackerStrip.vue'
import SkillsTable from '@/components/SkillsTable.vue'
import WeaponsTable from '@/components/WeaponsTable.vue'
import CombatPanel from '@/components/CombatPanel.vue'

const active = ref<'p1' | 'p2' | 'p3'>('p1')
const tabs = [
  { key: 'p1', label: 'Page 1: Character' },
  { key: 'p2', label: 'Page 2: Skills' },
  { key: 'p3', label: 'Page 3: Back Page' }
]
</script>

<template>
  <div class="mx-auto max-w-6xl p-6 space-y-4">
    <!-- Top bar -->
    <div class="no-print flex items-center justify-between tabbar">
      <Tabs v-model="active" :tabs="tabs" />
      <div class="flex items-center gap-2">
        <JsonImportExport />
        <ExportPdfButton filename="coc-investigator.pdf" />
        <PrintControls v-model:active="active" />
      </div>
    </div>

    <div id="export-root">
      <!-- PAGE 1: Header → Characteristics → Portrait → Tracker → Weapons/Combat -->
      <div v-show="active === 'p1'" class="space-y-4 print-page">
        <section class="grid gap-4 items-start md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_auto] avoid-break">
          <SheetHeader class="h-full" />
          <CharacteristicsCard class="h-full" />
          <div class="justify-self-end">
            <PortraitUpload class="h-full" />
          </div>
        </section>

        <TrackerStrip class="avoid-break" />

        <!-- Weapons & Combat row (4/5 + 1/5) -->
        <section class="grid gap-4 items-start md:grid-cols-5 avoid-break">
          <WeaponsTable class="md:col-span-4" />
          <CombatPanel class="md:col-span-1" />
        </section>
      </div>

      <!-- PAGE 2: Skills -->
      <div v-show="active === 'p2'" class="space-y-4 print-page">
        <SkillsTable class="avoid-break" />
      </div>

      <!-- PAGE 3: Back Page -->
      <div v-show="active === 'p3'" class="space-y-4 print-page">
        <BackPage />
      </div>
    </div>
  </div>
</template>
