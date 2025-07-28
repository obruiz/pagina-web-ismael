export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente
  if (process.client) {
    const authStatus = localStorage.getItem('admin-auth')
    
    // Si no hay auth o no es 'true', redirigir al login
    if (authStatus !== 'true') {
      return navigateTo('/admin/login')
    }
  }
}) 