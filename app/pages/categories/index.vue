<template>
  <div class="container mx-auto p-6">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold">
              Категорії
            </h1>
            <p class="text-sm text-gray-500">
              Список категорій блогу
            </p>
          </div>

          <UButton
            to="/categories/create"
            icon="i-lucide-plus"
          >
            Додати категорію
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
        v-if="categoryToDelete"
        class="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="font-semibold">
              Підтвердження видалення
            </p>
            <p>
              Ви дійсно хочете видалити категорію
              <strong>"{{ categoryToDelete.title }}"</strong>?
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
              @click="deleteCategory"
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
            placeholder="Пошук за назвою категорії..."
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

      <UTable
        :data="categories"
        :columns="columns"
        :loading="pending"
      >
        <template #parent_id-cell="{ row }">
          {{ row.original.parent_id ?? '—' }}
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end">
            <UDropdownMenu :items="getActions(row.original)">
              <UButton
                icon="i-lucide-ellipsis-vertical"
                color="neutral"
                variant="ghost"
                aria-label="Дії категорії"
              />
            </UDropdownMenu>
          </div>
        </template>
      </UTable>

      <div class="flex justify-between items-center border-t pt-4 mt-4">
        <p class="text-sm text-gray-500">
          Усього категорій: {{ total }}
        </p>

        <UPagination
          v-model:page="page"
          :total="total"
          :items-per-page="perPage"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: number
  title: string
  slug?: string | null
  description?: string | null
  parent_id: number | null
}

interface CategoriesResponse {
  data: Category[]
  meta?: {
    total: number
    per_page: number
    current_page: number
  }
}

const API_URL = 'http://localhost/api/admin/blog/categories'

const categories = ref<Category[]>([])
const page = ref(1)
const search = ref('')
const total = ref(0)
const perPage = ref(25)
const perPageOptions = [5, 10, 25, 50]
const pending = ref(false)
const deletePending = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const categoryToDelete = ref<Category | null>(null)

const columns = [
  {
    accessorKey: 'id',
    header: '#'
  },
  {
    accessorKey: 'title',
    header: 'Назва'
  },
  {
    accessorKey: 'slug',
    header: 'Slug'
  },
  {
    accessorKey: 'parent_id',
    header: 'Батьківська категорія'
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

const fetchCategories = async () => {
  pending.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch<CategoriesResponse>(API_URL, {
      query: {
        page: page.value,
        per_page: perPage.value,
        search: search.value || undefined
      }
    })

    categories.value = Array.isArray(response.data) ? response.data : []
    total.value = response.meta?.total ?? categories.value.length
    perPage.value = response.meta?.per_page ?? perPage.value
  } catch (error) {
    console.error(error)
    errorMessage.value = getErrorMessage(error)
    categories.value = []
  } finally {
    pending.value = false
  }
}

const applyFilters = async () => {
  page.value = 1
  await fetchCategories()
}

const resetFilters = async () => {
  search.value = ''
  page.value = 1
  await fetchCategories()
}

const askDeleteCategory = (category: Category) => {
  errorMessage.value = ''
  successMessage.value = ''
  categoryToDelete.value = category
}

const cancelDelete = () => {
  categoryToDelete.value = null
}

const deleteCategory = async () => {
  if (!categoryToDelete.value) {
    return
  }

  deletePending.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await $fetch(`${API_URL}/${categoryToDelete.value.id}`, {
      method: 'DELETE'
    })

    successMessage.value = `Категорію "${categoryToDelete.value.title}" успішно видалено`
    categoryToDelete.value = null

    await fetchCategories()
  } catch (error) {
    console.error(error)
    errorMessage.value = getErrorMessage(error)
  } finally {
    deletePending.value = false
  }
}

const getActions = (category: Category) => [
  [
    {
      label: 'Редагувати',
      icon: 'i-lucide-pencil',
      onSelect: () => navigateTo(`/categories/${category.id}/edit`)
    }
  ],
  [
    {
      label: 'Видалити',
      icon: 'i-lucide-trash',
      color: 'error' as const,
      onSelect: () => askDeleteCategory(category)
    }
  ]
]

watch(page, () => {
  fetchCategories()
})

onMounted(() => {
  fetchCategories()
})
</script>
