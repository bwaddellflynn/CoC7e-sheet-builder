<script setup lang="ts">
const app = useAppStore()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="p-6 rounded-2xl border bg-white space-y-3">
      <h1 class="text-2xl font-bold">CoC 7e Character Builder</h1>
      <button class="px-3 py-1.5 rounded-xl border" @click="app.count++">
        Count: {{ app.count }}
      </button>
    </div>
  </div>
</template>
