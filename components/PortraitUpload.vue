<script setup lang="ts">
import { ref } from 'vue'
import { useCharacterStore } from '@/stores/character'

const store = useCharacterStore()

const fileEl = ref<HTMLInputElement|null>(null)
const dragging = ref(false)
const errorMsg = ref('')

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function isValidImage(file: File) {
  const okType = file.type.startsWith('image/')
  const okSize = file.size <= 5 * 1024 * 1024 // 5MB cap
  errorMsg.value = okType ? (okSize ? '' : 'Image too large (max 5MB)') : 'Unsupported file type'
  return okType && okSize
}

async function handleFiles(files: FileList | null) {
  const file = files?.[0]
  if (!file || !isValidImage(file)) return
  const dataUrl = await fileToDataUrl(file)
  store.setPortraitDataUrl(dataUrl)
}

function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  handleFiles(input.files)
  if (input) input.value = '' // allow re-uploading same file
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  dragging.value = true
}
function onDragLeave(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
}
function onDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  handleFiles(e.dataTransfer?.files || null)
}

function openPicker() {
  fileEl.value?.click()
}
function onClear() {
  store.clearPortrait()
}
</script>

<template>
  <div class="p-3 rounded-2xl border bg-white">
    <div class="text-sm font-medium mb-2">Portrait</div>

    <!-- Full-bleed portrait area with hover 'clear' control; click anywhere to upload -->
    <div
      class="group relative aspect-[3/4] w-56 md:w-56 print:w-56 overflow-hidden rounded-xl border bg-gray-50 flex items-center justify-center cursor-pointer"
      :class="dragging ? 'ring-2 ring-blue-500 border-blue-300' : ''"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click="openPicker"
      role="button"
      tabindex="0"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
    >
      <img
        v-if="store.c.portraitDataUrl"
        :src="store.c.portraitDataUrl"
        alt="Portrait"
        class="h-full w-full object-cover select-none pointer-events-none"
      />
      <div
        v-else
        class="absolute inset-0 grid place-items-center text-gray-400 text-xs px-2 text-center pointer-events-none"
      >
        Drop image, or click to add
      </div>

      <!-- Hover overlay (dim only); '×' to clear in the top-right -->
      <div
        class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 no-print"
      >
        <div class="absolute inset-0 bg-black/20"></div>

        <!-- Clear (×) — only if a portrait exists -->
        <button
          v-if="store.c.portraitDataUrl"
          type="button"
          class="pointer-events-auto absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-full bg-rose-500 text-white font-bold shadow ring-1 ring-white/60 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
          title="Clear portrait"
          aria-label="Clear portrait"
          @click.stop="onClear"
          @keydown.enter.prevent.stop="onClear"
          @keydown.space.prevent.stop="onClear"
        >
          ×
        </button>
      </div>

      <!-- hidden file input -->
      <input
        ref="fileEl"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onPick"
      />
    </div>

    <p v-if="errorMsg" class="mt-2 text-xs text-red-600">{{ errorMsg }}</p>
  </div>
</template>
