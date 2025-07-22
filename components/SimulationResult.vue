<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Resultado da Simulação</h2>
    
    <div v-if="simulationStore.results" class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-blue-50 rounded-xl p-4">
          <p class="text-sm text-blue-600 mb-1">Valor Financiado</p>
          <p class="text-lg font-semibold text-blue-900">{{ formatCurrency(simulationStore.results.financedAmount) }}</p>
        </div>
        <div class="bg-green-50 rounded-xl p-4">
          <p class="text-sm text-green-600 mb-1">Entrada</p>
          <p class="text-lg font-semibold text-green-900">{{ formatCurrency(simulationStore.results.downPayment) }}</p>
        </div>
      </div>
      
      <!-- Comparison Toggle -->
      <div class="flex justify-center">
        <div class="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            @click="selectedSystem = 'sac'"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              selectedSystem === 'sac' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Sistema SAC
          </button>
          <button
            @click="selectedSystem = 'price'"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              selectedSystem === 'price' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Tabela Price
          </button>
        </div>
      </div>
      
      <!-- Payment Details -->
      <div class="space-y-4">
        <!-- SAC System -->
        <div v-if="selectedSystem === 'sac'" class="space-y-4">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <p class="text-sm opacity-90 mb-2">Parcelas decrescentes</p>
            <p class="text-3xl font-bold mb-1">
              {{ simulationStore.results.term }}x
              <span class="text-xl font-normal">a partir de</span>
            </p>
            <p class="text-2xl">{{ formatCurrency(simulationStore.results.sacFirstPayment) }}</p>
          </div>
          
          <div class="border rounded-xl p-4">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Detalhes SAC</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Primeira parcela</span>
                <span class="font-medium">{{ formatCurrency(simulationStore.results.sacFirstPayment) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Última parcela</span>
                <span class="font-medium">{{ formatCurrency(simulationStore.results.sacLastPayment) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total de juros</span>
                <span class="font-medium text-orange-600">{{ formatCurrency(simulationStore.results.sacTotalInterest) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t">
                <span class="text-gray-900 font-medium">Total a pagar</span>
                <span class="font-bold">{{ formatCurrency(simulationStore.results.sacTotalPaid) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Price System -->
        <div v-if="selectedSystem === 'price'" class="space-y-4">
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <p class="text-sm opacity-90 mb-2">Parcelas fixas</p>
            <p class="text-3xl font-bold mb-1">
              {{ simulationStore.results.term }}x
              <span class="text-xl font-normal">de</span>
            </p>
            <p class="text-2xl">{{ formatCurrency(simulationStore.results.pricePayment) }}</p>
          </div>
          
          <div class="border rounded-xl p-4">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Detalhes Price</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Parcela fixa</span>
                <span class="font-medium">{{ formatCurrency(simulationStore.results.pricePayment) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total de juros</span>
                <span class="font-medium text-orange-600">{{ formatCurrency(simulationStore.results.priceTotalInterest) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t">
                <span class="text-gray-900 font-medium">Total a pagar</span>
                <span class="font-bold">{{ formatCurrency(simulationStore.results.priceTotalPaid) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Comparison Box -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p class="text-sm text-yellow-800">
            <span class="font-medium">💡 Economia com SAC:</span>
            {{ formatCurrency(simulationStore.results.priceTotalPaid - simulationStore.results.sacTotalPaid) }}
          </p>
        </div>
        
        <!-- Additional Info -->
        <div class="text-sm text-gray-500 space-y-1">
          <p>Taxa de juros: {{ (simulationStore.results.interestRate * 100).toFixed(3) }}% ao mês</p>
          <p>Prazo: {{ simulationStore.results.term }} meses ({{ (simulationStore.results.term / 12).toFixed(1) }} anos)</p>
        </div>
      </div>
      
      <!-- Accept Button -->
      <div class="pt-4 border-t">
        <button
          @click="acceptProposal"
          class="w-full py-3 px-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all duration-200 transform active:scale-95 shadow-sm"
        >
          Aceitar Proposta
        </button>
      </div>
    </div>
    
    <div v-else class="text-gray-500 text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <p>Preencha o formulário para ver o resultado da simulação</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSimulationStore } from '~/stores/simulation'
import { formatCurrency } from '~/utils/formatters'

const simulationStore = useSimulationStore()
const selectedSystem = ref<'sac' | 'price'>('sac')

const emit = defineEmits<{
  'accept-proposal': []
}>()

const acceptProposal = () => {
  emit('accept-proposal')
}
</script>