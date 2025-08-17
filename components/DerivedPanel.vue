<script setup lang="ts">
import { useCharacterStore } from '~/stores/character'
const store = useCharacterStore()
const d = store.derivedMax
</script>

<template>
  <div class="p-4 rounded-2xl border bg-white grid md:grid-cols-2 gap-4">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="p-3 rounded-xl border">
        <div class="text-xs uppercase text-gray-500">HP</div>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" v-model.number="store.c.hp" :max="store.derivedMax.hpMax" class="w-20 border rounded px-2 py-1 text-right"/>
          <span class="text-gray-500">/ {{ store.derivedMax.hpMax }}</span>
        </div>
      </div>
      <div class="p-3 rounded-xl border">
        <div class="text-xs uppercase text-gray-500">SAN</div>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" v-model.number="store.c.san" :max="store.derivedMax.sanMax" class="w-20 border rounded px-2 py-1 text-right"/>
          <span class="text-gray-500">/ {{ store.derivedMax.sanMax }}</span>
        </div>
      </div>
      <div class="p-3 rounded-xl border">
        <div class="text-xs uppercase text-gray-500">Luck</div>
        <input type="number" v-model.number="store.c.luck" class="mt-1 w-24 border rounded px-2 py-1 text-right"/>
      </div>
      <div class="p-3 rounded-xl border">
        <div class="text-xs uppercase text-gray-500">Magic Pts</div>
        <div class="flex items-center gap-2 mt-1">
          <input type="number" v-model.number="store.c.mp" :max="store.derivedMax.mpMax" class="w-20 border rounded px-2 py-1 text-right"/>
          <span class="text-gray-500">/ {{ store.derivedMax.mpMax }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div class="p-3 rounded-xl border">
        <div class="text-xs uppercase text-gray-500">DB</div>
        <div class="text-xl font-semibold">{{ store.derivedMax.db }}</div>
      </div>
      <div class="p-3 rounded-xl border">
        <div class="text-xs uppercase text-gray-500">Build</div>
        <div class="text-xl font-semibold">{{ store.derivedMax.build }}</div>
      </div>
      <div class="p-3 rounded-xl border">
        <div class="text-xs uppercase text-gray-500">Move</div>
        <div class="text-xl font-semibold">{{ store.derivedMax.move }}</div>
      </div>
    </div>
  </div>
</template>
