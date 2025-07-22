<template>
  <div v-if="!loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
      <p class="mt-2 text-gray-600">Gerencie e visualize todas as simulações realizadas</p>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total de Simulações</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ simulations.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Valor Total Financiado</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatCurrency(totalFinanced) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Assinaturas Coletadas</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ signedCount }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome ou email..."
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos</option>
          <option value="signed">Assinados</option>
          <option value="pending">Pendentes</option>
        </select>
        <input
          v-model="filterDate"
          type="date"
          class="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
    
    <!-- Simulations Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor do Imóvel</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="simulation in filteredSimulations" :key="simulation.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ simulation.userName || 'Anônimo' }}</div>
                  <div class="text-sm text-gray-500">{{ simulation.userEmail || 'N/A' }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(simulation.propertyValue) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(simulation.downPayment) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ simulation.term }} meses
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2.5 py-1 text-xs rounded-full font-medium"
                  :class="simulation.signed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ simulation.signed ? 'Assinado' : 'Pendente' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(simulation.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="viewDetails(simulation)"
                  class="text-blue-600 hover:text-blue-800 font-medium mr-3"
                >
                  Ver Detalhes
                </button>
                <button
                  v-if="simulation.signed"
                  @click="downloadPdf(simulation)"
                  class="text-green-600 hover:text-green-800 font-medium"
                >
                  Baixar PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700">
            Mostrando {{ filteredSimulations.length }} de {{ simulations.length }} resultados
          </p>
          <div class="flex space-x-2">
            <button
              class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              :disabled="currentPage === 1"
            >
              Anterior
            </button>
            <button
              class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              :disabled="currentPage === totalPages"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Loading State -->
  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <svg class="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Verificando permissões...</p>
    </div>
  </div>
  
  <!-- Login Modal for Admin Access -->
  <LoginModal
    :is-open="showLoginModal"
    :require-admin="true"
    @close="handleLoginModalClose"
    @login-success="handleLoginSuccess"
  />
  
  <!-- Simulation Details Modal -->
  <SimulationDetailsModal
    v-if="selectedSimulation"
    :is-open="showDetailsModal"
    :simulation="selectedSimulation"
    @close="showDetailsModal = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { formatCurrency } from '~/utils/formatters'
import LoginModal from '~/components/LoginModal.vue'
import SimulationDetailsModal from '~/components/SimulationDetailsModal.vue'
import { downloadProposalPDF } from '~/utils/pdfGenerator'

// Define page meta with middleware
definePageMeta({
  middleware: 'admin-client'
})

const { user, isAdmin, loading, initAuth } = useAuth()
const { getAllSimulations } = useSimulations()
const showLoginModal = ref(false)
const isLoadingData = ref(false)

// Real data from Firestore
const simulations = ref<any[]>([
])

// Filter states
const searchQuery = ref('')
const filterStatus = ref('all')
const filterDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Computed properties
const totalFinanced = computed(() => {
  return simulations.value.reduce((sum, sim) => sum + (sim.financedAmount || (sim.propertyValue - sim.downPayment)), 0)
})

const signedCount = computed(() => {
  return simulations.value.filter(sim => sim.signed).length
})

const filteredSimulations = computed(() => {
  return simulations.value.filter(sim => {
    const clientName = sim.userName || 'Anônimo'
    const clientEmail = sim.userEmail || ''
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      if (!clientName.toLowerCase().includes(query) && 
          !clientEmail.toLowerCase().includes(query)) {
        return false
      }
    }
    
    // Status filter
    if (filterStatus.value !== 'all') {
      if (filterStatus.value === 'signed' && !sim.signed) return false
      if (filterStatus.value === 'pending' && sim.signed) return false
    }
    
    // Date filter
    if (filterDate.value) {
      const filterDateObj = new Date(filterDate.value)
      const simDate = new Date(sim.createdAt)
      if (simDate.toDateString() !== filterDateObj.toDateString()) {
        return false
      }
    }
    
    return true
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredSimulations.value.length / itemsPerPage)
})

// Methods
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const selectedSimulation = ref<any>(null)
const showDetailsModal = ref(false)

const viewDetails = (simulation: any) => {
  selectedSimulation.value = simulation
  showDetailsModal.value = true
}

const downloadPdf = async (simulation: any) => {
  try {
    // Prepare PDF data from simulation
    const pdfData = {
      simulation: {
        propertyValue: simulation.propertyValue,
        downPayment: simulation.downPayment,
        financedAmount: simulation.financedAmount || (simulation.propertyValue - simulation.downPayment),
        term: simulation.term,
        interestRate: simulation.interestRate,
        // Handle both SAC and Price data
        sacFirstPayment: simulation.sacFirstPayment || simulation.firstPayment,
        sacLastPayment: simulation.sacLastPayment || simulation.lastPayment,
        sacTotalPaid: simulation.sacTotalPaid || simulation.totalPaid,
        sacTotalInterest: simulation.sacTotalInterest || simulation.totalInterest,
        pricePayment: simulation.pricePayment || 0,
        priceTotalPaid: simulation.priceTotalPaid || 0,
        priceTotalInterest: simulation.priceTotalInterest || 0,
        // Legacy support
        firstPayment: simulation.firstPayment,
        lastPayment: simulation.lastPayment,
        totalPaid: simulation.totalPaid,
        totalInterest: simulation.totalInterest
      },
      personalData: simulation.leadData || {
        fullName: simulation.userName || 'Não informado',
        phone: simulation.leadData?.phone || 'Não informado',
        cpf: simulation.leadData?.cpf || 'Não informado',
        email: simulation.userEmail
      },
      signatureData: simulation.signatureData,
      createdAt: simulation.createdAt
    }
    
    // Download PDF directly
    const filename = `proposta_${simulation.id}_${new Date(simulation.createdAt).getTime()}.pdf`
    await downloadProposalPDF(pdfData, filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Erro ao gerar PDF. Tente novamente.')
  }
}

// Check auth status on mount and load data
onMounted(async () => {
  await initAuth()
  
  // If not logged in or not admin after auth check, show login modal
  if (!loading.value && (!user.value || !isAdmin.value)) {
    showLoginModal.value = true
  } else {
    // Load simulations from Firestore
    await loadSimulations()
  }
})

const loadSimulations = async () => {
  isLoadingData.value = true
  try {
    simulations.value = await getAllSimulations()
  } catch (error) {
    console.error('Error loading simulations:', error)
  } finally {
    isLoadingData.value = false
  }
}

const handleLoginModalClose = () => {
  showLoginModal.value = false
  // If still not admin, redirect to home
  if (!isAdmin.value) {
    navigateTo('/')
  }
}

const handleLoginSuccess = async () => {
  showLoginModal.value = false
  // Load simulations after successful login
  await loadSimulations()
}
</script>