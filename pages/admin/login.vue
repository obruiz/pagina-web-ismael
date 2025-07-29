<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ t('adminPanel') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ t('loginToManage') }}
        </p>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">{{ t('username') }}</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :placeholder="t('username')"
            />
          </div>
          <div>
            <label for="password" class="sr-only">{{ t('password') }}</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :placeholder="t('password')"
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
            <span v-if="loading">{{ t('loggingIn') }}</span>
            <span v-else>{{ t('login') }}</span>
          </button>
        </div>
      </form>
      
      <div class="text-center">
        <NuxtLink 
          to="/" 
          class="text-indigo-600 hover:text-indigo-500 text-sm"
        >
          ← {{ t('backToWebsite') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '~/composables/useI18n'

definePageMeta({
  layout: false
})

// Usar el sistema de internacionalización
const { t } = useI18n()

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
  
  try {
    // Login simple y directo
    const { username, password } = form.value
    
    if (username === 'admin' && password === 'ismael2024') {
      // Login exitoso - crear todos los tokens necesarios
      if (process.client) {
        localStorage.setItem('admin-auth', 'true')
        localStorage.setItem('api-auth-token', btoa('admin:ismael2024'))
        localStorage.setItem('api-user-data', JSON.stringify({ username: 'admin' }))
      }
      
      // Redirigir al dashboard
      await navigateTo('/admin/dashboard')
    } else {
      error.value = t('invalidCredentials')
    }
  } catch (err) {
    error.value = t('loginError')
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