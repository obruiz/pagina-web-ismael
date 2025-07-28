<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
              Panel de Administrador
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink 
              to="/" 
              target="_blank"
              class="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Ver sitio web
            </NuxtLink>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Navegación de pestañas -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Contenido de las pestañas -->
      <div class="mt-6">
        <!-- Pestaña Sobre mí -->
        <div v-show="activeTab === 'about'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Editar Sobre mí</h3>
            <form @submit.prevent="saveAbout">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                  <input
                    v-model="editForms.about.title"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contenido</label>
                  <textarea
                    v-model="editForms.about.content"
                    rows="6"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Pestaña Experiencia -->
        <div v-show="activeTab === 'experience'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Editar Experiencia Profesional</h3>
            
            <!-- Experiencias existentes -->
            <div v-for="(item, index) in editForms.experience.items" :key="item.id" class="border rounded-lg p-4 mb-4">
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cargo</label>
                    <input
                      v-model="item.position"
                      type="text"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Empresa</label>
                    <input
                      v-model="item.company"
                      type="text"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Período</label>
                  <input
                    v-model="item.period"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                  <textarea
                    v-model="item.description"
                    rows="3"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                <button
                  @click="removeExperience(index)"
                  type="button"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            
            <div class="flex space-x-4">
              <button
                @click="addExperience"
                type="button"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Agregar experiencia
              </button>
              <button
                @click="saveExperience"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>

        <!-- Pestaña Proyectos -->
        <div v-show="activeTab === 'projects'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Editar Proyectos Destacados</h3>
            
            <!-- Proyectos existentes -->
            <div v-for="(item, index) in editForms.projects.items" :key="item.id" class="border rounded-lg p-4 mb-4">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                  <input
                    v-model="item.title"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                  <textarea
                    v-model="item.description"
                    rows="3"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                <button
                  @click="removeProject(index)"
                  type="button"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            
            <div class="flex space-x-4">
              <button
                @click="addProject"
                type="button"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Agregar proyecto
              </button>
              <button
                @click="saveProjects"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>

        <!-- Pestaña Contacto -->
        <div v-show="activeTab === 'contact'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Editar Contacto</h3>
            <form @submit.prevent="saveContact">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                  <input
                    v-model="editForms.contact.title"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                  <textarea
                    v-model="editForms.contact.description"
                    rows="3"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    v-model="editForms.contact.email"
                    type="email"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Texto del botón</label>
                  <input
                    v-model="editForms.contact.buttonText"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de éxito -->
    <div
      v-if="showSuccess"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg"
    >
      ¡Cambios guardados en la base de datos!
    </div>
    
    <!-- Mensaje de error -->
    <div
      v-if="showError"
      class="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-md shadow-lg"
    >
      {{ errorMessage }}
    </div>
    
    <!-- Overlay de carga -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span class="text-gray-900 dark:text-white">Guardando en base de datos...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: 'auth'
})

// Verificación de autenticación manual
onMounted(() => {
  if (process.client) {
    const authStatus = localStorage.getItem('admin-auth')
    if (authStatus !== 'true') {
      navigateTo('/admin/login')
    } else {
      // Asegurar que el token de API esté disponible
      let apiToken = localStorage.getItem('api-auth-token')
      if (!apiToken) {
        apiToken = btoa('admin:ismael2024')
        localStorage.setItem('api-auth-token', apiToken)
      }
    }
  }
})

const { logout } = useAuth()
const { content, saveContentSection, isLoading, error } = useContentAPI()

const activeTab = ref('about')
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const tabs = [
  { id: 'about', name: 'Sobre mí' },
  { id: 'experience', name: 'Experiencia' },
  { id: 'projects', name: 'Proyectos' },
  { id: 'contact', name: 'Contacto' }
]

// Formularios de edición
const editForms = ref({
  about: {
    title: '',
    content: ''
  },
  experience: {
    title: 'Experiencia Profesional',
    items: []
  },
  projects: {
    title: 'Proyectos Destacados',
    items: []
  },
  contact: {
    title: '',
    description: '',
    email: '',
    buttonText: ''
  }
})

// Función para cargar datos desde la API
const loadData = () => {
  // Cargar datos desde la API (content viene de useContentAPI)
  if (content.value) {
    editForms.value.about = { 
      title: content.value.about?.title || '',
      content: content.value.about?.content || ''
    }
    editForms.value.experience = { 
      title: 'Experiencia Profesional',
      items: content.value.experience?.items ? [...content.value.experience.items] : []
    }
    editForms.value.projects = { 
      title: 'Proyectos Destacados',
      items: content.value.projects?.items ? [...content.value.projects.items] : []
    }
    editForms.value.contact = { 
      title: content.value.contact?.title || '',
      description: content.value.contact?.description || '',
      email: content.value.contact?.email || '',
      buttonText: content.value.contact?.buttonText || ''
    }
  }
}

// Cargar datos al montar
onMounted(() => {
  loadData()
})

// Watcher para cargar datos cuando cambie el contenido
watch(content, (newContent) => {
  if (newContent) {
    loadData()
  }
}, { immediate: true, deep: true })

// Funciones de guardado en backend
const saveAbout = async () => {
  try {
    await saveContentSection('about', editForms.value.about)
    showSuccessMessage()
  } catch (err) {
    console.error('Error guardando about:', err)
    showErrorMessage('Error al guardar la información. Verifica tu conexión.')
  }
}

const saveExperience = async () => {
  try {
    await saveContentSection('experience', editForms.value.experience)
    showSuccessMessage()
  } catch (err) {
    console.error('Error guardando experience:', err)
    showErrorMessage('Error al guardar la experiencia. Verifica tu conexión.')
  }
}

const saveProjects = async () => {
  try {
    await saveContentSection('projects', editForms.value.projects)
    showSuccessMessage()
  } catch (err) {
    console.error('Error guardando projects:', err)
    showErrorMessage('Error al guardar los proyectos. Verifica tu conexión.')
  }
}

const saveContact = async () => {
  try {
    await saveContentSection('contact', editForms.value.contact)
    showSuccessMessage()
  } catch (err) {
    console.error('Error guardando contact:', err)
    showErrorMessage('Error al guardar la información de contacto. Verifica tu conexión.')
  }
}

// Funciones para experiencia
const addExperience = () => {
  const ids = editForms.value.experience.items.map(item => item.id)
  const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
  editForms.value.experience.items.push({
    id: newId,
    position: '',
    company: '',
    period: '',
    description: ''
  })
}

const removeExperience = (index) => {
  editForms.value.experience.items.splice(index, 1)
}

// Funciones para proyectos
const addProject = () => {
  const ids = editForms.value.projects.items.map(item => item.id)
  const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
  editForms.value.projects.items.push({
    id: newId,
    title: '',
    description: ''
  })
}

const removeProject = (index) => {
  editForms.value.projects.items.splice(index, 1)
}

// Mostrar mensaje de éxito
const showSuccessMessage = () => {
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

// Mostrar mensaje de error
const showErrorMessage = (message) => {
  errorMessage.value = message
  showError.value = true
  setTimeout(() => {
    showError.value = false
  }, 5000)
}

// Cerrar sesión
const handleLogout = () => {
  logout()
  navigateTo('/admin/login')
}
</script> 