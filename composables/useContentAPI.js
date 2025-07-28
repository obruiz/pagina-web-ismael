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
      return localStorage.getItem('api-auth-token')
    }
    return null
  }

  // Cargar todo el contenido desde la API
  const loadContent = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${baseURL}/content/all`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Combinar con contenido por defecto para asegurar que todas las propiedades existan
      content.value = {
        hero: defaultContent.hero, // Hero no se gestiona desde la API
        about: data.about || defaultContent.about,
        experience: data.experience || defaultContent.experience,
        projects: data.projects || defaultContent.projects,
        contact: data.contact || defaultContent.contact
      }
      
      console.log('Contenido cargado desde la API:', content.value)
    } catch (err) {
      console.error('Error cargando contenido:', err)
      error.value = err.message
      // Usar contenido por defecto en caso de error
      content.value = defaultContent
    } finally {
      isLoading.value = false
    }
  }

  // Guardar contenido específico
  const saveContentSection = async (section, newContent) => {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Token de autenticación requerido')
    }

    isLoading.value = true
    error.value = null

    try {
      let endpoint = ''
      let method = 'PUT'
      let body = {}

      // Determinar endpoint según la sección
      switch (section) {
        case 'about':
          endpoint = '/admin/about'
          body = newContent
          break
        
        case 'experience':
          endpoint = '/admin/experience/bulk'
          body = { items: newContent.items }
          break
        
        case 'projects':
          endpoint = '/admin/projects/bulk'
          body = { items: newContent.items }
          break
        
        case 'contact':
          endpoint = '/admin/contact'
          body = newContent
          break
        
        default:
          throw new Error(`Sección desconocida: ${section}`)
      }

      const response = await fetch(`${baseURL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      const result = await response.json()
      
      // Actualizar el contenido local
      content.value = { ...content.value, [section]: newContent }
      
      console.log(`${section} guardado exitosamente:`, result)
      return result
      
    } catch (err) {
      console.error(`Error guardando ${section}:`, err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Función compatible con el composable anterior
  const saveContent = (newContent) => {
    // Esta función mantiene compatibilidad con el código existente
    const promises = []
    
    if (newContent.about) {
      promises.push(saveContentSection('about', newContent.about))
    }
    if (newContent.experience) {
      promises.push(saveContentSection('experience', newContent.experience))
    }
    if (newContent.projects) {
      promises.push(saveContentSection('projects', newContent.projects))
    }
    if (newContent.contact) {
      promises.push(saveContentSection('contact', newContent.contact))
    }
    
    return Promise.all(promises)
  }

  // Cargar contenido al inicializar
  onMounted(() => {
    loadContent()
  })

  return {
    content: readonly(content),
    isLoading: readonly(isLoading),
    error: readonly(error),
    saveContent, // Mantiene compatibilidad
    saveContentSection, // Nueva función específica por sección
    loadContent,
    baseURL
  }
}