// Loan calculation utilities

export interface LoanCalculationResult {
  totalInterest: number
  totalAmount: number
  monthlyPayment: number
}

/**
 * Calculate loan details based on principal amount and duration
 * @param principal - The loan amount
 * @param durationMonths - The loan duration in months
 * @param annualInterestRate - Annual interest rate (default 12%)
 * @returns Calculated loan details
 */
export function calculateLoan(
  principal: number,
  durationMonths: number,
  annualInterestRate: number = 0.12
): LoanCalculationResult {
  // Convert annual rate to monthly rate
  const monthlyRate = annualInterestRate / 12
  
  // Calculate monthly payment using loan formula
  const monthlyPayment = 
    principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) / 
    (Math.pow(1 + monthlyRate, durationMonths) - 1)
  
  // Calculate total amount to be paid
  const totalAmount = monthlyPayment * durationMonths
  
  // Calculate total interest
  const totalInterest = totalAmount - principal
  
  return {
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100
  }
}

/**
 * Calculate compound interest
 * @param principal - Initial amount
 * @param rate - Interest rate (as decimal)
 * @param time - Time period
 * @param n - Number of times interest is compounded per time period
 * @returns Final amount after compound interest
 */
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  n: number = 12
): number {
  const amount = principal * Math.pow(1 + rate / n, n * time)
  return Math.round(amount * 100) / 100
}

/**
 * Calculate simple interest
 * @param principal - Initial amount
 * @param rate - Interest rate (as decimal)
 * @param time - Time period
 * @returns Interest amount
 */
export function calculateSimpleInterest(
  principal: number,
  rate: number,
  time: number
): number {
  const interest = principal * rate * time
  return Math.round(interest * 100) / 100
}