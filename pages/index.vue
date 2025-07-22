<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Simulação de Financiamento</h1>
      <p class="mt-2 text-gray-600">Calcule o financiamento do seu imóvel de forma rápida e fácil</p>
    </div>
    
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Form Section -->
      <div class="order-1">
        <SimulationForm />
      </div>
      
      <!-- Results Section -->
      <div class="order-2">
        <SimulationResult @accept-proposal="openProposalWizard" />
      </div>
    </div>
    
    <!-- Proposal Wizard -->
    <ProposalWizard
      :is-open="isProposalWizardOpen"
      :simulation-data="modalData"
      @close="closeProposalWizard"
      @complete="handleProposalComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSimulationStore } from '~/stores/simulation'
import ProposalWizard from '~/components/ProposalWizard.vue'
import { downloadProposalPDF } from '~/utils/pdfGenerator'

const simulationStore = useSimulationStore()
const { user } = useAuth()
const { saveSimulation } = useSimulations()

const isProposalWizardOpen = ref(false)

const modalData = computed(() => {
  if (!simulationStore.results) {
    return {
      propertyValue: 0,
      downPayment: 0,
      financedAmount: 0,
      interestRate: 0,
      term: 0,
      firstPayment: 0,
      sacFirstPayment: 0,
      sacLastPayment: 0,
      sacTotalPaid: 0,
      sacTotalInterest: 0,
      pricePayment: 0,
      priceTotalPaid: 0,
      priceTotalInterest: 0,
      totalPaid: 0,
      lastPayment: 0
    }
  }
  return {
    propertyValue: simulationStore.results.propertyValue,
    downPayment: simulationStore.results.downPayment,
    financedAmount: simulationStore.results.financedAmount,
    interestRate: simulationStore.results.interestRate,
    term: simulationStore.results.term,
    firstPayment: simulationStore.results.sacFirstPayment,
    sacFirstPayment: simulationStore.results.sacFirstPayment,
    sacLastPayment: simulationStore.results.sacLastPayment,
    sacTotalPaid: simulationStore.results.sacTotalPaid,
    sacTotalInterest: simulationStore.results.sacTotalInterest,
    pricePayment: simulationStore.results.pricePayment,
    priceTotalPaid: simulationStore.results.priceTotalPaid,
    priceTotalInterest: simulationStore.results.priceTotalInterest,
    totalPaid: simulationStore.results.sacTotalPaid,
    lastPayment: simulationStore.results.sacLastPayment
  }
})

const openProposalWizard = () => {
  isProposalWizardOpen.value = true
}

const closeProposalWizard = () => {
  isProposalWizardOpen.value = false
}

const handleProposalComplete = async (data: { personalData: any, signatureData: string, selectedMethod: 'sac' | 'price' }) => {
  // Save simulation to Firestore with lead data
  if (simulationStore.results && user.value) {
    const simulationDataWithLead = {
      ...simulationStore.results,
      leadData: data.personalData
    }
    
    const result = await saveSimulation(simulationDataWithLead, data.signatureData)
    
    if (result.success) {
      closeProposalWizard()
      
      // Save data to sessionStorage for thank you page
      const proposalData = {
        simulation: simulationStore.results,
        personalData: {
          ...data.personalData,
          email: user.value.email
        },
        signatureData: data.signatureData,
        selectedMethod: data.selectedMethod,
        createdAt: new Date()
      }
      
      sessionStorage.setItem('proposalData', JSON.stringify(proposalData))
      
      // Navigate to thank you page
      await navigateTo('/obrigado')
    } else {
      alert('Erro ao salvar proposta: ' + result.error)
    }
  }
}
</script>

<style scoped>
/* Page-specific styles */
</style>