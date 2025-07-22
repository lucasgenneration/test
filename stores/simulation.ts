import { defineStore } from 'pinia'

interface SimulationData {
  propertyValue: number
  downPayment: number
  term: number
  interestRate: number
}

interface SimulationResult {
  propertyValue: number
  downPayment: number
  financedAmount: number
  term: number
  interestRate: number
  // SAC System
  sacPayments: MonthlyPayment[]
  sacFirstPayment: number
  sacLastPayment: number
  sacTotalPaid: number
  sacTotalInterest: number
  // Price System
  pricePayment: number
  priceTotalPaid: number
  priceTotalInterest: number
  // Common
  timestamp: Date
}

interface MonthlyPayment {
  month: number
  principal: number
  interest: number
  total: number
  remainingBalance: number
}

export const useSimulationStore = defineStore('simulation', {
  state: () => ({
    formData: null as SimulationData | null,
    results: null as SimulationResult | null,
    history: [] as SimulationResult[],
    signatureData: null as string | null
  }),

  getters: {
    hasResults: (state) => state.results !== null,
    resultsCount: (state) => state.history.length,
    financedAmount: (state) => {
      if (!state.formData) return 0
      return state.formData.propertyValue - state.formData.downPayment
    }
  },

  actions: {
    calculateSimulation(data: SimulationData) {
      this.formData = data
      
      const financedAmount = data.propertyValue - data.downPayment
      const monthlyRate = data.interestRate
      
      // SAC (Sistema de Amortização Constante) calculation
      const sacPayments: MonthlyPayment[] = []
      const principalPayment = financedAmount / data.term
      let remainingBalance = financedAmount
      let sacTotalPaid = 0
      let sacTotalInterest = 0
      
      for (let month = 1; month <= data.term; month++) {
        const interestPayment = remainingBalance * monthlyRate
        const totalPayment = principalPayment + interestPayment
        
        remainingBalance -= principalPayment
        sacTotalPaid += totalPayment
        sacTotalInterest += interestPayment
        
        sacPayments.push({
          month,
          principal: principalPayment,
          interest: interestPayment,
          total: totalPayment,
          remainingBalance: Math.max(0, remainingBalance)
        })
      }
      
      // Price (Tabela Price) calculation
      // PMT = PV * [r(1 + r)^n] / [(1 + r)^n - 1]
      const pricePayment = financedAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, data.term)) / 
        (Math.pow(1 + monthlyRate, data.term) - 1)
      
      const priceTotalPaid = pricePayment * data.term
      const priceTotalInterest = priceTotalPaid - financedAmount
      
      this.results = {
        propertyValue: data.propertyValue,
        downPayment: data.downPayment,
        financedAmount,
        term: data.term,
        interestRate: data.interestRate,
        // SAC results
        sacPayments,
        sacFirstPayment: sacPayments[0].total,
        sacLastPayment: sacPayments[sacPayments.length - 1].total,
        sacTotalPaid: sacTotalPaid + data.downPayment,
        sacTotalInterest,
        // Price results
        pricePayment,
        priceTotalPaid: priceTotalPaid + data.downPayment,
        priceTotalInterest,
        // Common
        timestamp: new Date()
      }
      
      // Add to history
      this.history.unshift(this.results)
    },
    
    setSignature(signatureData: string) {
      this.signatureData = signatureData
    },
    
    clearResults() {
      this.results = null
      this.formData = null
      this.signatureData = null
    },
    
    clearHistory() {
      this.history = []
    },
    
    removeFromHistory(index: number) {
      this.history.splice(index, 1)
    }
  }
})