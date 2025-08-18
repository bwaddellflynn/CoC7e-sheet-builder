<!-- components/JsonImportExport.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useCharacterStore } from '~/stores/character'

const store = useCharacterStore()
const fileEl = ref<HTMLInputElement|null>(null)
const pasteOpen = ref(false)
const pasteText = ref('')

function triggerFile() { fileEl.value?.click() }

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const text = await file.text()
  try {
    const data = JSON.parse(text)
    const res = store.importFromJson(data, { merge: false })
    alert(res.ok ? 'Imported character.' : `Import failed:\n${res.errors?.join('\n')}`)
  } catch (err: any) {
    alert(`Invalid JSON: ${err?.message ?? err}`)
  } finally {
    input.value = ''
  }
}

function onPasteImport() {
  try {
    const data = JSON.parse(pasteText.value)
    const res = store.importFromJson(data, { merge: false })
    alert(res.ok ? 'Imported character.' : `Import failed:\n${res.errors?.join('\n')}`)
    if (res.ok) pasteOpen.value = false
  } catch (err: any) {
    alert(`Invalid JSON: ${err?.message ?? err}`)
  }
}

function exportJson() {
  const blob = new Blob([store.exportAsJson(true)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${store.c.name || 'investigator'}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="no-print flex items-center gap-2">
    <button class="px-3 py-1.5 rounded-md border" @click="exportJson">Export JSON</button>
    <button class="px-3 py-1.5 rounded-md border" @click="triggerFile">Import JSON</button>
    <input ref="fileEl" type="file" accept="application/json,.json" class="hidden" @change="onFile" />
    <button class="px-3 py-1.5 rounded-md border" @click="pasteOpen = !pasteOpen">Paste JSON</button>
  </div>

  <div v-if="pasteOpen" class="mt-2 p-2 border rounded-md bg-white">
    <textarea v-model="pasteText" rows="8" class="w-full border rounded p-2 text-sm font-mono"
              placeholder='{"version":1,"character":{...}} or just the character object'></textarea>
    <div class="mt-2 flex items-center gap-2">
      <button class="px-3 py-1.5 rounded-md border" @click="onPasteImport">Import</button>
      <button class="px-3 py-1.5 rounded-md border" @click="pasteOpen=false">Close</button>
    </div>
  </div>
</template>
