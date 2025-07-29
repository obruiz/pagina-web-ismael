import { ref, readonly, onMounted, computed, toRef } from 'vue'

export const useI18n = () => {
  // Traducciones para los elementos de interfaz
  const translations = {
    es: {
      // Navbar
      home: 'Inicio',
      about: 'Sobre mí',
      experience: 'Experiencia',
      projects: 'Proyectos',
      contact: 'Contacto',
      downloadCV: 'Descargar CV',
      openMainMenu: 'Abrir menú principal',
      
      // Footer
      allRightsReserved: 'Todos los derechos reservados',
      
      // Admin Login
      adminPanel: 'Panel de Administrador',
      loginToManage: 'Inicia sesión para gestionar el contenido',
      username: 'Usuario',
      password: 'Contraseña',
      loggingIn: 'Iniciando sesión...',
      login: 'Iniciar sesión',
      backToWebsite: 'Volver al sitio web',
      invalidCredentials: 'Credenciales incorrectas',
      loginError: 'Error al iniciar sesión',
      
      // Admin Dashboard
      adminDashboard: 'Panel de Administrador',
      viewWebsite: 'Ver sitio web',
      logout: 'Cerrar sesión',
      editAbout: 'Editar Sobre mí',
      editProfessionalExperience: 'Editar Experiencia Profesional',
      editFeaturedProjects: 'Editar Proyectos Destacados',
      editContact: 'Editar Contacto',
      title: 'Título',
      content: 'Contenido',
      saveChanges: 'Guardar cambios',
      position: 'Cargo',
      company: 'Empresa',
      period: 'Período',
      description: 'Descripción',
      remove: 'Eliminar',
      addExperience: 'Agregar experiencia',
      addProject: 'Agregar proyecto',
      email: 'Email',
      buttonText: 'Texto del botón',
      changesSaved: '¡Cambios guardados en la base de datos!',
      savingToDatabase: 'Guardando en base de datos...',
      
      // Language
      language: 'Idioma',
      spanish: 'Español',
      english: 'English'
    },
    en: {
      // Navbar
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      contact: 'Contact',
      downloadCV: 'Download CV',
      openMainMenu: 'Open main menu',
      
      // Footer
      allRightsReserved: 'All rights reserved',
      
      // Admin Login
      adminPanel: 'Admin Panel',
      loginToManage: 'Log in to manage content',
      username: 'Username',
      password: 'Password',
      loggingIn: 'Logging in...',
      login: 'Log in',
      backToWebsite: 'Back to website',
      invalidCredentials: 'Invalid credentials',
      loginError: 'Login error',
      
      // Admin Dashboard
      adminDashboard: 'Admin Dashboard',
      viewWebsite: 'View website',
      logout: 'Log out',
      editAbout: 'Edit About',
      editProfessionalExperience: 'Edit Professional Experience',
      editFeaturedProjects: 'Edit Featured Projects',
      editContact: 'Edit Contact',
      title: 'Title',
      content: 'Content',
      saveChanges: 'Save changes',
      position: 'Position',
      company: 'Company',
      period: 'Period',
      description: 'Description',
      remove: 'Remove',
      addExperience: 'Add experience',
      addProject: 'Add project',
      email: 'Email',
      buttonText: 'Button text',
      changesSaved: 'Changes saved to database!',
      savingToDatabase: 'Saving to database...',
      
      // Language
      language: 'Language',
      spanish: 'Español',
      english: 'English'
    }
  }

  // Estado reactivo del idioma actual
  const currentLocale = ref('es')

  // Función para obtener una traducción (reactiva)
  const t = (key) => {
    return translations[currentLocale.value]?.[key] || key
  }

  // Traducciones actuales como computed reactivo
  const currentTranslations = computed(() => {
    console.log('🔄 Recalculando currentTranslations para idioma:', currentLocale.value)
    return translations[currentLocale.value] || {}
  })

  // Función para cambiar el idioma
  const setLocale = (locale) => {
    if (translations[locale]) {
      currentLocale.value = locale
      // Guardar preferencia en localStorage
            if (process.client) {
        localStorage.setItem('preferred-locale', locale)
      }
      console.log('🌐 Idioma cambiado a:', locale)
    }
  }

  // Cargar idioma guardado al inicializar
  const loadSavedLocale = () => {
    if (process.client) {
      const saved = localStorage.getItem('preferred-locale')
      if (saved && translations[saved]) {
        currentLocale.value = saved
      }
    }
  }

  // Función para alternar entre idiomas
  const toggleLocale = () => {
    const newLocale = currentLocale.value === 'es' ? 'en' : 'es'
    setLocale(newLocale)
  }

  // Cargar idioma guardado al montar
  onMounted(() => {
    loadSavedLocale()
  })

  return {
    currentLocale,
    currentTranslations,
    t,
    setLocale,
    toggleLocale,
    loadSavedLocale
  }
}
