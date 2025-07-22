import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  doc,
  updateDoc
} from 'firebase/firestore'

export const useSimulations = () => {
  const { $firebase } = useNuxtApp()
  const { user } = useAuth()
  
  // Save a new simulation
  const saveSimulation = async (simulationData: any, signatureData?: string) => {
    if (!user.value) {
      throw new Error('User must be logged in to save simulation')
    }
    
    try {
      const docData = {
        ...simulationData,
        userId: user.value.uid,
        userEmail: user.value.email,
        userName: user.value.displayName || user.value.email?.split('@')[0],
        signatureData: signatureData || null,
        signed: !!signatureData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      const docRef = await addDoc(collection($firebase.db, 'simulations'), docData)
      
      return { success: true, id: docRef.id }
    } catch (error: any) {
      console.error('Error saving simulation:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Get all simulations (admin only)
  const getAllSimulations = async () => {
    try {
      const q = query(
        collection($firebase.db, 'simulations'),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const simulations: any[] = []
      
      querySnapshot.forEach((doc) => {
        simulations.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })
      })
      
      return simulations
    } catch (error) {
      console.error('Error fetching simulations:', error)
      return []
    }
  }
  
  // Get user's simulations
  const getUserSimulations = async () => {
    if (!user.value) return []
    
    try {
      const q = query(
        collection($firebase.db, 'simulations'),
        where('userId', '==', user.value.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      )
      
      const querySnapshot = await getDocs(q)
      const simulations: any[] = []
      
      querySnapshot.forEach((doc) => {
        simulations.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })
      })
      
      return simulations
    } catch (error) {
      console.error('Error fetching user simulations:', error)
      return []
    }
  }
  
  // Update simulation with signature
  const updateSimulationSignature = async (simulationId: string, signatureData: string) => {
    try {
      const simRef = doc($firebase.db, 'simulations', simulationId)
      await updateDoc(simRef, {
        signatureData,
        signed: true,
        signedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      
      return { success: true }
    } catch (error: any) {
      console.error('Error updating simulation:', error)
      return { success: false, error: error.message }
    }
  }
  
  return {
    saveSimulation,
    getAllSimulations,
    getUserSimulations,
    updateSimulationSignature
  }
}