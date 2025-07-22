<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Success Icon -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Proposta Enviada com Sucesso!</h1>
        <p class="text-lg text-gray-600">Sua simulação foi salva e está sendo analisada</p>
      </div>

      <!-- Proposal Details Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Detalhes da Proposta</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p class="text-sm text-gray-600 mb-1">Valor do Imóvel</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(simulationData?.propertyValue || 0) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Valor Financiado</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(simulationData?.financedAmount || 0) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Prazo</p>
            <p class="text-lg font-semibold text-gray-900">{{ simulationData?.term || 0 }} meses</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Sistema Escolhido</p>
            <p class="text-lg font-semibold" :class="selectedMethod === 'sac' ? 'text-blue-600' : 'text-purple-600'">
              {{ selectedMethod === 'sac' ? 'Sistema SAC' : 'Tabela Price' }}
            </p>
          </div>
        </div>

        <!-- Selected Method Details -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumo do Financiamento</h3>
          <div v-if="selectedMethod === 'sac'" class="bg-blue-50 rounded-xl p-6">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-blue-700">Primeira Parcela</p>
                <p class="text-xl font-bold text-blue-900">{{ formatCurrency(simulationData?.sacFirstPayment || 0) }}</p>
              </div>
              <div>
                <p class="text-sm text-blue-700">Última Parcela</p>
                <p class="text-xl font-bold text-blue-900">{{ formatCurrency(simulationData?.sacLastPayment || 0) }}</p>
              </div>
              <div>
                <p class="text-sm text-blue-700">Total a Pagar</p>
                <p class="text-xl font-bold text-blue-900">{{ formatCurrency(simulationData?.sacTotalPaid || 0) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="bg-purple-50 rounded-xl p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-purple-700">Parcela Fixa</p>
                <p class="text-xl font-bold text-purple-900">{{ formatCurrency(simulationData?.pricePayment || 0) }}</p>
              </div>
              <div>
                <p class="text-sm text-purple-700">Total a Pagar</p>
                <p class="text-xl font-bold text-purple-900">{{ formatCurrency(simulationData?.priceTotalPaid || 0) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Download PDF Button -->
      <div class="text-center mb-8">
        <button
          @click="downloadPDF"
          class="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Baixar Proposta em PDF
        </button>
      </div>

      <!-- Next Steps -->
      <div class="bg-gray-50 rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Próximos Passos</h3>
        <ol class="space-y-3">
          <li class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
            <p class="text-gray-700">Nossa equipe analisará sua proposta em até 24 horas úteis</p>
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
            <p class="text-gray-700">Você receberá um e-mail com o status da análise</p>
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
            <p class="text-gray-700">Um consultor entrará em contato para dar continuidade ao processo</p>
          </li>
        </ol>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Nova Simulação
        </NuxtLink>
        <a
          href="mailto:contato@financiamento.com"
          class="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
        >
          Falar com Consultor
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatCurrency } from '~/utils/formatters'
import { downloadProposalPDF } from '~/utils/pdfGenerator'
import { useSimulationStore } from '~/stores/simulation'

const route = useRoute()
const router = useRouter()
const simulationStore = useSimulationStore()

const simulationData = ref<any>(null)
const personalData = ref<any>(null)
const signatureData = ref<string>('')
const selectedMethod = ref<'sac' | 'price'>('sac')

onMounted(() => {
  // Try to get data from route params first
  if (route.query.simulationId) {
    // In a real app, we would fetch from Firestore
    // For now, use data from store if available
    if (simulationStore.results) {
      simulationData.value = simulationStore.results
    }
  }
  
  // Get data from sessionStorage (set by the proposal wizard)
  const savedData = sessionStorage.getItem('proposalData')
  if (savedData) {
    const data = JSON.parse(savedData)
    simulationData.value = data.simulation
    personalData.value = data.personalData
    signatureData.value = data.signatureData
    selectedMethod.value = data.selectedMethod || 'sac'
    
    // Clear sessionStorage
    sessionStorage.removeItem('proposalData')
  }
  
  // If no data, redirect to home
  if (!simulationData.value) {
    router.push('/')
  }
})

const downloadPDF = async () => {
  if (!simulationData.value || !personalData.value) return
  
  try {
    const pdfData = {
      simulation: simulationData.value,
      personalData: personalData.value,
      signatureData: signatureData.value,
      selectedMethod: selectedMethod.value,
      createdAt: new Date()
    }
    
    await downloadProposalPDF(pdfData, `proposta_financiamento_${Date.now()}.pdf`)
  } catch (error) {
    console.error('Error downloading PDF:', error)
    alert('Erro ao baixar PDF. Tente novamente.')
  }
}
</script>