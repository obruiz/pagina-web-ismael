<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Panel de Administrador
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Inicia sesión para gestionar el contenido
        </p>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Usuario</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Usuario"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">Iniciando sesión...</span>
            <span v-else>Iniciar sesión</span>
          </button>
        </div>
      </form>
      
      <div class="text-center">
        <NuxtLink 
          to="/" 
          class="text-indigo-600 hover:text-indigo-500 text-sm"
        >
          ← Volver al sitio web
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const { login, isAuthenticated } = useAuth()

const form = ref({
  username: '',
  password: ''
})

const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  console.log('Formulario enviado:', form.value)
  
  try {
    const result = login(form.value.username, form.value.password)
    console.log('Resultado del login:', result)
    
    if (result && result.success) {
      console.log('Redirigiendo al dashboard')
      await navigateTo('/admin/dashboard')
    } else {
      error.value = result ? result.message : 'Error en la autenticación'
      console.log('Error de login:', error.value)
    }
  } catch (err) {
    console.error('Error en handleLogin:', err)
    error.value = 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

// Redireccionar si ya está autenticado
onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/admin/dashboard')
  }
})
</script> 