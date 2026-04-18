<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">

    <div class="w-full max-w-6xl mb-8 flex justify-between items-end">
      <h1 class="text-3xl font-bold text-gray-800">Start Your 3 Day Free Trial</h1>

      <div class="text-sm font-medium flex items-center gap-3">
        <div class="relative text-green-500">
          Save up to 20%
          <iconify-icon icon="ph:arrow-bend-up-right-bold" class="absolute -top-2 -right-5 text-green-500 text-xl"></iconify-icon>
        </div>

        <div class="flex bg-gray-100 rounded-md border border-gray-200 ml-2 p-0.5">
          <button @click="isAnnual = true" :class="isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-1.5 rounded-md font-bold transition-all">Annual</button>
          <button @click="isAnnual = false" :class="!isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-1.5 rounded-md font-bold transition-all">Monthly</button>
        </div>
      </div>
    </div>

    <div v-if="data" class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
      <div
        v-for="plan in (isAnnual ? data.annualPlans : data.monthlyPlans)"
        :key="plan.name"
        class="bg-white rounded-xl shadow-lg border border-transparent hover:border-gray-300 transition-colors overflow-hidden flex flex-col relative">
        <div class="h-1.5 w-full bg-gradient-to-r from-green-400 to-cyan-400 absolute top-0 left-0"></div>

        <div class="p-6 pt-8 flex flex-col h-full">
          <h2 class="text-xl font-bold text-gray-800">{{ plan.name }}</h2>

          <div class="mt-4">
            <span class="inline-block bg-gray-100 text-gray-500 text-[11px] font-semibold px-2 py-1 rounded">
              3-days free then:
            </span>
          </div>

          <div class="mt-3 flex items-baseline gap-1">
            <span class="text-5xl font-extrabold text-gray-800">${{ plan.price }}</span>
            <span class="text-gray-500 font-medium text-sm">/month</span>
          </div>

          <div v-if="isAnnual">
            <p class="text-sm text-gray-500 mt-2">
              billed yearly at <span class="line-through">${{ plan.oldPrice }}</span> <span class="text-black font-semibold">${{ plan.billedYearly }}</span>
            </p>
            <div class="mt-2 mb-6">
              <span class="inline-block bg-green-50 text-green-500 border border-green-200 text-xs font-bold px-2 py-1 rounded">
                ${{ plan.savings }} in savings
              </span>
            </div>
          </div>
          <div v-else class="h-6"></div>

          <button
            @click="selectPlanAndGo(plan.name)"
            class="block text-center w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-2.5 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-sm cursor-pointer">
            Try It Free
          </button>

          <hr class="my-6 border-gray-200">

          <ul class="space-y-4 flex-grow">
            <li class="flex items-start gap-3">
              <iconify-icon icon="octicon:sparkle-fill-16" class="text-green-400 text-xl shrink-0 mt-0.5"></iconify-icon>
              <div>
                <p class="text-sm text-gray-800">{{ plan.usersMain }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ plan.usersExtra }}</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <iconify-icon icon="octicon:sparkle-fill-16" class="text-green-400 text-xl shrink-0 mt-0.5"></iconify-icon>
              <p class="text-sm text-gray-800">Save unlimited properties</p>
            </li>
            <li class="flex items-start gap-3">
              <iconify-icon icon="octicon:sparkle-fill-16" class="text-green-400 text-xl shrink-0 mt-0.5"></iconify-icon>
              <div>
                <p class="text-sm text-gray-800"><span class="font-bold">{{ plan.exports }}</span> exports</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ plan.exportsExtra }}</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <iconify-icon icon="octicon:sparkle-fill-16" class="text-green-400 text-xl shrink-0 mt-0.5"></iconify-icon>
              <div>
                <p class="text-sm text-gray-800"><span class="font-bold">{{ plan.traces }}</span> free skip traces</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ plan.tracesExtra }}</p>
              </div>
            </li>
            <li class="flex items-start gap-3" v-for="feature in data.sharedFeatures" :key="feature">
              <iconify-icon icon="octicon:sparkle-fill-16" class="text-green-400 text-xl shrink-0 mt-0.5"></iconify-icon>
              <p class="text-sm text-gray-800" v-html="feature"></p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useHead({
  title: 'Список продуктів',
  script: [{ src: 'https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js' }]
})

const { data } = await useFetch('/api/products')
const isAnnual = ref(true)

const subscriptionStore = useSubscriptionStore()

const selectPlanAndGo = (planName) => {
  subscriptionStore.setSubscription(planName, isAnnual.value ? 'year' : 'month')
  navigateTo('/checkout')
}
</script>
