<template>
  <UApp>
    <div>
      <header class="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
        <div class="container mx-auto flex justify-between items-center max-w-7xl">
          <div class="font-bold text-xl text-gray-900">
            Blog admin panel
          </div>

          <nav class="flex gap-8">
            <NuxtLink
              to="/posts"
              class="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Пости
            </NuxtLink>

            <NuxtLink
              to="/categories"
              class="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Категорії
            </NuxtLink>
          </nav>
        </div>
      </header>

      <main class="bg-gray-50 min-h-screen pb-12">
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  title: 'Blog admin panel'
})

const colorMode = useColorMode()

colorMode.preference = 'light'
</script>
