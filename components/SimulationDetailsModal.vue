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
          @click="$emit('close')"
        ></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4 sm:p-6">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="isOpen" class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              <!-- Header -->
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
                <div class="flex items-center justify-between">
                  <h2 class="text-2xl font-semibold text-white">
                    Detalhes da Simulação
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
              </div>
              
              <!-- Content -->
              <div class="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <!-- User Info -->
                <div class="bg-gray-50 rounded-2xl p-5">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações do Cliente</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-600">Nome</p>
                      <p class="font-medium text-gray-900">{{ simulation.leadData?.fullName || simulation.userName || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">E-mail</p>
                      <p class="font-medium text-gray-900">{{ simulation.userEmail || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Telefone</p>
                      <p class="font-medium text-gray-900">{{ simulation.leadData?.phone || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">CPF</p>
                      <p class="font-medium text-gray-900">{{ simulation.leadData?.cpf || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Simulation Data -->
                <div class="bg-blue-50 rounded-2xl p-5">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Dados da Simulação</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-600">Valor do Imóvel</p>
                      <p class="font-semibold text-gray-900">{{ formatCurrency(simulation.propertyValue) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Entrada</p>
                      <p class="font-semibold text-gray-900">{{ formatCurrency(simulation.downPayment) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Valor Financiado</p>
                      <p class="font-semibold text-gray-900">{{ formatCurrency(simulation.financedAmount) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Prazo</p>
                      <p class="font-semibold text-gray-900">{{ simulation.term }} meses</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Sistema Escolhido</p>
                      <p class="font-semibold text-gray-900">{{ simulation.selectedMethod === 'sac' ? 'SAC' : 'Tabela Price' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Data da Simulação</p>
                      <p class="font-semibold text-gray-900">{{ formatDateTime(simulation.createdAt) }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Payment Details -->
                <div class="bg-purple-50 rounded-2xl p-5">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalhes do Financiamento</h3>
                  
                  <div v-if="simulation.selectedMethod === 'sac'" class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Primeira Parcela:</span>
                      <span class="font-semibold">{{ formatCurrency(simulation.sacFirstPayment || 0) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Última Parcela:</span>
                      <span class="font-semibold">{{ formatCurrency(simulation.sacLastPayment || 0) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Total de Juros:</span>
                      <span class="font-semibold">{{ formatCurrency(simulation.sacTotalInterest || 0) }}</span>
                    </div>
                    <div class="flex justify-between pt-3 border-t">
                      <span class="text-gray-900 font-medium">Total a Pagar:</span>
                      <span class="font-bold text-lg">{{ formatCurrency(simulation.sacTotalPaid || 0) }}</span>
                    </div>
                  </div>
                  
                  <div v-else class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Parcela Fixa:</span>
                      <span class="font-semibold">{{ formatCurrency(simulation.pricePayment || 0) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Total de Juros:</span>
                      <span class="font-semibold">{{ formatCurrency(simulation.priceTotalInterest || 0) }}</span>
                    </div>
                    <div class="flex justify-between pt-3 border-t">
                      <span class="text-gray-900 font-medium">Total a Pagar:</span>
                      <span class="font-bold text-lg">{{ formatCurrency(simulation.priceTotalPaid || 0) }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Status -->
                <div class="bg-green-50 rounded-2xl p-5">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">Status da Proposta</h3>
                  <div class="flex items-center space-x-3">
                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="font-medium text-green-700">Proposta Aceita e Assinada</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-2">
                    PDF gerado em {{ formatDateTime(simulation.createdAt) }}
                  </p>
                </div>
              </div>
              
              <!-- Footer Actions -->
              <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    @click="handleDownloadPDF"
                    :disabled="!simulation.pdfUrl"
                    class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Baixar PDF
                  </button>
                  
                  <button
                    @click="handleWhatsApp"
                    :disabled="!simulation.leadData?.phone"
                    class="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </button>
                  
                  <button
                    @click="$emit('close')"
                    class="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Fechar
                  </button>
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
import { formatCurrency } from '~/utils/formatters'

interface SimulationData {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  propertyValue: number
  downPayment: number
  financedAmount: number
  term: number
  interestRate: number
  sacFirstPayment?: number
  sacLastPayment?: number
  sacTotalPaid?: number
  sacTotalInterest?: number
  pricePayment?: number
  priceTotalPaid?: number
  priceTotalInterest?: number
  selectedMethod: 'sac' | 'price'
  leadData?: {
    fullName: string
    phone: string
    cpf: string
  }
  pdfUrl?: string
  createdAt: any
}

const props = defineProps<{
  isOpen: boolean
  simulation: SimulationData
}>()

const emit = defineEmits<{
  close: []
}>()

const formatDateTime = (timestamp: any) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

const handleDownloadPDF = () => {
  if (props.simulation.pdfUrl) {
    window.open(props.simulation.pdfUrl, '_blank')
  }
}

const handleWhatsApp = () => {
  if (props.simulation.leadData?.phone) {
    const phone = props.simulation.leadData.phone.replace(/\D/g, '')
    const message = encodeURIComponent(`Olá ${props.simulation.leadData.fullName}! Vi que você fez uma simulação de financiamento conosco. Gostaria de conversar sobre sua proposta?`)
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank')
  }
}
</script>