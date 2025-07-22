<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('close')"
        ></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="isOpen" class="relative w-full max-w-md">
              <!-- Modal Content -->
              <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xl font-semibold text-white">
                      {{ isSignUp ? 'Criar Conta' : 'Entrar' }}
                    </h3>
                    <button
                      @click="$emit('close')"
                      class="text-white/80 hover:text-white transition-colors"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Body -->
                <div class="p-6">
                  <!-- Error Message -->
                  <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-sm text-red-800">{{ errorMessage }}</p>
                  </div>
                  
                  <!-- Google Sign In -->
                  <button
                    @click="handleGoogleSignIn"
                    :disabled="isLoading"
                    class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continuar com Google</span>
                  </button>
                  
                  <div class="my-4 flex items-center">
                    <div class="flex-1 border-t border-gray-300"></div>
                    <span class="px-4 text-sm text-gray-500">ou</span>
                    <div class="flex-1 border-t border-gray-300"></div>
                  </div>
                  
                  <!-- Email/Password Form -->
                  <form @submit.prevent="handleEmailAuth" class="space-y-4">
                    <!-- Name Field (Sign Up only) -->
                    <div v-if="isSignUp">
                      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <input
                        id="name"
                        v-model="formData.name"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Seu nome"
                      />
                    </div>
                    
                    <!-- Email Field -->
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        v-model="formData.email"
                        type="email"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="seu@email.com"
                      />
                    </div>
                    
                    <!-- Password Field -->
                    <div>
                      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                        Senha
                      </label>
                      <input
                        id="password"
                        v-model="formData.password"
                        type="password"
                        required
                        :minlength="isSignUp ? 6 : undefined"
                        class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        :placeholder="isSignUp ? 'Mínimo 6 caracteres' : 'Sua senha'"
                      />
                    </div>
                    
                    <!-- Submit Button -->
                    <button
                      type="submit"
                      :disabled="isLoading"
                      class="w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="!isLoading">{{ isSignUp ? 'Criar Conta' : 'Entrar' }}</span>
                      <span v-else class="flex items-center justify-center">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    </button>
                  </form>
                  
                  <!-- Toggle Sign Up/Sign In -->
                  <p class="mt-4 text-center text-sm text-gray-600">
                    {{ isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?' }}
                    <button
                      @click="toggleMode"
                      class="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {{ isSignUp ? 'Entrar' : 'Criar conta' }}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  isOpen: boolean
  requireAdmin?: boolean
}>()

const emit = defineEmits<{
  close: []
  'login-success': []
}>()

const { signInWithEmail, signUpWithEmail, signInWithGoogle, isAdmin } = useAuth()

const isSignUp = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const formData = ref({
  name: '',
  email: '',
  password: ''
})

const handleEmailAuth = async () => {
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    let result
    
    if (isSignUp.value) {
      result = await signUpWithEmail(formData.value.email, formData.value.password, formData.value.name)
    } else {
      result = await signInWithEmail(formData.value.email, formData.value.password)
    }
    
    if (result.success) {
      // Check admin requirement
      if (props.requireAdmin && !isAdmin.value) {
        errorMessage.value = 'Acesso negado. Apenas administradores podem acessar esta área.'
        await logout()
        return
      }
      
      emit('login-success')
      emit('close')
      resetForm()
    } else {
      errorMessage.value = getErrorMessage(result.error)
    }
  } finally {
    isLoading.value = false
  }
}

const handleGoogleSignIn = async () => {
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    const result = await signInWithGoogle()
    
    if (result.success) {
      // Check admin requirement
      if (props.requireAdmin && !isAdmin.value) {
        errorMessage.value = 'Acesso negado. Apenas administradores podem acessar esta área.'
        await logout()
        return
      }
      
      emit('login-success')
      emit('close')
      resetForm()
    } else {
      errorMessage.value = getErrorMessage(result.error)
    }
  } finally {
    isLoading.value = false
  }
}

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  errorMessage.value = ''
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    password: ''
  }
}

const getErrorMessage = (error: string) => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'Este email já está cadastrado.',
    'auth/invalid-email': 'Email inválido.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'Email ou senha incorretos.',
    'auth/popup-closed-by-user': 'Login cancelado.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.'
  }
  
  return errorMessages[error] || 'Ocorreu um erro. Tente novamente.'
}
</script>