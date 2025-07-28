export const useAuth = () => {
  // Credenciales hardcodeadas - EXACTAS
  const ADMIN_USERNAME = 'admin'
  const ADMIN_PASSWORD = 'ismael2024'

  // Estado de autenticación
  const isAuthenticated = ref(false)

  // Verificar si está autenticado al cargar
  const checkAuth = () => {
    if (process.client) {
      const authStatus = localStorage.getItem('admin-auth')
      isAuthenticated.value = authStatus === 'true'
    }
  }

  // Función de login
  const login = (username, password) => {
    console.log('Intentando login con:', { username, password })
    console.log('Credenciales esperadas:', { username: ADMIN_USERNAME, password: ADMIN_PASSWORD })
    
    // Comparación exacta sin espacios
    const usernameClean = username.trim()
    const passwordClean = password.trim()
    
    if (usernameClean === ADMIN_USERNAME && passwordClean === ADMIN_PASSWORD) {
      isAuthenticated.value = true
      if (process.client) {
        localStorage.setItem('admin-auth', 'true')
      }
      console.log('Login exitoso')
      return { success: true, message: 'Login exitoso' }
    } else {
      console.log('Login fallido')
      return { success: false, message: 'Credenciales incorrectas' }
    }
  }

  // Función de logout
  const logout = () => {
    isAuthenticated.value = false
    if (process.client) {
      localStorage.removeItem('admin-auth')
    }
  }

  // Verificar autenticación al inicializar
  onMounted(() => {
    checkAuth()
  })

  return {
    isAuthenticated: readonly(isAuthenticated),
    login,
    logout,
    checkAuth
  }
}