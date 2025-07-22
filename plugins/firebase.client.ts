import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyCk5oXd7qqcS7UgYWVzJ-68QcOc-tWj9Lg",
    authDomain: "teste-finan-58853.firebaseapp.com",
    projectId: "teste-finan-58853",
    storageBucket: "teste-finan-58853.firebasestorage.app",
    messagingSenderId: "416363689379",
    appId: "1:416363689379:web:dcdb49511a962ed85ed616",
    measurementId: "G-J9X9CM235M"
  }

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app)

  return {
    provide: {
      firebase: {
        app,
        auth,
        db,
        storage
      }
    }
  }
})