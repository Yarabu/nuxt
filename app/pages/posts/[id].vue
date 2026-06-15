<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div
      v-if="pending"
      class="text-center text-gray-500 mt-10"
    >
      Завантаження посту...
    </div>

    <div
      v-else-if="post"
      class="bg-white p-8 rounded-md shadow-sm border mt-6"
    >
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        {{ post.title }}
      </h1>

      <div class="flex gap-6 text-sm text-gray-600 mb-8 pb-4 border-b">
        <span>Автор: {{ post.user?.name || 'Невідомий автор' }}</span>
        <span>Категорія: {{ post.category?.title || 'Без категорії' }}</span>
        <span v-if="post.published_at">Дата: {{ post.published_at }}</span>
      </div>

      <div class="text-gray-900 text-lg leading-relaxed">
        {{ post.content_html || 'Тут має бути текст статті...' }}
      </div>

      <div class="mt-8 pt-4 border-t">
        <a
          href="/BlogPostsUi"
          class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          &larr; Повернутися до списку
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

/* eslint-disable */

const route = useRoute()
const post = ref<any>(null)
const pending = ref(true)

// Отримуємо ID з адресної стрічки (з URL)
const postId = route.params.id

const fetchSinglePost = async () => {
  pending.value = true
  try {
    // Звертаємося до нашого нового методу show() в Laravel
    const response = await $fetch<any>(`http://localhost/api/admin/blog/posts/${postId}`)
    post.value = response.data
  } catch (error) {
    console.error('Помилка завантаження поста:', error)
  } finally {
    pending.value = false
  }
}

// Запускаємо завантаження при відкритті сторінки
onMounted(() => {
  fetchSinglePost()
})
</script>
