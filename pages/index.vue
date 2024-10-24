<template>
  <div>
    <!-- Hero Section -->
    <section class="pt-32 pb-16 bg-secondary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span class="block">Ismael Bouaouda Ruiz</span>
            <span class="block text-primary mt-3">Ingeniero Químico</span>
          </h1>
          <p class="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Especializado en procesos químicos industriales y optimización de sistemas
          </p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Sobre mí</h2>
        <div class="prose dark:prose-invert max-w-none">
          <p class="text-gray-600 dark:text-gray-300">
            Soy un ingeniero químico apasionado por la innovación y la mejora continua de procesos industriales.
            Mi experiencia se centra en el desarrollo y optimización de procesos químicos, con un fuerte énfasis
            en la sostenibilidad y la eficiencia energética.
          </p>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Experiencia Profesional</h2>
        <div class="space-y-8">
          <!-- Add your experience items here -->
          <div class="border-l-4 border-primary pl-4">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Ingeniero de Procesos</h3>
            <p class="text-primary">Empresa Química S.A. | 2020 - Presente</p>
            <p class="text-gray-600 dark:text-gray-300 mt-2">
              Desarrollo y optimización de procesos químicos industriales.
              Implementación de mejoras en eficiencia energética.
              Gestión de equipos y proyectos de innovación.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Proyectos Destacados</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Add your project cards here -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Optimización de Planta Química</h3>
              <p class="text-gray-600 dark:text-gray-300 mt-2">
                Proyecto de mejora de eficiencia energética que resultó en una reducción del 30% en el consumo de energía.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Contacto</h2>
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            ¿Interesado en colaborar? ¡Contáctame!
          </p>
          <a 
            href="mailto:tu@email.com"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Enviar email
          </a>
        </div>
      </div>
    </section>
  </div>
</template>