<!-- components/JsonImportExport.vue -->
<script setup lang="ts">
import { ref, nextTick, watch, onBeforeUnmount } from 'vue'
import { useCharacterStore } from '~/stores/character'

const store = useCharacterStore()

const fileEl = ref<HTMLInputElement|null>(null)
const pasteOpen = ref(false)
const pasteText = ref('')
const pasteError = ref<string | null>(null)
const textEl = ref<HTMLTextAreaElement | null>(null)

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

function openPasteModal() {
  pasteError.value = null
  pasteOpen.value = true
}
function closePasteModal() {
  pasteOpen.value = false
}

function onPasteImport() {
  pasteError.value = null
  try {
    const data = JSON.parse(pasteText.value)
    const res = store.importFromJson(data, { merge: false })
    if (res.ok) {
      pasteOpen.value = false
      pasteText.value = ''
      alert('Imported character.')
    } else {
      pasteError.value = res.errors?.join('\n') || 'Import failed.'
    }
  } catch (err: any) {
    pasteError.value = `Invalid JSON: ${err?.message ?? err}`
  }
}

function formatJson() {
  pasteError.value = null
  try {
    const obj = JSON.parse(pasteText.value)
    pasteText.value = JSON.stringify(obj, null, 2)
  } catch (err: any) {
    pasteError.value = `Cannot format: ${err?.message ?? err}`
  }
}

function onModalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    closePasteModal()
    return
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') {
    e.preventDefault()
    onPasteImport()
  }
}

watch(pasteOpen, async (open) => {
  if (open) {
    await nextTick()
    textEl.value?.focus()
    window.addEventListener('keydown', onModalKeydown)
  } else {
    window.removeEventListener('keydown', onModalKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onModalKeydown)
})
</script>

<template>
  <div class="no-print flex items-center gap-2">
    <button class="px-3 py-1.5 rounded-md border" @click="exportJson">Export JSON</button>
    <button class="px-3 py-1.5 rounded-md border" @click="triggerFile">Import JSON</button>
    <input ref="fileEl" type="file" accept="application/json,.json" class="hidden" @change="onFile" />
    <button class="px-3 py-1.5 rounded-md border" @click="openPasteModal">Paste JSON</button>
  </div>

  <!-- Modal (teleported to body so it overlays correctly) -->
  <teleport to="body">
    <div v-if="pasteOpen" class="no-print fixed inset-0 z-50">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40" @click="closePasteModal"></div>

      <!-- Dialog -->
      <div class="relative h-full w-full flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="paste-json-title"
          class="w-full max-w-3xl rounded-xl border bg-white shadow-xl"
        >
          <div class="flex items-center justify-between px-4 py-3 border-b">
            <h2 id="paste-json-title" class="text-base font-semibold">Paste JSON</h2>
            <button
              class="size-8 grid place-items-center rounded border hover:bg-gray-50"
              @click="closePasteModal"
              aria-label="Close"
              title="Close (Esc)"
            >✕</button>
          </div>

          <div class="px-4 pt-3 pb-2">
            <p class="text-sm text-gray-600 mb-2">
              Paste your character JSON below. Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>Enter</kbd> to import.
            </p>

            <textarea
              ref="textEl"
              v-model="pasteText"
              rows="16"
              class="w-full border rounded p-2 text-sm font-mono leading-snug"
              placeholder='{"version":1,"character":{...}} or just the character object'
            ></textarea>

            <p v-if="pasteError" class="mt-2 text-sm text-red-600 whitespace-pre-wrap">
              {{ pasteError }}
            </p>
          </div>

          <div class="px-4 py-3 border-t flex items-center justify-between">
            <div class="text-xs text-gray-500">
              <span class="hidden sm:inline">Shortcuts:</span>
              <kbd>Esc</kbd> close · <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>Enter</kbd> import
            </div>
            <div class="flex items-center gap-2">
              <button class="px-3 py-1.5 rounded-md border" @click="formatJson">Format JSON</button>
              <button class="px-3 py-1.5 rounded-md border" @click="closePasteModal">Close</button>
              <button class="px-3 py-1.5 rounded-md border bg-gray-900 text-white" @click="onPasteImport">
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
/* keep your existing export function grouped for clarity */
export default {
  methods: {
    exportJson() {
      const store = useCharacterStore()
      const blob = new Blob([store.exportAsJson(true)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${store.c.name || 'investigator'}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
  },
}
</script>
