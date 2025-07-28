<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-bold mb-4">Prueba de Login</h2>
      
      <form @submit.prevent="testLogin">
        <div class="space-y-4">
          <input
            v-model="username"
            type="text"
            placeholder="Usuario"
            class="w-full p-2 border rounded"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Contraseña"
            class="w-full p-2 border rounded"
          />
          <button
            type="submit"
            class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Probar Login
          </button>
        </div>
      </form>
      
      <div v-if="result" class="mt-4 p-2 rounded" :class="result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ result.message }}
      </div>
      
      <div class="mt-4 text-sm text-gray-600">
        <strong>Credenciales correctas:</strong><br>
        Usuario: admin<br>
        Contraseña: ismael2024
      </div>
      
      <div class="mt-4">
        <NuxtLink to="/admin/login" class="text-blue-600 hover:underline">
          ← Ir al login real
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: 'auth'
})

const { login } = useAuth()

const username = ref('')
const password = ref('')
const result = ref(null)

const testLogin = () => {
  console.log('Probando login con:', { username: username.value, password: password.value })
  
  const loginResult = login(username.value, password.value)
  result.value = loginResult
  
  console.log('Resultado:', loginResult)
}
</script> 