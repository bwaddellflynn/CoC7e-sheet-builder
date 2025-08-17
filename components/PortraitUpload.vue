<script setup lang="ts">
import { ref } from 'vue'
import { useCharacterStore } from '@/stores/character'
const store = useCharacterStore()

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

function onClear() {
  store.clearPortrait()
}
</script>

<template>
  <div class="p-3 rounded-2xl border bg-white">
    <div class="text-sm font-medium mb-2">Portrait</div>

    <!-- Drop zone -->
    <div
      class="aspect-[3/4] w-44 overflow-hidden rounded-xl border bg-gray-50 relative flex items-center justify-center"
      :class="dragging ? 'ring-2 ring-blue-500 border-blue-300' : ''"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <img
        v-if="store.c.portraitDataUrl"
        :src="store.c.portraitDataUrl"
        alt="Portrait"
        class="h-full w-full object-cover select-none pointer-events-none"
      />
      <span v-else class="text-gray-400 text-xs px-2 text-center">
        Drop image here or click Upload
      </span>
    </div>

    <div class="mt-3 flex items-center gap-2">
      <label class="px-3 py-1.5 rounded-xl border cursor-pointer">
        Upload
        <input type="file" accept="image/*" class="hidden" @change="onPick" />
      </label>
      <button
        class="px-3 py-1.5 rounded-xl border"
        @click="onClear"
        :disabled="!store.c.portraitDataUrl"
      >
        Clear
      </button>
      <span v-if="errorMsg" class="text-xs text-red-600 ml-2">{{ errorMsg }}</span>
    </div>
  </div>
</template>
