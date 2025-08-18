<script setup lang="ts">
import { computed } from 'vue'
import { useCharacterStore } from '~/stores/character'
import type { Weapon } from '~/stores/types/coc'

const store = useCharacterStore()

function addBlank() {
  store.addWeapon({ name: '', skill: '', damage: '' })
}
function removeRow(id: string) { store.removeWeapon(id) }

/* Build grouped options from the current skill list */
const skillKeys = computed(() => Object.keys(store.c.skills).sort((a, b) => a.localeCompare(b)))

const fightingOpts = computed(() =>
  skillKeys.value.filter(k => k.startsWith('Fighting'))
)

const firearmsOpts = computed(() =>
  skillKeys.value.filter(k => k.startsWith('Firearms'))
)

const otherOpts = computed(() => {
  const others: string[] = []
  if (store.c.skills['Throw']) others.push('Throw')
  return others
})

const allOptions = computed(() => [
  ...fightingOpts.value,
  ...firearmsOpts.value,
  ...otherOpts.value,
])

function hasOptionName(name: string | undefined) {
  if (!name) return false
  return allOptions.value.includes(name)
}
</script>

<template>
  <div class="p-4 rounded-2xl border bg-white">
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-semibold">Weapons</h2>
      <button class="px-3 py-1.5 rounded-xl border" @click="addBlank">Add Weapon</button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm table-fixed">
        <!-- Make Name+Skill wide; keep others narrow -->
        <colgroup>
            <col class="w-[28%]" />  <!-- Name (down from 38%) -->
            <col class="w-[26%]" />  <!-- Skill (down from 28%) -->
            <col class="w-[14%]" />  <!-- Damage (up a touch) -->
            <col class="w-[8%]"  />  <!-- Range -->
            <col class="w-[8%]"  />  <!-- Attk -->
            <col class="w-[8%]"  />  <!-- Ammo -->
            <col class="w-[8%]"  />  <!-- Malf -->
            <col class="w-[40px]" /> <!-- Actions -->
        </colgroup>

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
            <!-- Name: full width -->
            <td class="p-2">
              <input v-model="w.name" class="w-full border rounded px-2 py-1" />
            </td>

            <!-- Skill: dropdown, full width -->
            <td class="p-2">
              <select v-model="w.skill" class="w-full border rounded px-2 py-1 bg-white">
                <option disabled value="">Select skill…</option>
                <option v-if="w.skill && !hasOptionName(w.skill)" :value="w.skill">
                  {{ w.skill }} (custom)
                </option>
                <optgroup v-if="fightingOpts.length" label="Fighting">
                  <option v-for="s in fightingOpts" :key="`fight-${s}`" :value="s">{{ s }}</option>
                </optgroup>
                <optgroup v-if="firearmsOpts.length" label="Firearms">
                  <option v-for="s in firearmsOpts" :key="`fire-${s}`" :value="s">{{ s }}</option>
                </optgroup>
                <optgroup v-if="otherOpts.length" label="Other">
                  <option v-for="s in otherOpts" :key="`other-${s}`" :value="s">{{ s }}</option>
                </optgroup>
              </select>
            </td>

            <!-- Damage: medium -->
            <td class="p-2">
              <input v-model="w.damage" class="w-full border rounded px-2 py-1" />
            </td>

            <!-- Range / Attk / Ammo / Malf: narrow -->
            <td class="p-2">
              <input v-model="w.range" class="w-full border rounded px-1 py-1 text-xs whitespace-nowrap" />
            </td>
            <td class="p-2 text-right">
              <input type="number" v-model.number="w.attacks" class="w-12 border rounded px-1 py-1 text-right text-xs" />
            </td>
            <td class="p-2">
              <input v-model="w.ammo" class="w-full border rounded px-1 py-1 text-xs whitespace-nowrap" />
            </td>
            <td class="p-2">
              <input v-model="w.malfunction" class="w-full border rounded px-1 py-1 text-xs whitespace-nowrap"/>
            </td>

            <!-- Actions -->
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
