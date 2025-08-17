<script setup lang="ts">
import SheetHeader from '@/components/SheetHeader.vue'
import CharacteristicsCard from '@/components/CharacteristicsCard.vue'
import PortraitUpload from '@/components/PortraitUpload.vue'
import DerivedPanel from '@/components/DerivedPanel.vue'
import SkillsTable from '@/components/SkillsTable.vue'
import WeaponsTable from '@/components/WeaponsTable.vue'
</script>

<template>
  <div class="mx-auto max-w-6xl p-6 space-y-6">
    <!-- Row: Player info | Characteristics | Portrait -->
    <section class="grid gap-4 items-start md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_auto]">
      <SheetHeader class="h-full" />
      <CharacteristicsCard class="h-full" />
      <div class="justify-self-end">
        <PortraitUpload class="h-full" />
      </div>
    </section>

    <!-- Rest of the sheet -->
    <DerivedPanel />
    <SkillsTable />
    <WeaponsTable />
  </div>
</template>
