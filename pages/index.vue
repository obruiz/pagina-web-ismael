<template>
  <div>
    <!-- Hero Section -->
    <section class="pt-32 pb-16 bg-secondary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span class="block">{{ content.hero.name }}</span>
            <span class="block text-primary mt-3">{{ content.hero.title }}</span>
          </h1>
          <p class="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {{ content.hero.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">{{ t('about') }}</h2>
        <div class="prose dark:prose-invert max-w-none">
          <p class="text-gray-600 dark:text-gray-300 whitespace-pre-line">
            {{ getLocalizedContent('about') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">{{ t('experience') }}</h2>
        <div class="space-y-8">
          <div 
            v-for="item in content.experience.items" 
            :key="item.id"
            class="border-l-4 border-primary pl-4"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ item.position }}</h3>
            <p class="text-primary">{{ item.company }} | {{ item.period }}</p>
            <p class="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">{{ t('projects') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            v-for="item in content.projects.items" 
            :key="item.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ item.title }}</h3>
              <p class="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">{{ t('contact') }}</h2>
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
            {{ content.contact.description }}
          </p>
          <a 
            :href="`mailto:${content.contact.email}`"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            {{ content.contact.buttonText }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from '~/composables/useI18n'

const { content } = useContentAPI()
const { t, currentLocale } = useI18n()

// Función para obtener contenido localizado
const getLocalizedContent = (section) => {
  if (!content.value?.[section]) return ''
  
  // Si el contenido tiene versiones en diferentes idiomas
  if (content.value[section].content_es && content.value[section].content_en) {
    return currentLocale.value === 'es' 
      ? content.value[section].content_es 
      : content.value[section].content_en
  }
  
  // Fallback al contenido original
  return content.value[section].content || ''
}
</script>