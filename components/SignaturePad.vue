<template>
  <div class="signature-section bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
    <h3 class="text-xl font-semibold text-gray-900 mb-4">Assinatura Digital</h3>
    <p class="text-sm text-gray-600 mb-4">Por favor, assine abaixo para aceitar a proposta de financiamento</p>
    
    <div class="relative">
      <!-- Canvas Container -->
      <div class="border-2 border-dashed border-gray-300 rounded-xl p-1 bg-gray-50">
        <canvas
          ref="canvas"
          class="signature-canvas bg-white rounded-lg"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="handleTouch"
          @touchmove="handleTouch"
          @touchend="stopDrawing"
        ></canvas>
      </div>
      
      <!-- Signature Line -->
      <div class="absolute bottom-8 left-6 right-6 border-b-2 border-gray-300"></div>
      <p class="absolute bottom-2 left-6 text-xs text-gray-400">Assinatura do Cliente</p>
    </div>
    
    <!-- Action Buttons -->
    <div class="mt-4 flex gap-3">
      <button
        @click="clearSignature"
        class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
      >
        Limpar
      </button>
      <button
        @click="saveSignature"
        :disabled="!hasSignature"
        class="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 transform active:scale-95"
        :class="hasSignature 
          ? 'bg-green-500 text-white hover:bg-green-600 shadow-sm' 
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
      >
        Gerar PDF
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSimulationStore } from '~/stores/simulation'

const canvas = ref<HTMLCanvasElement>()
const isDrawing = ref(false)
const hasDrawn = ref(false)
let ctx: CanvasRenderingContext2D | null = null

const simulationStore = useSimulationStore()

const emit = defineEmits<{
  'signature-saved': [signature: string]
}>()

const hasSignature = computed(() => hasDrawn.value)

onMounted(() => {
  if (canvas.value) {
    // Set canvas size
    const rect = canvas.value.parentElement?.getBoundingClientRect()
    if (rect) {
      canvas.value.width = rect.width - 16 // Account for padding
      canvas.value.height = 200
    }
    
    ctx = canvas.value.getContext('2d')
    
    if (ctx) {
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }
})

const startDrawing = (e: MouseEvent) => {
  isDrawing.value = true
  hasDrawn.value = true
  
  if (ctx && canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
}

const draw = (e: MouseEvent) => {
  if (!isDrawing.value || !ctx || !canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  ctx.lineTo(x, y)
  ctx.stroke()
}

const stopDrawing = () => {
  isDrawing.value = false
}

const handleTouch = (e: TouchEvent) => {
  e.preventDefault()
  const touch = e.touches[0]
  const rect = canvas.value?.getBoundingClientRect()
  
  if (!rect || !ctx) return
  
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  
  if (e.type === 'touchstart') {
    isDrawing.value = true
    hasDrawn.value = true
    ctx.beginPath()
    ctx.moveTo(x, y)
  } else if (e.type === 'touchmove' && isDrawing.value) {
    ctx.lineTo(x, y)
    ctx.stroke()
  }
}

const clearSignature = () => {
  if (ctx && canvas.value) {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    hasDrawn.value = false
  }
}

const saveSignature = () => {
  if (canvas.value && hasSignature.value) {
    const signature = canvas.value.toDataURL('image/png')
    simulationStore.setSignature(signature)
    emit('signature-saved', signature)
    
    // Show success feedback
    alert('PDF gerado com sucesso! (Implementação do PDF será feita na próxima etapa)')
  }
}
</script>

<style scoped>
.signature-canvas {
  width: 100%;
  height: 200px;
  cursor: crosshair;
  touch-action: none;
  display: block;
}

@media (max-width: 640px) {
  .signature-canvas {
    height: 150px;
  }
}
</style>