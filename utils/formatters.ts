// Currency and number formatting utilities for Brazilian Real

/**
 * Format a number as Brazilian currency (R$)
 * @param value - The numeric value to format
 * @returns Formatted currency string in Brazilian format
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

/**
 * Format a number with Brazilian thousand separators
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  decimals: number = 2
): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Format a percentage value
 * @param value - The numeric value (0.12 for 12%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Parse a Brazilian currency string back to number
 * @param value - The currency string to parse
 * @returns Numeric value
 */
export function parseCurrency(value: string): number {
  if (!value) return 0
  
  // Remove R$ symbol and spaces
  let cleanValue = value.replace(/R\$\s?/g, '')
  
  // Replace Brazilian thousand separator (.) with nothing
  cleanValue = cleanValue.replace(/\./g, '')
  
  // Replace Brazilian decimal separator (,) with dot
  cleanValue = cleanValue.replace(',', '.')
  
  // Remove any remaining non-numeric characters except dots
  cleanValue = cleanValue.replace(/[^0-9.]/g, '')
  
  return parseFloat(cleanValue) || 0
}

/**
 * Format currency input while typing
 * @param value - The input value
 * @returns Formatted value for display
 */
export function formatCurrencyInput(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '')
  
  if (!numbers) return ''
  
  // Convert to number (considering cents)
  const amount = parseInt(numbers) / 100
  
  // Format as currency without R$ symbol (we'll add it in the input)
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Abbreviate large numbers (1.2K, 3.4M, etc.)
 * @param value - The numeric value to abbreviate
 * @param decimals - Number of decimal places (default: 1)
 * @returns Abbreviated string
 */
export function abbreviateNumber(value: number, decimals: number = 1): string {
  const abbreviations = [
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' }
  ]
  
  for (const { value: threshold, suffix } of abbreviations) {
    if (Math.abs(value) >= threshold) {
      return (value / threshold).toFixed(decimals).replace('.', ',') + suffix
    }
  }
  
  return formatNumber(value, 0)
}