export const useContentAPI = () => {
  // URL base de tu worker desplegado
  const baseURL = 'https://bbdd.gadestotal.workers.dev'

  // Contenido por defecto (para fallback)
  const defaultContent = {
    hero: {
      name: "Ismael Bouaouda Ruiz",
      title: "Ingeniero Químico",
      description: "Especializado en procesos químicos industriales y optimización de sistemas"
    },
    about: {
      title: "Sobre mí",
      content_es: "Soy un ingeniero químico apasionado por la innovación y la mejora continua de procesos industriales. Mi experiencia se centra en el desarrollo y optimización de procesos químicos, con un fuerte énfasis en la sostenibilidad y la eficiencia energética.",
      content_en: "I am a chemical engineer passionate about innovation and continuous improvement of industrial processes. My experience focuses on the development and optimization of chemical processes, with a strong emphasis on sustainability and energy efficiency.",
      content: "Soy un ingeniero químico apasionado por la innovación y la mejora continua de procesos industriales. Mi experiencia se centra en el desarrollo y optimización de procesos químicos, con un fuerte énfasis en la sostenibilidad y la eficiencia energética."
    },
    experience: {
      title: "Experiencia Profesional",
      items: []
    },
    projects: {
      title: "Proyectos Destacados",
      items: []
    },
    contact: {
      title: "Contacto",
      description: "¿Interesado en colaborar? ¡Contáctame!",
      email: "tu@email.com",
      buttonText: "Enviar email"
    }
  }

  // Estado reactivo del contenido
  const content = ref(defaultContent)
  const isLoading = ref(false)
  const error = ref(null)

  // Obtener token de autenticación
  const getAuthToken = () => {
    if (process.client) {
      let token = localStorage.getItem('api-auth-token')
      
      // Si no hay token, crear uno con las credenciales por defecto
      if (!token) {
        token = btoa('admin:ismael2024')
        localStorage.setItem('api-auth-token', token)
      }
      
      return token
    }
    return null
  }

  // Cargar todo el contenido desde la API
  const loadContent = async (forceRefresh = false) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Agregar cache busting cuando se fuerza el refresh
      const cacheBuster = forceRefresh ? `?t=${Date.now()}` : ''
      const response = await fetch(`${baseURL}/content/all${cacheBuster}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar el contenido')
      }
      
      const data = await response.json()
      
      // Procesar y estructurar el contenido
      if (data) {
        const structuredContent = {
          hero: defaultContent.hero, // Hero section no cambia
          about: {
            title: data.about?.title || defaultContent.about.title,
            content_es: data.about?.content_es || data.about?.content || defaultContent.about.content_es,
            content_en: data.about?.content_en || defaultContent.about.content_en,
            content: data.about?.content || data.about?.content_es || defaultContent.about.content
          },
          experience: {
            title: defaultContent.experience.title,
            items: data.experience?.items || []
          },
          projects: {
            title: defaultContent.projects.title,
            items: data.projects?.items || []
          },
          contact: {
            title: defaultContent.contact.title,
            description: data.contact?.description || defaultContent.contact.description,
            email: data.contact?.email || defaultContent.contact.email,
            buttonText: data.contact?.buttonText || data.contact?.button_text || defaultContent.contact.buttonText
          }
        }
        
        content.value = structuredContent
        console.log('✅ Contenido cargado correctamente:', structuredContent)
      }
    } catch (err) {
      console.error('Error loading content:', err)
      error.value = err.message
      content.value = defaultContent
    } finally {
      isLoading.value = false
    }
  }

  // Guardar una sección específica de contenido
  const saveContentSection = async (section, data) => {
    isLoading.value = true
    error.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      // Determinar la URL y datos según la sección
      let url = `${baseURL}/admin/${section}`
      let requestData = data

      // Para experience y projects usar las rutas bulk
      if (section === 'experience') {
        url = `${baseURL}/admin/experience/bulk`
        requestData = { items: data.items }
      } else if (section === 'projects') {
        url = `${baseURL}/admin/projects/bulk`
        requestData = { items: data.items }
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error interno del servidor')
      }

      const result = await response.json()
      
      // Recargar todo el contenido desde la API después de guardar
      await loadContent(true) // Force refresh
      
      console.log('✅ Sección guardada correctamente:', section)
      return result
    } catch (err) {
      console.error(`Error saving ${section}:`, err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Cargar contenido al inicializar
  onMounted(() => {
    loadContent()
  })

  return {
    content: readonly(content),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadContent,
    saveContentSection
  }
}