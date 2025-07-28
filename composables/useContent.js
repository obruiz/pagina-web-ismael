export const useContent = () => {
  // Contenido por defecto
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
      items: [
        {
          id: 1,
          position: "Ingeniero de Procesos",
          company: "Empresa Química S.A.",
          period: "2020 - Presente",
          description: "Desarrollo y optimización de procesos químicos industriales. Implementación de mejoras en eficiencia energética. Gestión de equipos y proyectos de innovación."
        }
      ]
    },
    projects: {
      title: "Proyectos Destacados",
      items: [
        {
          id: 1,
          title: "Optimización de Planta Química",
          description: "Proyecto de mejora de eficiencia energética que resultó en una reducción del 30% en el consumo de energía."
        }
      ]
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

  // Cargar contenido desde localStorage
  const loadContent = () => {
    if (process.client) {
      const savedContent = localStorage.getItem('admin-content')
      if (savedContent) {
        try {
          content.value = JSON.parse(savedContent)
        } catch (error) {
          console.error('Error al cargar contenido:', error)
          content.value = defaultContent
        }
      }
    }
  }

  // Guardar contenido en localStorage
  const saveContent = (newContent) => {
    if (process.client) {
      content.value = { ...content.value, ...newContent }
      localStorage.setItem('admin-content', JSON.stringify(content.value))
    }
  }

  // Cargar contenido al inicializar
  onMounted(() => {
    loadContent()
  })

  return {
    content: readonly(content),
    saveContent,
    loadContent
  }
}