<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Dados do Financiamento</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Valor do Imóvel -->
      <div>
        <label for="propertyValue" class="block text-sm font-medium text-gray-700 mb-2">
          Valor do Imóvel
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
          <input
            id="propertyValue"
            :value="formattedPropertyValue"
            @input="handlePropertyValueInput"
            @blur="handlePropertyValueBlur"
            type="text"
            inputmode="numeric"
            class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="0,00"
            required
          />
        </div>
      </div>
      
      <!-- Valor da Entrada -->
      <div>
        <label for="downPayment" class="block text-sm font-medium text-gray-700 mb-2">
          Valor da Entrada
          <span class="text-xs text-gray-500 ml-1">(mínimo 20%)</span>
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
          <input
            id="downPayment"
            :value="formattedDownPayment"
            @input="handleDownPaymentInput"
            @blur="handleDownPaymentBlur"
            type="text"
            inputmode="numeric"
            class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="0,00"
            required
          />
          <span 
            v-if="downPaymentPercentage > 0" 
            class="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
            :class="downPaymentPercentage >= 20 ? 'text-green-600' : 'text-red-600'"
          >
            {{ downPaymentPercentage.toFixed(1).replace('.', ',') }}%
          </span>
        </div>
        <p v-if="downPaymentError" class="mt-1 text-sm text-red-600">
          {{ downPaymentError }}
        </p>
      </div>
      
      <!-- Prazo -->
      <div>
        <label for="term" class="block text-sm font-medium text-gray-700 mb-2">
          Prazo de Financiamento
          <span class="text-xs text-gray-500 ml-1">(60 a 420 meses)</span>
        </label>
        <div class="relative">
          <input
            id="term"
            v-model.number="formData.term"
            type="number"
            min="60"
            max="420"
            step="12"
            class="w-full pr-16 pl-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="360"
            required
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">meses</span>
        </div>
        <div class="mt-2 flex items-center space-x-2">
          <button
            type="button"
            v-for="months in quickTermOptions"
            :key="months"
            @click="formData.term = months"
            class="px-3 py-1 text-sm rounded-lg transition-all"
            :class="formData.term === months 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ months / 12 }} anos
          </button>
        </div>
      </div>
      
      <!-- Botão de Calcular -->
      <button
        type="submit"
        :disabled="!isFormValid"
        class="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 transform active:scale-95"
        :class="isFormValid 
          ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm' 
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
      >
        Calcular Financiamento
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSimulationStore } from '~/stores/simulation'
import { formatCurrencyInput, parseCurrency, formatNumber } from '~/utils/formatters'

const simulationStore = useSimulationStore()

const formData = ref({
  propertyValue: 0,
  downPayment: 0,
  term: 360
})

const formattedPropertyValue = ref('')
const formattedDownPayment = ref('')
const downPaymentError = ref('')

const quickTermOptions = [180, 240, 360, 420]

const downPaymentPercentage = computed(() => {
  if (formData.value.propertyValue === 0) return 0
  return (formData.value.downPayment / formData.value.propertyValue) * 100
})

const isFormValid = computed(() => {
  return formData.value.propertyValue > 0 &&
         formData.value.downPayment >= formData.value.propertyValue * 0.2 &&
         formData.value.term >= 60 &&
         formData.value.term <= 420
})

const handlePropertyValueInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const cursorPosition = target.selectionStart || 0
  const oldLength = target.value.length
  
  // Format the input
  const formatted = formatCurrencyInput(target.value)
  formattedPropertyValue.value = formatted
  
  // Update numeric value
  formData.value.propertyValue = parseCurrency(formatted)
  
  // Auto-adjust down payment if it's below 20%
  if (formData.value.downPayment < formData.value.propertyValue * 0.2) {
    formData.value.downPayment = formData.value.propertyValue * 0.2
    formattedDownPayment.value = formatCurrencyInput((formData.value.downPayment * 100).toString())
  }
  
  // Restore cursor position
  requestAnimationFrame(() => {
    const newLength = formatted.length
    const diff = newLength - oldLength
    target.setSelectionRange(cursorPosition + diff, cursorPosition + diff)
  })
}

const handlePropertyValueBlur = () => {
  if (formData.value.propertyValue > 0) {
    formattedPropertyValue.value = formatNumber(formData.value.propertyValue, 2)
  }
}

const handleDownPaymentInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const cursorPosition = target.selectionStart || 0
  const oldLength = target.value.length
  
  // Format the input
  const formatted = formatCurrencyInput(target.value)
  formattedDownPayment.value = formatted
  
  // Update numeric value
  formData.value.downPayment = parseCurrency(formatted)
  
  // Validate down payment
  if (formData.value.propertyValue > 0 && formData.value.downPayment < formData.value.propertyValue * 0.2) {
    downPaymentError.value = `Entrada mínima: ${formatNumber(formData.value.propertyValue * 0.2, 2)}`
  } else {
    downPaymentError.value = ''
  }
  
  // Restore cursor position
  requestAnimationFrame(() => {
    const newLength = formatted.length
    const diff = newLength - oldLength
    target.setSelectionRange(cursorPosition + diff, cursorPosition + diff)
  })
}

const handleDownPaymentBlur = () => {
  if (formData.value.downPayment > 0) {
    formattedDownPayment.value = formatNumber(formData.value.downPayment, 2)
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  simulationStore.calculateSimulation({
    propertyValue: formData.value.propertyValue,
    downPayment: formData.value.downPayment,
    term: formData.value.term,
    interestRate: 0.009489 // 0.9489% ao mês (aproximadamente 12% ao ano)
  })
}

// Initialize with example values
onMounted(() => {
  formData.value.propertyValue = 500000
  formData.value.downPayment = 100000
  formattedPropertyValue.value = formatNumber(500000, 2)
  formattedDownPayment.value = formatNumber(100000, 2)
})
</script>