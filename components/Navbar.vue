<template>
  <nav class="fixed w-full bg-secondary/95 backdrop-blur-sm z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-white font-bold text-xl">IBR</NuxtLink>
        </div>
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
      </div>
    </div>
  </nav>
</template>