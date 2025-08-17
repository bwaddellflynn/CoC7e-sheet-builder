<script setup lang="ts">
import { useCharacterStore } from '~/stores/character'
const store = useCharacterStore()
</script>

<template>
  <div class="p-4 rounded-2xl border bg-white grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
    <div><label class="text-xs text-gray-500">Investigator</label>
      <input v-model="store.c.name" class="w-full border rounded px-2 py-1" />
    </div>
    <div><label class="text-xs text-gray-500">Player</label>
      <input v-model="store.c.player" class="w-full border rounded px-2 py-1" />
    </div>
    <div><label class="text-xs text-gray-500">Occupation</label>
      <input v-model="store.c.occupation" class="w-full border rounded px-2 py-1" />
    </div>
    <div><label class="text-xs text-gray-500">Age</label>
      <input type="number" v-model.number="store.c.age" class="w-full border rounded px-2 py-1" />
    </div>
    <div><label class="text-xs text-gray-500">Residence</label>
      <input v-model="store.c.residence" class="w-full border rounded px-2 py-1" />
    </div>
    <div class="sm:col-span-2 lg:col-span-3">
      <label class="text-xs text-gray-500">Background</label>
      <textarea v-model="store.c.background" rows="2" class="w-full border rounded px-2 py-1"></textarea>
    </div>
  </div>
</template>
