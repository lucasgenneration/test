<template>
  <div class="min-h-screen bg-gray-50">
    <!-- iOS Style Navigation -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 class="text-xl font-semibold text-gray-900">Simulador de Financiamento</h1>
          </div>
          
          <div class="flex items-center space-x-2">
            <!-- Navigation Links -->
            <div class="flex items-center space-x-1 mr-2">
              <NuxtLink
                to="/"
                class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                :class="$route.path === '/' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'"
              >
                Simulação
              </NuxtLink>
              <NuxtLink
                v-if="isAdmin"
                to="/admin"
                class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                :class="$route.path === '/admin' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'"
              >
                Admin
              </NuxtLink>
            </div>
            
            <!-- Auth Button -->
            <div class="border-l border-gray-200 pl-2">
              <button
                v-if="!user"
                @click="openLoginModal"
                class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Entrar</span>
              </button>
              
              <div v-else class="flex items-center space-x-2">
                <div class="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-xl">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {{ userInitials }}
                  </div>
                  <span class="text-sm text-gray-700 font-medium max-w-[120px] truncate">
                    {{ userName }}
                  </span>
                </div>
                <button
                  @click="handleLogout"
                  class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  title="Sair"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    
    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- iOS Style Footer -->
    <footer class="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-gray-500 text-sm">
          © 2024 Simulador de Financiamento
        </p>
      </div>
    </footer>
    
    <!-- Login Modal -->
    <LoginModal
      :is-open="isLoginModalOpen"
      @close="closeLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LoginModal from '~/components/LoginModal.vue'

const { user, isAdmin, initAuth, logout } = useAuth()
const isLoginModalOpen = ref(false)

// Initialize auth on mount
onMounted(async () => {
  await initAuth()
})

const userName = computed(() => {
  if (!user.value) return ''
  return user.value.displayName || user.value.email?.split('@')[0] || 'Usuário'
})

const userInitials = computed(() => {
  const name = userName.value
  if (!name) return ''
  
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const openLoginModal = () => {
  isLoginModalOpen.value = true
}

const closeLoginModal = () => {
  isLoginModalOpen.value = false
}

const handleLoginSuccess = () => {
  // Additional actions after successful login if needed
}

const handleLogout = async () => {
  const confirmed = confirm('Deseja realmente sair?')
  if (confirmed) {
    await logout()
  }
}
</script>

<style scoped>
/* iOS-style transitions and animations */
@media (prefers-reduced-motion: no-preference) {
  header {
    animation: slideDown 0.3s ease-out;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>