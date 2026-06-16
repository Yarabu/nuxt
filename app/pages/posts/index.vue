<template>
  <div class="container mx-auto p-6">
    <UCard class="bg-white">
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Статті блогу
            </h1>
            <p class="text-sm text-gray-500">
              Список статей блогу
            </p>
          </div>

          <UButton
            to="/posts/create"
            icon="i-lucide-plus"
          >
            Додати статтю
          </UButton>
        </div>
      </template>

      <div
        v-if="errorMessage"
        class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="successMessage"
        class="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700"
      >
        {{ successMessage }}
      </div>

      <div
        v-if="postToDelete"
        class="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="font-semibold">
              Підтвердження видалення
            </p>
            <p>
              Ви дійсно хочете видалити статтю
              <strong>"{{ postToDelete.title }}"</strong>?
            </p>
          </div>

          <div class="flex gap-2">
            <UButton
              color="neutral"
              variant="outline"
              :disabled="deletePending"
              @click="cancelDelete"
            >
              Скасувати
            </UButton>

            <UButton
              color="error"
              :loading="deletePending"
              @click="deletePost"
            >
              Видалити
            </UButton>
          </div>
        </div>
      </div>

      <div class="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-1 flex-col gap-3 sm:flex-row">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Пошук за назвою статті..."
            class="w-full sm:max-w-md"
            @keydown.enter="applyFilters"
          />

          <UButton
            label="Шукати"
            icon="i-lucide-search"
            @click="applyFilters"
          />

          <UButton
            label="Очистити"
            color="neutral"
            variant="soft"
            @click="resetFilters"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">
            На сторінці:
          </span>

          <select
            v-model.number="perPage"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            @change="applyFilters"
          >
            <option
              v-for="option in perPageOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <div class="rounded-md border border-gray-200 bg-white">
        <UTable
          :data="posts"
          :columns="columns"
          :loading="pending"
          class="bg-white"
        >
          <template #user-cell="{ row }">
            {{ row.original.user?.name ?? '—' }}
          </template>

          <template #category-cell="{ row }">
            {{ row.original.category?.title ?? '—' }}
          </template>

          <template #is_published-cell="{ row }">
            <UBadge
              :color="row.original.is_published ? 'success' : 'neutral'"
              variant="soft"
            >
              {{ row.original.is_published ? 'Опубліковано' : 'Чернетка' }}
            </UBadge>
          </template>

          <template #published_at-cell="{ row }">
            {{ row.original.date_published ?? row.original.published_at ?? '—' }}
          </template>

          <template #actions-cell="{ row }">
            <div class="flex justify-end">
              <UDropdownMenu :items="getActions(row.original)">
                <UButton
                  icon="i-lucide-ellipsis-vertical"
                  color="neutral"
                  variant="ghost"
                  aria-label="Дії статті"
                />
              </UDropdownMenu>
            </div>
          </template>
        </UTable>

        <div class="flex justify-between items-center border-t border-gray-200 p-4">
          <p class="text-sm text-gray-500">
            Усього статей: {{ total }}
          </p>

          <UPagination
            v-model:page="page"
            :total="total"
            :items-per-page="perPage"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Author {
  id?: number
  name: string
}

interface Category {
  id?: number
  title: string
}

interface Post {
  id: number
  title: string
  slug?: string | null
  is_published: boolean
  published_at?: string | null
  date_published?: string | null
  user?: Author | null
  category?: Category | null
}

interface PostsResponse {
  data: Post[]
  meta?: {
    total: number
    per_page: number
    current_page: number
  }
  total?: number
  per_page?: number
}

const API_URL = 'http://localhost/api/admin/blog/posts'

const posts = ref<Post[]>([])
const page = ref(1)
const search = ref('')
const total = ref(0)
const perPage = ref(25)
const perPageOptions = [5, 10, 25, 50]
const pending = ref(false)
const deletePending = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const postToDelete = ref<Post | null>(null)

const columns = [
  {
    accessorKey: 'id',
    header: '#'
  },
  {
    accessorKey: 'title',
    header: 'Заголовок'
  },
  {
    accessorKey: 'user',
    header: 'Автор'
  },
  {
    accessorKey: 'category',
    header: 'Категорія'
  },
  {
    accessorKey: 'is_published',
    header: 'Статус'
  },
  {
    accessorKey: 'published_at',
    header: 'Дата публікації'
  },
  {
    id: 'actions',
    header: 'Дії'
  }
]

const getErrorMessage = (error: unknown) => {
  const data = (error as { data?: { message?: string, errors?: Record<string, string[]> } }).data

  if (data?.errors) {
    return Object.values(data.errors).flat().join(' ')
  }

  if (data?.message) {
    return data.message
  }

  return 'Сталася помилка. Спробуй ще раз.'
}

const fetchPosts = async () => {
  pending.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch<PostsResponse>(API_URL, {
      query: {
        page: page.value,
        per_page: perPage.value,
        search: search.value || undefined
      }
    })

    posts.value = Array.isArray(response.data) ? response.data : []
    total.value = response.meta?.total ?? response.total ?? posts.value.length
    perPage.value = response.meta?.per_page ?? response.per_page ?? perPage.value
  } catch (error) {
    console.error(error)
    errorMessage.value = getErrorMessage(error)
    posts.value = []
  } finally {
    pending.value = false
  }
}

const applyFilters = async () => {
  if (page.value !== 1) {
    page.value = 1
    return
  }

  await fetchPosts()
}

const resetFilters = async () => {
  search.value = ''

  if (page.value !== 1) {
    page.value = 1
    return
  }

  await fetchPosts()
}

const askDeletePost = (post: Post) => {
  errorMessage.value = ''
  successMessage.value = ''
  postToDelete.value = post
}

const cancelDelete = () => {
  postToDelete.value = null
}

const deletePost = async () => {
  if (!postToDelete.value) {
    return
  }

  deletePending.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await $fetch(`${API_URL}/${postToDelete.value.id}`, {
      method: 'DELETE'
    })

    successMessage.value = `Статтю "${postToDelete.value.title}" успішно видалено`
    postToDelete.value = null

    await fetchPosts()
  } catch (error) {
    console.error(error)
    errorMessage.value = getErrorMessage(error)
  } finally {
    deletePending.value = false
  }
}

const getActions = (post: Post) => [
  [
    {
      label: 'Переглянути',
      icon: 'i-lucide-eye',
      onSelect: () => navigateTo(`/posts/${post.id}`)
    },
    {
      label: 'Редагувати',
      icon: 'i-lucide-pencil',
      onSelect: () => navigateTo(`/posts/${post.id}/edit`)
    }
  ],
  [
    {
      label: 'Видалити',
      icon: 'i-lucide-trash',
      color: 'error' as const,
      onSelect: () => askDeletePost(post)
    }
  ]
]

watch(page, () => {
  fetchPosts()
})

onMounted(() => {
  fetchPosts()
})
</script>
