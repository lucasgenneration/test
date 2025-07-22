import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useAuth = () => {
  const { $firebase } = useNuxtApp()
  const user = useState<User | null>('auth.user', () => null)
  const isAdmin = useState<boolean>('auth.isAdmin', () => false)
  const loading = useState<boolean>('auth.loading', () => true)

  // Check if user is admin
  const checkAdminRole = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc($firebase.db, 'users', uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        return userData.role === 'admin'
      }
      return false
    } catch (error) {
      console.error('Error checking admin role:', error)
      return false
    }
  }

  // Initialize auth state listener
  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged($firebase.auth, async (firebaseUser) => {
        loading.value = true
        
        if (firebaseUser) {
          user.value = firebaseUser
          isAdmin.value = await checkAdminRole(firebaseUser.uid)
        } else {
          user.value = null
          isAdmin.value = false
        }
        
        loading.value = false
        resolve(user.value)
      })
    })
  }

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword($firebase.auth, email, password)
      user.value = result.user
      isAdmin.value = await checkAdminRole(result.user.uid)
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword($firebase.auth, email, password)
      
      // Create user document in Firestore
      await setDoc(doc($firebase.db, 'users', result.user.uid), {
        email: result.user.email,
        name: name,
        role: 'user',
        createdAt: new Date()
      })
      
      user.value = result.user
      isAdmin.value = false
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup($firebase.auth, provider)
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc($firebase.db, 'users', result.user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc($firebase.db, 'users', result.user.uid), {
          email: result.user.email,
          name: result.user.displayName,
          role: 'user',
          createdAt: new Date()
        })
      }
      
      user.value = result.user
      isAdmin.value = await checkAdminRole(result.user.uid)
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Sign out
  const logout = async () => {
    try {
      await signOut($firebase.auth)
      user.value = null
      isAdmin.value = false
      await navigateTo('/')
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    user: readonly(user),
    isAdmin: readonly(isAdmin),
    loading: readonly(loading),
    initAuth,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout
  }
}