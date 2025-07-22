<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('close')"
        ></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="isOpen" class="relative w-full max-w-2xl">
              <!-- Modal Content -->
              <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xl font-semibold text-white">Assinatura Digital</h3>
                    <button
                      @click="$emit('close')"
                      class="text-white/80 hover:text-white transition-colors"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Body -->
                <div class="p-6">
                  <p class="text-gray-600 mb-6">
                    Por favor, assine abaixo para confirmar que você aceita os termos da proposta de financiamento.
                  </p>
                  
                  <!-- Signature Pad -->
                  <div class="relative">
                    <div class="border-2 border-dashed border-gray-300 rounded-xl p-2 bg-gray-50">
                      <canvas
                        ref="canvas"
                        class="signature-canvas bg-white rounded-lg w-full"
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
                    <div class="absolute bottom-8 left-8 right-8 border-b-2 border-gray-300"></div>
                    <p class="absolute bottom-2 left-8 text-xs text-gray-400">Assinatura do Cliente</p>
                  </div>
                  
                  <!-- Agreement Text -->
                  <div class="mt-6 p-4 bg-blue-50 rounded-xl">
                    <p class="text-sm text-blue-900">
                      <strong>Ao assinar, você concorda com:</strong>
                    </p>
                    <ul class="mt-2 space-y-1 text-sm text-blue-800">
                      <li>• Valor financiado: {{ formatCurrency(simulationData.financedAmount) }}</li>
                      <li>• Taxa de juros: {{ (simulationData.interestRate * 100).toFixed(3).replace('.', ',') }}% ao mês</li>
                      <li>• Prazo: {{ simulationData.term }} meses</li>
                      <li>• Primeira parcela: {{ formatCurrency(simulationData.firstPayment) }}</li>
                    </ul>
                  </div>
                </div>
                
                <!-- Footer -->
                <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div class="flex justify-between gap-3">
                    <button
                      @click="clearSignature"
                      class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium"
                    >
                      Limpar
                    </button>
                    <div class="flex gap-3">
                      <button
                        @click="$emit('close')"
                        class="px-4 py-2.5 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        @click="saveSignature"
                        :disabled="!hasSignature"
                        class="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 transform active:scale-95"
                        :class="hasSignature 
                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-sm' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                      >
                        Confirmar e Gerar PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useSimulationStore } from '~/stores/simulation'
import { formatCurrency } from '~/utils/formatters'

const props = defineProps<{
  isOpen: boolean
  simulationData: {
    financedAmount: number
    interestRate: number
    term: number
    firstPayment: number
  }
}>()

const emit = defineEmits<{
  close: []
  'signature-saved': [signature: string]
}>()

const canvas = ref<HTMLCanvasElement>()
const isDrawing = ref(false)
const hasDrawn = ref(false)
let ctx: CanvasRenderingContext2D | null = null

const simulationStore = useSimulationStore()

const hasSignature = computed(() => hasDrawn.value)

// Initialize canvas when modal opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    initializeCanvas()
  } else {
    // Clear canvas when modal closes
    hasDrawn.value = false
  }
})

const initializeCanvas = () => {
  if (canvas.value) {
    // Set canvas size
    const rect = canvas.value.parentElement?.getBoundingClientRect()
    if (rect) {
      canvas.value.width = rect.width - 16
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
}

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
    emit('close')
    
    // Show success feedback
    setTimeout(() => {
      alert('PDF gerado com sucesso! (Implementação do PDF será feita na próxima etapa)')
    }, 300)
  }
}
</script>

<style scoped>
.signature-canvas {
  height: 200px;
  cursor: crosshair;
  touch-action: none;
  display: block;
}

/* Prevent body scroll when modal is open */
body:has(.fixed) {
  overflow: hidden;
}
</style>