<script setup lang="ts">
import { ref } from 'vue'

// If you created the shim file types/html2pdf.d.ts with Html2PdfOptions:
type Html2PdfOptions =
  // Use the shim if present
  (typeof import('html2pdf.js') extends { Html2PdfOptions: infer T } ? T : any)
// If you installed @types/html2pdf.js instead, uncomment next line and use Partial<Options>
// import type { Options as Html2PdfOptions } from 'html2pdf.js'

const props = withDefaults(defineProps<{
  target?: string   // CSS selector of the wrapper to export
  filename?: string
}>(), {
  target: '#export-root',
  filename: 'investigator.pdf'
})

const exporting = ref(false)

async function exportPdf() {
  exporting.value = true

  // dynamic import (client-only path)
  // If you didn’t add a shim, you can cast to any:
  const html2pdf = (await import('html2pdf.js')).default as any

  const el = document.querySelector(props.target) as HTMLElement | null
  if (!el) { exporting.value = false; return }

  // Force both pages visible while exporting
  el.classList.add('exporting')

  // IMPORTANT: no `as const` here; margin is a mutable number[]
    const opt = {
        margin: [10, 10, 10, 10] as number[],   // avoid readonly tuple error
        filename: props.filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 3,               // sharper text; 2→3 makes a big difference
            useCORS: true,
            backgroundColor: null
            // windowWidth: document.documentElement.clientWidth, // optional
        },
        jsPDF: {
            unit: 'mm',
            format: 'letter',       // or 'a4' if you prefer
            orientation: 'portrait',
            putOnlyUsedFonts: true
        },
        pagebreak: {
            mode: ['css', 'legacy'] as any, // keep css-based breaks
            before: '.print-page + .print-page',
            avoid: '.avoid-break'
        }
    }


  try {
    await html2pdf().set(opt).from(el).save()
  } finally {
    el.classList.remove('exporting')
    exporting.value = false
  }
}
</script>

<template>
  <button
    class="no-print px-3 py-1.5 rounded-md border"
    :disabled="exporting"
    @click="exportPdf"
    title="Export all pages to PDF"
  >
    {{ exporting ? 'Exporting…' : 'Export PDF' }}
  </button>
</template>

<style scoped>
/* nothing */
</style>
