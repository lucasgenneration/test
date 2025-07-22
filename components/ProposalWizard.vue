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
          class="fixed inset-0 bg-black/60 backdrop-blur-md"
          @click="handleBackdropClick"
        ></div>
        
        <!-- Wizard Container -->
        <div class="flex min-h-full items-start sm:items-center justify-center p-4 sm:p-6">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="isOpen" class="relative w-full max-w-2xl my-8">
              <!-- Wizard Content -->
              <div class="bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <!-- Progress Bar -->
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 flex-shrink-0">
                  <div class="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 class="text-xl sm:text-2xl font-semibold text-white">
                      {{ currentStepTitle }}
                    </h2>
                    <button
                      @click="$emit('close')"
                      class="text-white/80 hover:text-white transition-colors p-1"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Step Indicator -->
                  <div class="flex items-center justify-center space-x-3">
                    <div 
                      v-for="step in 4" 
                      :key="step"
                      class="flex items-center"
                    >
                      <div 
                        class="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
                        :class="getStepClasses(step)"
                      >
                        <span v-if="step < currentStep" class="text-white">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span v-else class="text-sm font-medium">{{ step }}</span>
                      </div>
                      <div 
                        v-if="step < 4"
                        class="w-12 h-1 ml-3 rounded-full transition-all duration-300"
                        :class="step < currentStep ? 'bg-white' : 'bg-white/30'"
                      ></div>
                    </div>
                  </div>
                </div>
                
                <!-- Content Area -->
                <div class="p-6 sm:p-8 overflow-y-auto flex-1">
                  <TransitionGroup
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 translate-x-4"
                    enter-to-class="opacity-100 translate-x-0"
                    leave-active-class="transition-all duration-200 ease-in absolute inset-0"
                    leave-from-class="opacity-100 translate-x-0"
                    leave-to-class="opacity-0 -translate-x-4"
                  >
                    <!-- Step 1: Login/Register -->
                    <div v-if="currentStep === 1" key="step1">
                      <div class="text-center mb-8">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Vamos começar!</h3>
                        <p class="text-gray-600">Entre com sua conta para prosseguir com a proposta</p>
                      </div>
                      
                      <!-- Embedded Login Form -->
                      <LoginForm 
                        :embedded="true"
                        @login-success="handleLoginSuccess"
                      />
                    </div>
                    
                    <!-- Step 2: Personal Data -->
                    <div v-if="currentStep === 2" key="step2">
                      <div class="text-center mb-8">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Seus dados pessoais</h3>
                        <p class="text-gray-600">Precisamos de algumas informações para finalizar sua proposta</p>
                      </div>
                      
                      <form @submit.prevent="handlePersonalDataSubmit" class="space-y-6">
                        <!-- Nome Completo -->
                        <div>
                          <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                            Nome completo
                          </label>
                          <input
                            id="fullName"
                            v-model="personalData.fullName"
                            type="text"
                            required
                            :disabled="!!user?.displayName"
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            :class="user?.displayName ? 'bg-gray-50 text-gray-600' : ''"
                            placeholder="João da Silva"
                          />
                          <p v-if="user?.displayName" class="mt-1 text-xs text-gray-500">
                            Nome preenchido automaticamente do seu perfil
                          </p>
                        </div>
                        
                        <!-- Telefone -->
                        <div>
                          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                            Telefone
                          </label>
                          <input
                            id="phone"
                            v-model="personalData.phone"
                            @input="handlePhoneInput"
                            type="tel"
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="(11) 98765-4321"
                          />
                        </div>
                        
                        <!-- CPF -->
                        <div>
                          <label for="cpf" class="block text-sm font-medium text-gray-700 mb-2">
                            CPF
                          </label>
                          <input
                            id="cpf"
                            v-model="personalData.cpf"
                            @input="handleCpfInput"
                            type="text"
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="123.456.789-00"
                          />
                        </div>
                        
                        <!-- Consent -->
                        <div class="bg-blue-50 rounded-xl p-4">
                          <label class="flex items-start space-x-3">
                            <input
                              v-model="personalData.consent"
                              type="checkbox"
                              required
                              class="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span class="text-sm text-gray-700">
                              Autorizo o uso dos meus dados para análise da proposta de financiamento e concordo em ser contactado sobre o andamento do processo.
                            </span>
                          </label>
                        </div>
                      </form>
                    </div>
                    
                    <!-- Step 3: Choose Method -->
                    <div v-if="currentStep === 3" key="step3">
                      <div class="text-center mb-8">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Escolha o sistema de amortização</h3>
                        <p class="text-gray-600">Selecione a melhor opção para seu perfil</p>
                      </div>
                      
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <!-- SAC Option -->
                        <div 
                          @click="selectedMethod = 'sac'"
                          class="relative border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all"
                          :class="selectedMethod === 'sac' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
                        >
                          <div v-if="selectedMethod === 'sac'" class="absolute top-4 right-4">
                            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          
                          <h4 class="text-lg font-semibold text-gray-900 mb-2">Sistema SAC</h4>
                          <p class="text-sm text-gray-600 mb-4">Parcelas decrescentes</p>
                          
                          <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                              <span class="text-gray-600">Primeira parcela:</span>
                              <span class="font-semibold">{{ formatCurrency(simulationData.sacFirstPayment || simulationData.firstPayment || 0) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                              <span class="text-gray-600">Última parcela:</span>
                              <span class="font-semibold">{{ formatCurrency(simulationData.sacLastPayment || simulationData.lastPayment || 0) }}</span>
                            </div>
                            <div class="flex justify-between text-sm pt-2 border-t">
                              <span class="text-gray-600">Total a pagar:</span>
                              <span class="font-bold text-blue-600">{{ formatCurrency(simulationData.sacTotalPaid || simulationData.totalPaid || 0) }}</span>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Price Option -->
                        <div 
                          @click="selectedMethod = 'price'"
                          class="relative border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all"
                          :class="selectedMethod === 'price' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'"
                        >
                          <div v-if="selectedMethod === 'price'" class="absolute top-4 right-4">
                            <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          
                          <h4 class="text-lg font-semibold text-gray-900 mb-2">Tabela Price</h4>
                          <p class="text-sm text-gray-600 mb-4">Parcelas fixas</p>
                          
                          <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                              <span class="text-gray-600">Parcela fixa:</span>
                              <span class="font-semibold">{{ formatCurrency(simulationData.pricePayment || 0) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                              <span class="text-gray-600">Quantidade:</span>
                              <span class="font-semibold">{{ simulationData.term }}x</span>
                            </div>
                            <div class="flex justify-between text-sm pt-2 border-t">
                              <span class="text-gray-600">Total a pagar:</span>
                              <span class="font-bold text-purple-600">{{ formatCurrency(simulationData.priceTotalPaid || 0) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Savings Info -->
                      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                        <p class="text-sm font-medium text-yellow-800">
                          💡 Economia com SAC: {{ formatCurrency(Math.abs((simulationData.priceTotalPaid || 0) - (simulationData.sacTotalPaid || simulationData.totalPaid || 0))) }}
                        </p>
                      </div>
                    </div>
                    
                    <!-- Step 4: Signature -->
                    <div v-if="currentStep === 4" key="step4">
                      <div class="text-center mb-8">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Assinatura da proposta</h3>
                        <p class="text-gray-600">Assine abaixo para confirmar sua proposta de financiamento</p>
                      </div>
                      
                      <!-- Proposal Summary -->
                      <div class="bg-gray-50 rounded-2xl p-6 mb-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Resumo da proposta</h4>
                        <div class="space-y-2 text-sm">
                          <div class="flex justify-between">
                            <span class="text-gray-600">Valor do imóvel:</span>
                            <span class="font-medium">{{ formatCurrency(simulationData.propertyValue) }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-600">Entrada:</span>
                            <span class="font-medium">{{ formatCurrency(simulationData.downPayment) }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-600">Valor financiado:</span>
                            <span class="font-medium">{{ formatCurrency(simulationData.financedAmount) }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-600">Prazo:</span>
                            <span class="font-medium">{{ simulationData.term }} meses</span>
                          </div>
                          <div class="flex justify-between pt-2 border-t">
                            <span class="text-gray-900 font-medium">Sistema escolhido:</span>
                            <span class="font-semibold text-lg" :class="selectedMethod === 'sac' ? 'text-blue-600' : 'text-purple-600'">
                              {{ selectedMethod === 'sac' ? 'SAC' : 'Price' }}
                            </span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-900 font-medium">{{ selectedMethod === 'sac' ? 'Primeira parcela:' : 'Parcela fixa:' }}</span>
                            <span class="font-semibold text-lg">
                              {{ formatCurrency(selectedMethod === 'sac' ? 
                                (simulationData.sacFirstPayment || simulationData.firstPayment || 0) : 
                                (simulationData.pricePayment || 0)) }}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Signature Pad -->
                      <div class="relative">
                        <div class="border-2 border-dashed border-gray-300 rounded-2xl p-2 bg-gray-50">
                          <canvas
                            ref="canvas"
                            class="signature-canvas bg-white rounded-xl w-full"
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
                        
                        <!-- Clear Button -->
                        <button
                          v-if="hasSignature"
                          @click="clearSignature"
                          type="button"
                          class="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white transition-all"
                        >
                          Limpar
                        </button>
                      </div>
                    </div>
                  </TransitionGroup>
                </div>
                
                <!-- Footer Actions -->
                <div class="bg-gray-50 px-6 sm:px-8 py-4 sm:py-6 border-t border-gray-200 flex-shrink-0">
                  <div class="flex justify-between items-center">
                    <button
                      v-if="currentStep > 1 && !isLoading"
                      @click="previousStep"
                      class="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                    >
                      Voltar
                    </button>
                    <div v-else></div>
                    
                    <button
                      @click="nextStep"
                      :disabled="!canProceed || isLoading"
                      class="px-8 py-3 rounded-xl font-medium transition-all duration-200 transform active:scale-95"
                      :class="canProceed && !isLoading
                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                    >
                      <span v-if="!isLoading">
                        {{ currentStep === 4 ? 'Finalizar proposta' : 'Continuar' }}
                      </span>
                      <span v-else class="flex items-center">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    </button>
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
import { ref, computed, watch, nextTick } from 'vue'
import { formatCurrency } from '~/utils/formatters'
import LoginForm from './LoginForm.vue'

const props = defineProps<{
  isOpen: boolean
  simulationData: {
    propertyValue: number
    downPayment: number
    financedAmount: number
    interestRate: number
    term: number
    firstPayment?: number
    sacFirstPayment?: number
    sacLastPayment?: number
    sacTotalPaid?: number
    sacTotalInterest?: number
    pricePayment?: number
    priceTotalPaid?: number
    priceTotalInterest?: number
    totalPaid?: number
    lastPayment?: number
  }
}>()

const emit = defineEmits<{
  close: []
  complete: [data: { personalData: any, signatureData: string, selectedMethod: 'sac' | 'price' }]
}>()

const { user } = useAuth()
const { saveLeadData, getUserLeadData } = useLeads()

// Wizard state
const currentStep = ref(1)
const isLoading = ref(false)

// Form data
const personalData = ref({
  fullName: '',
  phone: '',
  cpf: '',
  consent: false
})

// Selected method
const selectedMethod = ref<'sac' | 'price'>('sac')

// Signature state
const canvas = ref<HTMLCanvasElement>()
const isDrawing = ref(false)
const hasDrawn = ref(false)
let ctx: CanvasRenderingContext2D | null = null

// Computed
const currentStepTitle = computed(() => {
  const titles = {
    1: 'Identifique-se',
    2: 'Seus dados',
    3: 'Escolha o sistema',
    4: 'Assinatura da proposta'
  }
  return titles[currentStep.value as keyof typeof titles]
})

const hasSignature = computed(() => hasDrawn.value)

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return !!user.value
    case 2:
      return personalData.value.fullName &&
             personalData.value.phone.length >= 14 &&
             personalData.value.cpf.length === 14 &&
             personalData.value.consent
    case 3:
      return !!selectedMethod.value
    case 4:
      return hasSignature.value
    default:
      return false
  }
})

// Watch for open state
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    currentStep.value = user.value ? 2 : 1
    await checkExistingData()
  } else {
    // Reset state
    currentStep.value = 1
    hasDrawn.value = false
    personalData.value = {
      fullName: '',
      phone: '',
      cpf: '',
      consent: false
    }
  }
})

// Watch for step changes to initialize canvas
watch(currentStep, async (step) => {
  if (step === 4) {
    await nextTick()
    initializeCanvas()
  }
})

// Methods
const checkExistingData = async () => {
  if (user.value) {
    // Try to get existing lead data
    const leadData = await getUserLeadData()
    
    if (leadData) {
      personalData.value = {
        fullName: leadData.fullName || user.value.displayName || '',
        phone: leadData.phone || '',
        cpf: leadData.cpf || '',
        consent: true
      }
      
      // If all data is complete, skip to method selection
      if (leadData.fullName && leadData.phone && leadData.cpf) {
        currentStep.value = 3
      }
    } else if (user.value.displayName) {
      personalData.value.fullName = user.value.displayName
    }
  }
}

const getStepClasses = (step: number) => {
  if (step < currentStep.value) {
    return 'bg-white text-blue-600'
  } else if (step === currentStep.value) {
    return 'bg-white/20 text-white border-2 border-white'
  } else {
    return 'bg-white/10 text-white/60'
  }
}

const handleBackdropClick = () => {
  if (confirm('Tem certeza que deseja cancelar a proposta?')) {
    emit('close')
  }
}

const handleLoginSuccess = () => {
  currentStep.value = 2
  checkExistingData()
}

const handlePersonalDataSubmit = async () => {
  if (!canProceed.value) return
  
  isLoading.value = true
  try {
    // Save lead data
    await saveLeadData(personalData.value)
    currentStep.value = 3
  } catch (error) {
    console.error('Error saving lead data:', error)
    alert('Erro ao salvar dados. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  
  if (value.length > 11) value = value.slice(0, 11)
  
  if (value.length > 6) {
    value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
  } else if (value.length > 2) {
    value = `(${value.slice(0, 2)}) ${value.slice(2)}`
  } else if (value.length > 0) {
    value = `(${value}`
  }
  
  personalData.value.phone = value
}

const handleCpfInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  
  if (value.length > 11) value = value.slice(0, 11)
  
  if (value.length > 9) {
    value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`
  } else if (value.length > 6) {
    value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`
  } else if (value.length > 3) {
    value = `${value.slice(0, 3)}.${value.slice(3)}`
  }
  
  personalData.value.cpf = value
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const nextStep = async () => {
  if (!canProceed.value) return
  
  if (currentStep.value === 2) {
    await handlePersonalDataSubmit()
  } else if (currentStep.value === 4) {
    await handleComplete()
  } else {
    currentStep.value++
  }
}

const handleComplete = async () => {
  if (!hasSignature.value || !canvas.value) return
  
  isLoading.value = true
  try {
    const signatureData = canvas.value.toDataURL('image/png')
    
    emit('complete', {
      personalData: personalData.value,
      signatureData,
      selectedMethod: selectedMethod.value
    })
  } finally {
    isLoading.value = false
  }
}

// Canvas methods
const initializeCanvas = () => {
  if (canvas.value) {
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