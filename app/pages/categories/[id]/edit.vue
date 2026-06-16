<template>
  <div class="container mx-auto p-6">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold">
              Редагування категорії
            </h1>
          </div>

          <UButton
            to="/categories"
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
        Завантаження категорії...
      </div>

      <UForm
        v-else
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Назва"
          name="title"
          required
        >
          <UInput
            v-model="state.title"
            placeholder="Наприклад: Новини"
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
          label="Опис"
          name="description"
        >
          <UTextarea
            v-model="state.description"
            placeholder="Короткий опис категорії"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Батьківська категорія"
          name="parent_id"
          required
        >
          <USelectMenu
            v-model="state.parent_id"
            :items="parentCategoryOptions"
            value-key="value"
            placeholder="Оберіть батьківську категорію"
            class="w-full"
            :loading="categoriesPending"
          />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            to="/categories"
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
  slug?: string | null
  description?: string | null
  parent_id: number | null
}

interface CategoriesResponse {
  data: Category[]
}

interface CategoryResponse {
  data: Category
}

const route = useRoute()
const id = route.params.id as string

const API_URL = 'http://localhost/api/admin/blog/categories'

const loading = ref(true)
const pending = ref(false)
const categoriesPending = ref(false)
const errorMessage = ref('')
const categories = ref<Category[]>([])

const schema = z.object({
  title: z.string()
    .trim()
    .min(5, 'Назва має містити мінімум 5 символів')
    .max(200, 'Назва має містити максимум 200 символів'),

  slug: z.string()
    .trim()
    .max(200, 'Slug має містити максимум 200 символів')
    .optional()
    .or(z.literal('')),

  description: z.string()
    .trim()
    .max(500, 'Опис має містити максимум 500 символів')
    .optional()
    .or(z.literal('')),

  parent_id: z.string()
    .min(1, 'Оберіть батьківську категорію')
})

type Schema = z.output<typeof schema>

const state = reactive({
  title: '',
  slug: '',
  description: '',
  parent_id: ''
})

const parentCategoryOptions = computed(() => {
  return categories.value
    .filter(category => category.id !== Number(id))
    .map(category => ({
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

const fetchParentCategories = async () => {
  categoriesPending.value = true

  try {
    const response = await $fetch<CategoriesResponse>(API_URL, {
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

const fetchCategory = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch<CategoryResponse>(`${API_URL}/${id}`)

    state.title = response.data.title ?? ''
    state.slug = response.data.slug ?? ''
    state.description = response.data.description ?? ''
    state.parent_id = response.data.parent_id === null ? '' : String(response.data.parent_id)
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
    description: state.description || undefined,
    parent_id: Number(state.parent_id)
  }
}

const onSubmit = async (_event: FormSubmitEvent<Schema>) => {
  pending.value = true
  errorMessage.value = ''

  try {
    await $fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: makePayload()
    })

    await navigateTo('/categories')
  } catch (error) {
    console.error(error)
    errorMessage.value = getErrorMessage(error)
  } finally {
    pending.value = false
  }
}

onMounted(async () => {
  await fetchParentCategories()
  await fetchCategory()
})
</script>
