import { formatCurrency, formatNumber } from './formatters'

interface PDFData {
  simulation: {
    propertyValue: number
    downPayment: number
    financedAmount: number
    term: number
    interestRate: number
    // SAC
    sacFirstPayment: number
    sacLastPayment: number
    sacTotalPaid: number
    sacTotalInterest: number
    // Price
    pricePayment: number
    priceTotalPaid: number
    priceTotalInterest: number
    // Legacy support
    firstPayment?: number
    lastPayment?: number
    totalPaid?: number
    totalInterest?: number
  }
  personalData: {
    fullName: string
    phone: string
    cpf: string
    email?: string
  }
  signatureData?: string
  createdAt?: Date
  selectedMethod?: 'sac' | 'price'
}

export const generateProposalPDF = async (data: PDFData): Promise<any> => {
  // Dynamic import to avoid SSR issues
  const { default: jsPDF } = await import('jspdf')
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPosition = margin
  
  // Colors
  const primaryColor = '#3B82F6' // blue-500
  const darkGray = '#1F2937'
  const mediumGray = '#6B7280'
  const lightGray = '#F3F4F6'
  
  // Helper functions
  const setFontStyle = (size: number, style: 'normal' | 'bold' = 'normal', color: string = darkGray) => {
    pdf.setFontSize(size)
    pdf.setFont('helvetica', style)
    const rgb = hexToRgb(color)
    if (rgb) {
      pdf.setTextColor(rgb.r, rgb.g, rgb.b)
    }
  }
  
  const drawLine = (y: number, color: string = lightGray) => {
    const rgb = hexToRgb(color)
    if (rgb) {
      pdf.setDrawColor(rgb.r, rgb.g, rgb.b)
    }
    pdf.line(margin, y, pageWidth - margin, y)
  }
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  // Header with gradient effect (simulated)
  const primaryRgb = hexToRgb(primaryColor)
  if (primaryRgb) {
    pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  }
  pdf.rect(0, 0, pageWidth, 25, 'F')
  
  // Title
  setFontStyle(18, 'bold', '#FFFFFF')
  pdf.text('Proposta de Financiamento', pageWidth / 2, 15, { align: 'center' })
  
  yPosition = 35
  
  // Document info
  setFontStyle(9, 'normal', mediumGray)
  pdf.text(`Proposta #${Date.now().toString().slice(-8)}`, margin, yPosition)
  pdf.text(
    `Data: ${new Date(data.createdAt || Date.now()).toLocaleDateString('pt-BR')}`, 
    pageWidth - margin, 
    yPosition, 
    { align: 'right' }
  )
  
  yPosition += 10
  
  // Section: Cliente
  setFontStyle(14, 'bold', primaryColor)
  pdf.text('Dados do Cliente', margin, yPosition)
  yPosition += 8
  
  // Client info box
  const lightGrayRgb = hexToRgb(lightGray)
  if (lightGrayRgb) {
    pdf.setFillColor(lightGrayRgb.r, lightGrayRgb.g, lightGrayRgb.b)
  }
  pdf.roundedRect(margin, yPosition - 5, contentWidth, 28, 3, 3, 'F')
  
  setFontStyle(10, 'bold')
  pdf.text(`Nome: ${data.personalData.fullName}`, margin + 5, yPosition + 4)
  
  setFontStyle(9, 'normal')
  pdf.text(`CPF: ${data.personalData.cpf}`, margin + 5, yPosition + 10)
  pdf.text(`Telefone: ${data.personalData.phone}`, margin + 5, yPosition + 16)
  pdf.text(`E-mail: ${data.personalData.email || 'Não informado'}`, margin + 5, yPosition + 22)
  
  yPosition += 35
  
  // Section: Simulação
  setFontStyle(14, 'bold', primaryColor)
  pdf.text('Detalhes da Simulação', margin, yPosition)
  yPosition += 8
  
  // Simulation details
  const details = [
    { label: 'Valor do Imóvel:', value: formatCurrency(data.simulation.propertyValue) },
    { label: 'Valor da Entrada:', value: `${formatCurrency(data.simulation.downPayment)} (${((data.simulation.downPayment / data.simulation.propertyValue) * 100).toFixed(1)}%)` },
    { label: 'Valor Financiado:', value: formatCurrency(data.simulation.financedAmount) },
    { label: 'Prazo:', value: `${data.simulation.term} meses (${(data.simulation.term / 12).toFixed(1)} anos)` },
    { label: 'Taxa de Juros:', value: `${(data.simulation.interestRate * 100).toFixed(3)}% ao mês` }
  ]
  
  details.forEach((detail, index) => {
    if (index % 2 === 0) {
      if (lightGrayRgb) {
        pdf.setFillColor(lightGrayRgb.r, lightGrayRgb.g, lightGrayRgb.b)
      }
      pdf.rect(margin, yPosition - 3, contentWidth, 7, 'F')
    }
    
    setFontStyle(9, 'normal')
    pdf.text(detail.label, margin + 5, yPosition)
    setFontStyle(9, 'bold')
    pdf.text(detail.value, pageWidth - margin - 5, yPosition, { align: 'right' })
    yPosition += 8
  })
  
  yPosition += 8
  
  // SAC System Box
  const isSelectedSAC = data.selectedMethod === 'sac' || !data.selectedMethod
  const sacBoxColor = isSelectedSAC ? primaryColor : '#CBD5E1'
  const sacRgb = hexToRgb(sacBoxColor)
  if (sacRgb) {
    pdf.setFillColor(sacRgb.r, sacRgb.g, sacRgb.b)
  }
  pdf.setTextColor(isSelectedSAC ? 255 : 100, isSelectedSAC ? 255 : 116, isSelectedSAC ? 255 : 121)
  pdf.roundedRect(margin, yPosition, contentWidth / 2 - 5, 50, 3, 3, 'F')
  
  setFontStyle(10, 'bold')
  pdf.text('Sistema SAC', margin + contentWidth / 4 - 5, yPosition + 7, { align: 'center' })
  setFontStyle(8, 'normal')
  pdf.text('(Parcelas decrescentes)', margin + contentWidth / 4 - 5, yPosition + 12, { align: 'center' })
  
  setFontStyle(8, 'normal')
  const sacCol = margin + 5
  pdf.text(`${data.simulation.term}x a partir de`, sacCol, yPosition + 20)
  setFontStyle(10, 'bold')
  pdf.text(formatCurrency(data.simulation.sacFirstPayment || data.simulation.firstPayment || 0), sacCol, yPosition + 26)
  
  setFontStyle(7, 'normal')
  pdf.text(`Última: ${formatCurrency(data.simulation.sacLastPayment || data.simulation.lastPayment || 0)}`, sacCol, yPosition + 32)
  pdf.text(`Juros: ${formatCurrency(data.simulation.sacTotalInterest || data.simulation.totalInterest || 0)}`, sacCol, yPosition + 38)
  pdf.text(`Total: ${formatCurrency(data.simulation.sacTotalPaid || data.simulation.totalPaid || 0)}`, sacCol, yPosition + 44)
  
  // Price System Box
  const isSelectedPrice = data.selectedMethod === 'price'
  const priceBoxColor = isSelectedPrice ? '#9333EA' : '#CBD5E1'
  const priceRgb = hexToRgb(priceBoxColor)
  if (priceRgb) {
    pdf.setFillColor(priceRgb.r, priceRgb.g, priceRgb.b)
  }
  pdf.setTextColor(isSelectedPrice ? 255 : 100, isSelectedPrice ? 255 : 116, isSelectedPrice ? 255 : 121)
  pdf.roundedRect(pageWidth / 2 + 5, yPosition, contentWidth / 2 - 5, 50, 3, 3, 'F')
  
  setFontStyle(10, 'bold')
  pdf.text('Tabela Price', pageWidth / 2 + contentWidth / 4 + 5, yPosition + 7, { align: 'center' })
  setFontStyle(8, 'normal')
  pdf.text('(Parcelas fixas)', pageWidth / 2 + contentWidth / 4 + 5, yPosition + 12, { align: 'center' })
  
  setFontStyle(8, 'normal')
  const priceCol = pageWidth / 2 + 10
  pdf.text(`${data.simulation.term}x de`, priceCol, yPosition + 20)
  setFontStyle(10, 'bold')
  pdf.text(formatCurrency(data.simulation.pricePayment || 0), priceCol, yPosition + 26)
  
  setFontStyle(7, 'normal')
  pdf.text(`Juros: ${formatCurrency(data.simulation.priceTotalInterest || 0)}`, priceCol, yPosition + 38)
  pdf.text(`Total: ${formatCurrency(data.simulation.priceTotalPaid || 0)}`, priceCol, yPosition + 44)
  
  yPosition += 58
  
  // Savings box
  const yellowRgb = hexToRgb('#FEF3C7')
  if (yellowRgb) {
    pdf.setFillColor(yellowRgb.r, yellowRgb.g, yellowRgb.b)
  }
  pdf.roundedRect(margin, yPosition, contentWidth, 12, 3, 3, 'F')
  
  setFontStyle(9, 'bold', '#92400E')
  const sacTotal = data.simulation.sacTotalPaid || data.simulation.totalPaid || 0
  const priceTotal = data.simulation.priceTotalPaid || 0
  const savings = Math.abs(priceTotal - sacTotal)
  pdf.text(`Economia com SAC: ${formatCurrency(savings)}`, pageWidth / 2, yPosition + 7, { align: 'center' })
  
  yPosition += 20
  
  // Signature section
  if (data.signatureData) {
    setFontStyle(11, 'bold', darkGray)
    pdf.text('Assinatura do Cliente', margin, yPosition)
    yPosition += 8
    
    // Add signature image
    try {
      pdf.addImage(data.signatureData, 'PNG', margin, yPosition, 60, 30)
      
      // Signature line
      drawLine(yPosition + 30, darkGray)
      setFontStyle(8, 'normal', mediumGray)
      pdf.text(data.personalData.fullName, margin, yPosition + 34)
      pdf.text(`CPF: ${data.personalData.cpf}`, margin, yPosition + 39)
      
      yPosition += 48
    } catch (error) {
      console.error('Error adding signature:', error)
      yPosition += 20
    }
  }
  
  // Legal disclaimer
  const disclaimerY = pageHeight - 35
  if (lightGrayRgb) {
    pdf.setFillColor(lightGrayRgb.r, lightGrayRgb.g, lightGrayRgb.b)
  }
  pdf.rect(margin, disclaimerY - 5, contentWidth, 22, 'F')
  
  setFontStyle(8, 'bold', darkGray)
  pdf.text('IMPORTANTE:', margin + 5, disclaimerY)
  
  setFontStyle(7, 'normal', mediumGray)
  const disclaimerText = [
    'Esta é uma simulação de financiamento e não representa um contrato ou compromisso formal.',
    'Os valores apresentados são estimativas e podem variar conforme análise de crédito e condições de mercado.',
    'Para efetivar o financiamento, entre em contato com nossos consultores.'
  ]
  
  disclaimerText.forEach((line, index) => {
    pdf.text(line, margin + 5, disclaimerY + 6 + (index * 3.5))
  })
  
  // Footer
  setFontStyle(7, 'normal', mediumGray)
  pdf.text(
    `Gerado em ${new Date().toLocaleString('pt-BR')} - Simulador de Financiamento`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  )
  
  return pdf
}

export const downloadProposalPDF = async (data: PDFData, filename?: string) => {
  try {
    const pdf = await generateProposalPDF(data)
    const defaultFilename = `proposta_financiamento_${Date.now()}.pdf`
    pdf.save(filename || defaultFilename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

export const getProposalPDFBlob = async (data: PDFData): Promise<Blob> => {
  const pdf = await generateProposalPDF(data)
  return pdf.output('blob')
}

export const openProposalPDFInNewTab = async (data: PDFData) => {
  try {
    const pdf = await generateProposalPDF(data)
    const pdfDataUri = pdf.output('datauristring')
    window.open(pdfDataUri, '_blank')
  } catch (error) {
    console.error('Error opening PDF:', error)
    throw error
  }
}