<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '~/stores/character'
import ValueSplit from '@/components/ValueSplit.vue'
import { BASE_SKILLS } from '~/stores/constants/skills'
import type { SkillEntry } from '~/stores/types/coc'

type SkillRow = { name: string; base: number; occ: number; personal: number; total: number }
type Pool = 'occ' | 'personal'

const store = useCharacterStore()
const { occBudget, piBudget, occSpent, piSpent } = storeToRefs(store)

// Which pool are we spending from?
const activePool = ref<Pool>('occ')

const rows = computed<SkillRow[]>(() => {
  const skills = store.c.skills as Record<string, SkillEntry>
  return Object.keys(skills).map((name) => {
    const v = skills[name]
    const base =
      name === 'Dodge' ? Math.floor(store.c.stats.DEX / 2) :
      name === 'Language (Own)' ? store.c.stats.EDU :
      v.base
    const occ = v.occ ?? 0
    const personal = v.personal ?? 0
    const total = base + occ + personal
    return { name, base, occ, personal, total }
  }).sort((a, b) => a.name.localeCompare(b.name))
})

// 4 skills per row → 8 columns
const quartets = computed(() => {
  const r = rows.value
  const out: Array<SkillRow[]> = []
  for (let i = 0; i < r.length; i += 4) out.push(r.slice(i, i + 4))
  return out
})

// specialization UI
const editingFor = ref<string | null>(null)
const specText = ref('')

function isUmbrellaParent(skillName: string) {
  return (
    skillName === 'Art/Craft' ||
    skillName === 'Science' ||
    skillName === 'Pilot' ||
    skillName === 'Survival' ||
    skillName === 'Language (Other)' ||
    skillName.startsWith('Fighting') ||
    skillName.startsWith('Firearms')
  )
}
function startAdd(parent: string) { editingFor.value = parent; specText.value = '' }
function cancelAdd() { editingFor.value = null; specText.value = '' }
function confirmAdd() {
  if (!editingFor.value || !specText.value.trim()) return
  store.addSkillSpecialization(editingFor.value, specText.value)
  cancelAdd()
}

function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)) }

// Change total via ValueSplit → route to selected pool
function setTotal(name: string, total: number) {
  const v = store.c.skills[name] as SkillEntry | undefined
  if (!v) return
  const base =
    name === 'Dodge' ? Math.floor(store.c.stats.DEX / 2) :
    name === 'Language (Own)' ? store.c.stats.EDU :
    v.base

  let occ = v.occ ?? 0
  let personal = v.personal ?? 0

  if (activePool.value === 'occ') {
    // Only allow OSP on occupation skills
    if (!store.isOccSkill(name)) return
    occ = clamp(Math.round(total - base - personal), 0, 99)
    store.setOccPoints(name, occ)
  } else {
    personal = clamp(Math.round(total - base - occ), 0, 99)
    store.setPersonalPoints(name, personal)
  }
}

function isCustomSkill(name: string) {
  return !(name in BASE_SKILLS)
}
function removeSkill(name: string) {
  if (!isCustomSkill(name)) return
  if (confirm(`Remove skill "${name}"?`)) {
    store.removeCustomSkill(name)
  }
}

// occupation-skill indicator
function isOcc(name: string) {
  return store.isOccSkill(name)
}

const occOver = computed(() => occSpent.value > occBudget.value)
const piOver  = computed(() => piSpent.value  > piBudget.value)
</script>

