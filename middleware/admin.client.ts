export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, isAdmin, loading, initAuth } = useAuth()
  
  // Wait for auth to initialize if still loading
  if (loading.value) {
    await initAuth()
  }
  
  // If not logged in, redirect to home
  if (!user.value) {
    return navigateTo('/')
  }
  
  // If logged in but not admin, redirect to home
  if (!isAdmin.value) {
    return navigateTo('/')
  }
  
  // User is admin, allow access
})