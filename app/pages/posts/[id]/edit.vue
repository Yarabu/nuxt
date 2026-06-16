<template>
  <div class="container mx-auto p-6">
    <UCard class="bg-white">
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Редагування статті
            </h1>
          </div>

          <UButton
            to="/posts"
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
          >
            Назад
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
        v-if="loading"
        class="py-8 text-center text-sm text-gray-500"
      >
        Завантаження статті...
      </div>

      <UForm
        v-else
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Заголовок"
          name="title"
          required
        >
          <UInput
            v-model="state.title"
            placeholder="Наприклад: Перша стаття"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Slug"
          name="slug"
        >
          <UInput
            v-model="state.slug"
            placeholder="Можна залишити порожнім"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Категорія"
          name="category_id"
          required
        >
          <USelectMenu
            v-model="state.category_id"
            :items="categoryOptions"
            value-key="value"
            placeholder="Оберіть категорію"
            class="w-full"
            :loading="categoriesPending"
          />
        </UFormField>

        <UFormField
          label="Короткий опис"
          name="excerpt"
        >
          <UTextarea
            v-model="state.excerpt"
            placeholder="Короткий опис статті"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Текст статті"
          name="content_raw"
          required
        >
          <UTextarea
            v-model="state.content_raw"
            placeholder="Основний текст статті"
            class="w-full"
            :rows="8"
          />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            to="/posts"
            color="neutral"
            variant="outline"
          >
            Скасувати
          </UButton>

          <UButton
            type="submit"
            :loading="pending"
          >
            Оновити
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

interface Category {
  id: number
  title: string
}

interface CategoriesResponse {
  data: Category[]
}

interface Post {
  id: number
  title: string
  slug?: string | null
  excerpt?: string | null
  content_raw?: string | null
  category_id: number
}

interface PostResponse {
  data: Post
}

const route = useRoute()
const id = route.params.id as string

const POSTS_API_URL = 'http://localhost/api/admin/blog/posts'
const CATEGORIES_API_URL = 'http://localhost/api/admin/blog/categories'

const loading = ref(true)
const pending = ref(false)
const categoriesPending = ref(false)
const errorMessage = ref('')
const categories = ref<Category[]>([])

const schema = z.object({
  title: z.string()
    .trim()
    .min(5, 'Заголовок має містити мінімум 5 символів')
    .max(200, 'Заголовок має містити максимум 200 символів'),

  slug: z.string()
    .trim()
    .max(200, 'Slug має містити максимум 200 символів')
    .optional()
    .or(z.literal('')),

  category_id: z.string()
    .min(1, 'Оберіть категорію'),

  excerpt: z.string()
    .trim()
    .max(500, 'Короткий опис має містити максимум 500 символів')
    .optional()
    .or(z.literal('')),

  content_raw: z.string()
    .trim()
    .min(5, 'Текст статті має містити мінімум 5 символів')
    .max(10000, 'Текст статті має містити максимум 10000 символів')
})

type Schema = z.output<typeof schema>

const state = reactive({
  title: '',
  slug: '',
  category_id: '',
  excerpt: '',
  content_raw: ''
})

const categoryOptions = computed(() => {
  return categories.value.map(category => ({
    label: `${category.id} — ${category.title}`,
    value: String(category.id)
  }))
})

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

const fetchCategories = async () => {
  categoriesPending.value = true

  try {
    const response = await $fetch<CategoriesResponse>(CATEGORIES_API_URL, {
      query: {
        per_page: 1000
      }
    })

    categories.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error(error)
    errorMessage.value = getErrorMessage(error)
    categories.value = []
  } finally {
    categoriesPending.value = false
  }
}

const fetchPost = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch<PostResponse>(`${POSTS_API_URL}/${id}`)

    state.title = response.data.title ?? ''
    state.slug = response.data.slug ?? ''
    state.category_id = response.data.category_id ? String(response.data.category_id) : ''
    state.excerpt = response.data.excerpt ?? ''
    state.content_raw = response.data.content_raw ?? ''
  } catch (error) {
    console.error(error)
    errorMessage.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

const makePayload = () => {
  return {
    title: state.title,
    slug: state.slug || undefined,
    category_id: Number(state.category_id),
    excerpt: state.excerpt || undefined,
    content_raw: state.content_raw
  }
}

const onSubmit = async (_event: FormSubmitEvent<Schema>) => {
  pending.value = true
  errorMessage.value = ''

  try {
    await $fetch(`${POSTS_API_URL}/${id}`, {
      method: 'PUT',
      body: makePayload()
    })

    await navigateTo('/admin/blog/posts')
  } catch (error) {
    console.error(error)
    errorMessage.value = getErrorMessage(error)
  } finally {
    pending.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchPost()
})
</script>
