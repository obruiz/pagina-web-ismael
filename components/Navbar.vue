<template>
  <nav class="fixed w-full bg-secondary/95 backdrop-blur-sm z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-white font-bold text-xl">IBR</NuxtLink>
        </div>
        
        <!-- Desktop Menu -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <NuxtLink to="/" class="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Inicio</NuxtLink>
            <NuxtLink to="#about" class="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Sobre mí</NuxtLink>
            <NuxtLink to="#experience" class="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Experiencia</NuxtLink>
            <NuxtLink to="#projects" class="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Proyectos</NuxtLink>
            <NuxtLink to="#contact" class="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Contacto</NuxtLink>
            <a 
              href="/cv.pdf" 
              target="_blank"
              class="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Descargar CV
            </a>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="isOpen = !isOpen" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            <span class="sr-only">Abrir menú principal</span>
            <!-- Icon when menu is closed -->
            <svg 
              v-if="!isOpen"
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Icon when menu is open -->
            <svg 
              v-else
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div 
      v-show="isOpen" 
      class="md:hidden"
    >
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <NuxtLink 
          to="/" 
          class="text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
          @click="isOpen = false"
        >
          Inicio
        </NuxtLink>
        <NuxtLink 
          to="#about" 
          class="text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
          @click="isOpen = false"
        >
          Sobre mí
        </NuxtLink>
        <NuxtLink 
          to="#experience" 
          class="text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
          @click="isOpen = false"
        >
          Experiencia
        </NuxtLink>
        <NuxtLink 
          to="#projects" 
          class="text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
          @click="isOpen = false"
        >
          Proyectos
        </NuxtLink>
        <NuxtLink 
          to="#contact" 
          class="text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
          @click="isOpen = false"
        >
          Contacto
        </NuxtLink>
        <a 
          href="/cv.pdf" 
          target="_blank"
          class="bg-primary text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/90 transition-colors"
        >
          Descargar CV
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()
const isOpen = ref(false)

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav')
    if (nav && !nav.contains(e.target)) {
      isOpen.value = false
    }
  })
})

// Close menu when route changes
watch(() => route.fullPath, () => {
  isOpen.value = false
})
</script>