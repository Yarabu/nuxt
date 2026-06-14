<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">
      Пости
    </h1>

    <div class="border rounded-md shadow-sm bg-white">
      <UTable
        :data="posts"
        :columns="columns"
        :loading="pending"
      />

      <div class="flex justify-end p-4 border-t">
        <UPagination
          v-model="page"
          :total="total"
          :items-per-page="perPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'

interface Author {
  name: string
}

interface Category {
  title: string
}

interface Post {
  id: number
  title: string
  published_at: string | null
  user: Author | null
  category: Category | null
}

interface PostsResponse {
  data: Post[]
  total: number
  per_page: number
}

const posts = ref<Post[]>([])
const page = ref(1)
const total = ref(0)
const perPage = ref(25)
const pending = ref(false)

const columns: ColumnDef<Post>[] = [
  { accessorKey: 'id', header: '#' },
  {
    accessorKey: 'user',
    header: 'Автор',
    cell: ({ row }) => row.original.user?.name ?? '—'
  },
  {
    accessorKey: 'category',
    header: 'Категорія',
    cell: ({ row }) => row.original.category?.title ?? '—'
  },
  {
    accessorKey: 'title',
    header: 'Заголовок',
    cell: ({ row }) =>
      h('a', {
        href: `/admin/blog/posts/${row.original.id}/edit`,
        class: 'text-blue-500 hover:underline'
      }, row.original.title)
  },
  { accessorKey: 'published_at', header: 'Дата публікації' }
]

const fetchPosts = async () => {
  pending.value = true
  try {
    const response = await $fetch<PostsResponse>(
      `http://localhost/api/admin/blog/posts?page=${page.value}`
    )
    posts.value = response.data
    total.value = response.total
    perPage.value = response.per_page
  } catch (error) {
    console.error('Помилка завантаження:', error)
  } finally {
    pending.value = false
  }
}

fetchPosts()
watch(page, fetchPosts)
</script>
