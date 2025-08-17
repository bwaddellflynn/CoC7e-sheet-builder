<script setup lang="ts">
import { useCharacterStore } from '~/stores/character'
import type { Weapon } from '~/stores/types/coc.ts'
const store = useCharacterStore()

function addBlank() {
  store.addWeapon({ name: '', skill: '', damage: '' })
}
function removeRow(id:string){ store.removeWeapon(id) }
</script>

<template>
  <div class="p-4 rounded-2xl border bg-white">
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-semibold">Weapons & Combat</h2>
      <button class="px-3 py-1.5 rounded-xl border" @click="addBlank">Add Weapon</button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-2 text-left">Name</th>
            <th class="p-2 text-left">Skill</th>
            <th class="p-2 text-left">Damage</th>
            <th class="p-2 text-left">Range</th>
            <th class="p-2 text-right">Attk</th>
            <th class="p-2 text-left">Ammo</th>
            <th class="p-2 text-left">Malf</th>
            <th class="p-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="w in store.c.weapons" :key="w.id" class="odd:bg-white even:bg-gray-50">
            <td class="p-2"><input v-model="w.name" class="w-full border rounded px-2 py-1" /></td>
            <td class="p-2"><input v-model="w.skill" class="w-full border rounded px-2 py-1" placeholder="e.g., Firearms (Handgun)"/></td>
            <td class="p-2"><input v-model="w.damage" class="w-full border rounded px-2 py-1" placeholder="e.g., 1D8+DB"/></td>
            <td class="p-2"><input v-model="w.range" class="w-full border rounded px-2 py-1" /></td>
            <td class="p-2 text-right"><input type="number" v-model.number="w.attacks" class="w-16 border rounded px-2 py-1 text-right" /></td>
            <td class="p-2"><input v-model="w.ammo" class="w-full border rounded px-2 py-1" /></td>
            <td class="p-2"><input v-model="w.malfunction" class="w-full border rounded px-2 py-1" /></td>
            <td class="p-2 text-right">
              <button class="px-2 py-1 rounded border" @click="removeRow(w.id)">✕</button>
            </td>
          </tr>
          <tr v-if="!store.c.weapons.length">
            <td colspan="8" class="p-4 text-center text-gray-500">No weapons yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