<template>
  <div class="p-2 rounded-lg border bg-white">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-sm font-semibold">Investigator Skills</h2>

      <!-- Budget badges + pool toggle -->
      <div class="flex items-center gap-2">
        <span
          class="px-2 py-0.5 rounded border text-[11px] tabular-nums"
          :class="occOver ? 'border-red-500 text-red-600' : ''"
          title="Occupation Skill Points"
        >
          OSP: <strong>{{ occSpent }}</strong> / {{ occBudget }}
        </span>
        <span
          class="px-2 py-0.5 rounded border text-[11px] tabular-nums"
          :class="piOver ? 'border-red-500 text-red-600' : ''"
          title="Personal Interest Points"
        >
          PI: <strong>{{ piSpent }}</strong> / {{ piBudget }}
        </span>

        <div class="inline-flex overflow-hidden rounded border text-[11px]">
          <button
            class="px-2 py-0.5"
            :class="activePool === 'occ' ? 'bg-gray-900 text-white' : 'bg-white'"
            @click="activePool = 'occ'"
            title="Spend Occupation Skill Points"
          >
            Spend: OCC
          </button>
          <button
            class="px-2 py-0.5 border-l"
            :class="activePool === 'personal' ? 'bg-gray-900 text-white' : 'bg-white'"
            @click="activePool = 'personal'"
            title="Spend Personal Interest Points"
          >
            PI
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 text-sm">
          <tr>
            <th class="text-left p-1.5">Skill</th>
            <th class="text-right p-1.5">Rating</th>
            <th class="text-left p-1.5">Skill</th>
            <th class="text-right p-1.5">Rating</th>
            <th class="text-left p-1.5">Skill</th>
            <th class="text-right p-1.5">Rating</th>
            <th class="text-left p-1.5">Skill</th>
            <th class="text-right p-1.5">Rating</th>
          </tr>
        </thead>

        <tbody class="text-sm">
          <tr v-for="row in quartets" :key="row[0]?.name" class="odd:bg-white even:bg-gray-50">
            <!-- 4 skills per table row -->
            <template v-for="i in 4" :key="i">
              <template v-if="row[i-1]">
                <!-- Skill cell -->
                <td class="p-1 align-top">
                  <div class="relative">
                    <!-- main; reserve space for bottom-left buttons -->
                    <div
                      class="pr-1 pb-7 min-h-[56px]"
                      :class="isOcc(row[i-1].name) ? 'pl-2 border-l-2 border-emerald-300' : ''"
                    >
                      <div class="font-medium leading-snug break-words">
                        {{ row[i-1].name }}
                        <!-- OCC badge -->
                        <span
                          v-if="isOcc(row[i-1].name)"
                          class="ml-1 align-middle inline-flex items-center rounded px-1 py-[1px]
                                 text-[10px] border border-emerald-300 bg-emerald-50 text-emerald-700"
                          title="Occupation skill"
                        >
                          OCC
                        </span>
                      </div>

                      <!-- Base line under title -->
                      <div class="mt-0.5 text-[10px] text-gray-500">
                        Base {{ row[i-1].base }}
                      </div>

                      <!-- Inline specialization input -->
                      <div v-if="editingFor === row[i-1].name" class="mt-1 flex items-center gap-1">
                        <input
                          v-model="specText"
                          type="text"
                          placeholder="e.g., German / Knife / Desert"
                          class="w-36 border rounded px-1 py-0.5 text-[11px]"
                          @keyup.enter="confirmAdd"
                        />
                        <button class="text-[11px] px-1.5 py-0.5 border rounded" @click="confirmAdd">Add</button>
                        <button
                          class="w-5 h-5 grid place-items-center border rounded-none text-[11px] leading-none text-gray-600"
                          @click="cancelAdd"
                        >×</button>
                      </div>
                    </div>

                    <!-- Bottom-left square controls -->
                    <div class="absolute bottom-1 left-1 flex items-center gap-1">
                      <button
                        v-if="isCustomSkill(row[i-1].name)"
                        class="w-5 h-5 grid place-items-center border rounded-none text-[11px] leading-none
                               text-red-600 hover:bg-red-50"
                        title="Remove this custom skill"
                        @click="removeSkill(row[i-1].name)"
                        aria-label="Remove custom skill"
                      >
                        ×
                      </button>

                      <button
                        v-if="isUmbrellaParent(row[i-1].name)"
                        class="w-5 h-5 grid place-items-center border rounded-none text-[11px] leading-none
                               hover:bg-gray-50"
                        title="Add specialization"
                        @click="startAdd(row[i-1].name)"
                        aria-label="Add specialization"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </td>

                <!-- Rating cell -->
                <td class="p-1 align-top">
                  <div class="min-w-[72px] w-[72px] ml-auto">
                    <ValueSplit
                      :model-value="row[i-1].total"
                      size="xs"
                      :min="0"
                      :max="99"
                      :readonly="activePool === 'occ' && !isOcc(row[i-1].name)"
                      @update:modelValue="val => setTotal(row[i-1].name, val)"
                    />
                  </div>
                </td>
              </template>

              <!-- pad empties -->
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
