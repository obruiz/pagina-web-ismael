export const useAuthAPI = () => {
  // URL base de tu worker desplegado
  const baseURL = 'https://bbdd.gadestotal.workers.dev'

  // Estado de autenticación
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  const user = ref(null)

  // Verificar si está autenticado al cargar
  const checkAuth = () => {
    if (process.client) {
      const token = localStorage.getItem('api-auth-token')
      const userData = localStorage.getItem('api-user-data')
      
      if (token && userData) {
        try {
          user.value = JSON.parse(userData)
          isAuthenticated.value = true
        } catch (err) {
          // Token o datos corruptos, limpiar
          logout()
        }
      } else {
        isAuthenticated.value = false
      }
    }
  }

  // Función de login con API
  const loginAPI = async (username, password) => {
    isLoading.value = true
    error.value = null
    
    console.log('Intentando login con API:', { username })
    
    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación')
      }

      if (data.success && data.token) {
        // Guardar token y datos del usuario
        if (process.client) {
          localStorage.setItem('api-auth-token', data.token)
          localStorage.setItem('api-user-data', JSON.stringify({ username }))
        }
        
        user.value = { username }
        isAuthenticated.value = true
        
        console.log('Login exitoso con API')
        return { success: true, message: data.message }
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
      
    } catch (err) {
      console.error('Error en login API:', err)
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      isLoading.value = false
    }
  }

  // Función de login compatible con el composable anterior (para transición)
  const login = (username, password) => {
    // Mantiene compatibilidad con el código existente que espera respuesta síncrona
    const ADMIN_USERNAME = 'admin'
    const ADMIN_PASSWORD = 'ismael2024'
    
    const usernameClean = username.trim()
    const passwordClean = password.trim()
    
    if (usernameClean === ADMIN_USERNAME && passwordClean === ADMIN_PASSWORD) {
      // Realizar login con API de forma asíncrona pero devolver respuesta inmediata
      loginAPI(username, password).catch(err => {
        console.error('Error en login API (modo legacy):', err)
      })
      
      return { success: true, message: 'Login exitoso' }
    } else {
      return { success: false, message: 'Credenciales incorrectas' }
    }
  }

  // Función de logout
  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    error.value = null
    
    if (process.client) {
      localStorage.removeItem('api-auth-token')
      localStorage.removeItem('api-user-data')
      // Mantener compatibilidad con el sistema anterior
      localStorage.removeItem('admin-auth')
    }
  }

  // Obtener token actual
  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('api-auth-token')
    }
    return null
  }

  // Verificar autenticación al inicializar
  onMounted(() => {
    checkAuth()
  })

  return {
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    user: readonly(user),
    login, // Función legacy para compatibilidad
    loginAPI, // Nueva función que devuelve Promise
    logout,
    checkAuth,
    getToken,
    baseURL
  }
}