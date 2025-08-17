<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCharacterStore } from '~/stores/character'
import ValueSplit from '@/components/ValueSplit.vue'

type SkillEntry = { base: number; points: number }
type SkillRow = { name: string; base: number; points: number; total: number }

const store = useCharacterStore()

const rows = computed<SkillRow[]>(() => {
  const skills = store.c.skills as Record<string, SkillEntry>
  return Object.keys(skills).map((name) => {
    const v = skills[name]
    const base =
      name === 'Dodge' ? Math.floor(store.c.stats.DEX / 2) :
      name === 'Language (Own)' ? store.c.stats.EDU :
      v.base
    const total = base + v.points
    return { name, base, points: v.points, total }
  }).sort((a, b) => a.name.localeCompare(b.name))
})

// chunk into groups of 4 skills → 8 columns per row (Skill | Rating × 4)
const quartets = computed(() => {
  const r = rows.value
  const out: Array<SkillRow[]> = []
  for (let i = 0; i < r.length; i += 4) out.push(r.slice(i, i + 4))
  return out
})

// Specialization UI state
const editingFor = ref<string | null>(null)
const specText = ref('')

function isUmbrellaParent(skillName: string) {
  return (
    skillName === 'Art/Craft' ||
    skillName === 'Science' ||
    skillName === 'Pilot' ||
    skillName === 'Survival' ||
    skillName === 'Language (Other)' ||
    skillName.startsWith('Fighting') ||   // e.g., Fighting (Brawl)
    skillName.startsWith('Firearms')      // e.g., Firearms (Rifle/Shotgun)
  )
}

function startAdd(parent: string) {
  editingFor.value = parent
  specText.value = ''
}
function cancelAdd() {
  editingFor.value = null
  specText.value = ''
}
function confirmAdd() {
  if (!editingFor.value || !specText.value.trim()) return
  store.addSkillSpecialization(editingFor.value, specText.value)
  cancelAdd()
}

// Edit total via ValueSplit → store points = total - base
function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)) }
function setTotal(name: string, total: number) {
  const entry = store.c.skills[name] as SkillEntry | undefined
  if (!entry) return
  const base =
    name === 'Dodge' ? Math.floor(store.c.stats.DEX / 2) :
    name === 'Language (Own)' ? store.c.stats.EDU :
    entry.base
  const points = clamp(Math.round(total - base), 0, 99)
  store.setSkillPoints(name, points)
}
</script>

<template>
  <div class="p-3 rounded-xl border bg-white">
    <h2 class="text-base font-semibold mb-2">Investigator Skills</h2>

    <div class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left p-2">Skill</th>
            <th class="text-right p-2">Rating</th>
            <th class="text-left p-2">Skill</th>
            <th class="text-right p-2">Rating</th>
            <th class="text-left p-2">Skill</th>
            <th class="text-right p-2">Rating</th>
            <th class="text-left p-2">Skill</th>
            <th class="text-right p-2">Rating</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in quartets" :key="row[0]?.name" class="odd:bg-white even:bg-gray-50">
            <!-- 4 skills per table row -->
            <template v-for="i in 4" :key="i">
              <template v-if="row[i-1]">
                <!-- Skill name cell -->
                <td class="p-1 align-top">
                  <div class="flex flex-wrap items-start gap-x-2 gap-y-1">
                    <!-- Name: allow wrapping -->
                    <span class="min-w-0 whitespace-normal break-words leading-snug">
                      {{ row[i-1].name }}
                    </span>
                    <!-- Base hint -->
                    <span class="shrink-0 text-[10px] text-gray-500">
                      Base {{ row[i-1].base }}
                    </span>
                    <!-- + button AFTER Base -->
                    <button
                      v-if="isUmbrellaParent(row[i-1].name)"
                      class="shrink-0 self-start text-[10px] px-1 py-0.5 border rounded"
                      title="Add specialization"
                      @click="startAdd(row[i-1].name)"
                    >+</button>
                  </div>

                  <!-- Inline specialization input -->
                  <div
                    v-if="editingFor === row[i-1].name"
                    class="mt-1 flex items-center gap-1"
                  >
                    <input
                      v-model="specText"
                      type="text"
                      placeholder="e.g., German / Physics / Desert"
                      class="w-36 border rounded px-1 py-0.5 text-[11px]"
                      @keyup.enter="confirmAdd"
                    />
                    <button class="text-[11px] px-1.5 py-0.5 border rounded" @click="confirmAdd">Add</button>
                    <button class="text-[11px] px-1 py-0.5 text-gray-500" @click="cancelAdd">×</button>
                  </div>
                </td>

                <!-- Rating control cell -->
                <td class="p-1 align-top">
                  <div class="min-w-[92px] ml-auto">
                    <ValueSplit
                      :model-value="row[i-1].total"
                      size="xs"
                      :min="0"
                      :max="99"
                      @update:modelValue="val => setTotal(row[i-1].name, val)"
                    />
                  </div>
                </td>
              </template>

              <!-- Pad with empties if quartet is short -->
              <template v-else>
                <td class="p-1" colspan="2"></td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
