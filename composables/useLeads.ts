import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore'

interface LeadData {
  fullName: string
  phone: string
  cpf: string
  email?: string
  createdAt?: any
  updatedAt?: any
}

export const useLeads = () => {
  const { $firebase } = useNuxtApp()
  const { user } = useAuth()
  
  // Save or update lead data
  const saveLeadData = async (data: LeadData) => {
    if (!user.value) {
      throw new Error('User must be logged in to save lead data')
    }
    
    try {
      const leadRef = doc($firebase.db, 'leads', user.value.uid)
      const leadDoc = await getDoc(leadRef)
      
      if (leadDoc.exists()) {
        // Update existing lead
        await updateDoc(leadRef, {
          ...data,
          email: user.value.email,
          updatedAt: Timestamp.now()
        })
      } else {
        // Create new lead
        await setDoc(leadRef, {
          ...data,
          userId: user.value.uid,
          email: user.value.email,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        })
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('Error saving lead data:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Get user's lead data
  const getUserLeadData = async (): Promise<LeadData | null> => {
    if (!user.value) return null
    
    try {
      const leadRef = doc($firebase.db, 'leads', user.value.uid)
      const leadDoc = await getDoc(leadRef)
      
      if (leadDoc.exists()) {
        return leadDoc.data() as LeadData
      }
      
      return null
    } catch (error) {
      console.error('Error fetching lead data:', error)
      return null
    }
  }
  
  // Check if user has complete lead data
  const hasCompleteLeadData = async (): Promise<boolean> => {
    const leadData = await getUserLeadData()
    
    if (!leadData) return false
    
    return !!(leadData.fullName && leadData.phone && leadData.cpf)
  }
  
  return {
    saveLeadData,
    getUserLeadData,
    hasCompleteLeadData
  }
}