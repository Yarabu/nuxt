<template>
  <div class="bg-gray-100 min-h-screen p-8 text-gray-800 font-sans">

    <div class="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-black">

      <div class="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 gap-4 bg-white">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-all">
            <input type="checkbox" class="w-4 h-4 rounded border-gray-300 bg-white accent-blue-600 cursor-pointer shadow-sm appearance-none border checked:appearance-auto">
            <i class="fa-solid fa-chevron-down text-gray-400 text-[10px]"></i>
          </div>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              v-model="search"
              type="text"
              placeholder="Пошук товарів..."
              class="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none w-64 bg-white text-black"
            >
          </div>
        </div>

        <div class="flex items-center gap-6 text-sm font-semibold text-gray-700">
          <button class="flex items-center gap-2 hover:text-blue-600">
            <i class="fa-solid fa-expand text-gray-400"></i> Display
          </button>
          <button class="flex items-center gap-2 hover:text-blue-600">
            <i class="fa-solid fa-arrow-down-wide-short text-gray-400"></i> Sort by
          </button>
          <button class="flex items-center gap-2 hover:text-blue-600">
            <i class="fa-solid fa-ellipsis-vertical text-gray-400"></i> Actions
          </button>
        </div>
      </div>

      <div class="overflow-x-auto min-h-[400px]">
        <table class="w-full text-left border-collapse">
          <thead>
          <tr class="bg-gray-50 border-b border-gray-200 text-[11px] uppercase tracking-widest text-gray-500 font-bold">
            <th class="p-4 w-12"></th>
            <th class="p-4">Фото</th>
            <th class="p-4 cursor-pointer hover:text-black group" @click="sortBy('title')">
              Назва <i class="fa-solid fa-sort ml-1 opacity-20 group-hover:opacity-100"></i>
            </th>
            <th class="p-4">Опис</th>
            <th class="p-4 cursor-pointer hover:text-black group" @click="sortBy('price')">
              Ціна <i class="fa-solid fa-sort ml-1 opacity-20 group-hover:opacity-100"></i>
            </th>
            <th class="p-4 cursor-pointer hover:text-black group" @click="sortBy('rating')">
              Оцінка <i class="fa-solid fa-sort ml-1 opacity-20 group-hover:opacity-100"></i>
            </th>
            <th class="p-4 cursor-pointer hover:text-black group" @click="sortBy('brand')">
              Бренд <i class="fa-solid fa-sort ml-1 opacity-20 group-hover:opacity-100"></i>
            </th>
            <th class="p-4">Категорія</th>
          </tr>
          </thead>

          <tbody class="text-sm divide-y divide-gray-100 italic">
          <tr v-for="product in paginatedRows" :key="product.id" class="hover:bg-gray-50 transition-colors not-italic">
            <td class="p-4">
              <input type="checkbox" class="w-4 h-4 rounded border-gray-300 bg-white accent-blue-600 cursor-pointer appearance-none border checked:appearance-auto">
            </td>
            <td class="p-4">
              <img :src="product.thumbnail" class="w-[100px] h-[100px] object-cover rounded-md border border-gray-100">
            </td>
            <td class="p-4 font-bold text-gray-900 underline underline-offset-4 decoration-gray-200">{{ product.title }}</td>
            <td class="p-4 text-gray-500 max-w-[200px] truncate text-xs">{{ product.description }}</td>
            <td class="p-4 font-bold text-black">${{ product.price }}</td>
            <td class="p-4 font-bold text-base" :class="product.rating < 4.5 ? 'text-red-500' : 'text-green-600'">
              {{ product.rating }}
            </td>
            <td class="p-4 text-gray-700">{{ product.brand || '—' }}</td>
            <td class="p-4 capitalize text-gray-500">{{ product.category }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between p-4 bg-white border-t border-gray-200">
        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">
          Показано {{ totalRows > 0 ? (page - 1) * itemsPerPage + 1 : 0 }}-{{ Math.min(page * itemsPerPage, totalRows) }} з {{ totalRows }}
        </div>

        <div class="flex items-center gap-1.5 font-sans">
          <button @click="page = 1" :disabled="page === 1" class="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-50 hover:bg-gray-100 disabled:opacity-20 transition-all cursor-pointer">
            <i class="fa-solid fa-angles-left text-[10px]"></i>
          </button>

          <button @click="page > 1 ? page-- : null" :disabled="page === 1" class="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-50 hover:bg-gray-100 disabled:opacity-20 transition-all mr-1 cursor-pointer">
            <i class="fa-solid fa-angle-left text-xs"></i>
          </button>

          <template v-for="(p, index) in displayedPages" :key="index">
            <span v-if="p === '...'" class="px-2 text-gray-400 font-bold">...</span>
            <button
              v-else
              @click="page = p"
              class="w-10 h-10 flex items-center justify-center rounded-lg border-2 font-bold text-sm transition-all shadow-sm cursor-pointer"
              :class="page === p ? 'bg-black border-black text-white scale-105' : 'border-gray-50 text-gray-400 hover:border-gray-300'"
            >
              {{ p }}
            </button>
          </template>

          <button @click="page < totalPages ? page++ : null" :disabled="page >= totalPages || totalPages === 0" class="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-50 hover:bg-gray-100 disabled:opacity-20 transition-all ml-1 cursor-pointer">
            <i class="fa-solid fa-angle-right text-xs"></i>
          </button>

          <button @click="page = totalPages" :disabled="page === totalPages || totalPages === 0" class="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-50 hover:bg-gray-100 disabled:opacity-20 transition-all cursor-pointer">
            <i class="fa-solid fa-angles-right text-[10px]"></i>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

useHead({
  title: 'Таблиця',
  link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }]
})

const { data, pending } = await useFetch('/api/shop')
const products = computed(() => data.value?.products || [])

const search = ref('')
const page = ref(1)
const itemsPerPage = 5
const sortKey = ref('title')
const sortOrder = ref(1)

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value *= -1
  } else {
    sortKey.value = key
    sortOrder.value = 1
  }
}

const processedRows = computed(() => {
  let result = [...products.value]

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    )
  }

  result.sort((a, b) => {
    let valA = a[sortKey.value] || ''
    let valB = b[sortKey.value] || ''
    if (valA === valB) return 0
    return valA > valB ? 1 * sortOrder.value : -1 * sortOrder.value
  })

  return result
})

const totalRows = computed(() => processedRows.value.length)
const totalPages = computed(() => Math.ceil(totalRows.value / itemsPerPage))

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = page.value
  const delta = 2
  let pages = []

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }
  return pages
})

const paginatedRows = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return processedRows.value.slice(start, start + itemsPerPage)
})

watch(search, () => {
  page.value = 1
})
</script>
