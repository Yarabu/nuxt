<template>
  <div class="min-h-screen font-sans text-gray-800 bg-white pb-20">

    <div class="w-full bg-[#333333] py-3 text-center">
      <h1 class="text-white font-bold text-lg">Checkout</h1>
    </div>

    <div class="max-w-5xl mx-auto px-4 mt-6">

      <button @click="$router.back()" class="text-gray-400 hover:text-gray-600 text-sm mb-6 inline-block cursor-pointer">
        &lt;&lt; back
      </button>

      <h2 class="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
        You're Almost In - Start Your 3-Day Free Trial Now!
      </h2>
      <p class="text-gray-500 mb-8">
        Set up your account to gain instant access! You won't be charged if you decide to cancel within 3 days
      </p>

      <div v-else-if="data" class="flex flex-col md:flex-row gap-8">

        <div class="w-full md:w-[40%]">
          <div class="bg-white rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden flex flex-col">
            <div class="h-1.5 w-full bg-gradient-to-r from-green-400 to-cyan-400 absolute top-0 left-0"></div>

            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-800">{{ data.plan.name }}</h3>

              <div class="mt-3">
                <span class="inline-block bg-gray-100 text-gray-500 text-[10px] font-semibold px-2 py-1 rounded">
                  3-days free then:
                </span>
              </div>

              <div class="mt-2 flex items-baseline gap-1">
                <span class="text-4xl font-extrabold text-gray-800">${{ data.plan.price }}</span>
                <span class="text-gray-500 font-medium text-sm">/month</span>
              </div>

              <div v-if="data.plan.period === 'year'">
                <p class="text-[13px] text-gray-500 mt-1">
                  billed yearly at <span class="line-through">${{ data.plan.oldPrice }}</span> <span class="text-black font-semibold">${{ data.plan.billedYearly }}</span>
                </p>
                <div class="mt-2 mb-6">
                  <span class="inline-block bg-green-50 text-green-600 border border-green-200 text-xs font-bold px-2 py-1 rounded">
                    ${{ data.plan.savings }} in savings
                  </span>
                </div>
              </div>
              <div v-else class="h-6"></div>

              <ul class="space-y-3">
                <li class="flex items-start gap-2">
                  <iconify-icon icon="octicon:sparkle-fill-16" class="text-green-400 text-lg shrink-0 mt-0.5"></iconify-icon>
                  <div>
                    <p class="text-[13px] text-gray-700">{{ data.plan.usersMain }}</p>
                    <p class="text-[11px] text-gray-500">{{ data.plan.usersExtra }}</p>
                  </div>
                </li>

                <li class="flex items-start gap-2">
                  <iconify-icon icon="octicon:sparkle-fill-16" class="text-green-400 text-lg shrink-0 mt-0.5"></iconify-icon>
                  <div>
                    <p class="text-[13px] text-gray-700"><span class="font-bold">{{ data.plan.exports }}</span> exports</p>
                    <p class="text-[11px] text-gray-500">{{ data.plan.exportsExtra }}</p>
                  </div>
                </li>

                <li class="flex items-start gap-2">
                  <iconify-icon icon="octicon:sparkle-fill-16" class="text-green-400 text-lg shrink-0 mt-0.5"></iconify-icon>
                  <div>
                    <p class="text-[13px] text-gray-700"><span class="font-bold">{{ data.plan.traces }}</span> free skip traces</p>
                    <p class="text-[11px] text-gray-500">{{ data.plan.tracesExtra }}</p>
                  </div>
                </li>

                <li class="flex items-start gap-2" v-for="feature in data.sharedFeatures" :key="feature">
                  <iconify-icon icon="octicon:sparkle-fill-16" class="text-green-400 text-lg shrink-0 mt-0.5"></iconify-icon>
                  <p class="text-[13px] text-gray-700" v-html="feature"></p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="w-full md:w-[60%]">
          <div class="bg-[#FAFAFA] border border-gray-200 rounded-lg p-6 md:p-8">

            <h3 class="font-bold text-gray-700 mb-4">Order Summary</h3>

            <div class="space-y-3 text-sm text-gray-600 mb-4">
              <div class="flex justify-between border-b border-gray-200 pb-3">
                <span class="capitalize">{{ data.plan.period }}ly Plan</span>
                <span class="font-medium text-gray-800">${{ data.plan.totalPrice }}</span>
              </div>
              <div class="flex justify-between border-b border-gray-200 pb-3">
                <span>Total Due <span class="text-[10px] text-gray-400">(*not including sales tax where applicable)</span></span>
                <span class="font-medium text-gray-800">${{ data.plan.totalPrice }}</span>
              </div>
              <div class="flex justify-between font-bold text-gray-800 pb-2">
                <span>Due Today</span>
                <span>$0.00</span>
              </div>
            </div>

            <div class="w-full bg-[#EEEEEE] text-gray-500 text-center py-2.5 rounded text-sm font-semibold mb-8">
              Includes 3-Day Free Trial
            </div>

            <div class="flex items-center gap-1 mb-4">
              <h3 class="font-bold text-gray-700">Billing Information</h3>
              <i class="fa-solid fa-circle-info text-gray-300 text-xs"></i>
            </div>

            <form @submit.prevent="submitCheckout">
              <div class="mb-4">
                <label class="block text-xs text-gray-500 mb-1">Card Details</label>
                <div class="flex items-center border border-gray-200 rounded bg-white px-3 py-2">
                  <i class="fa-regular fa-credit-card text-gray-400 mr-2"></i>
                  <input type="text" placeholder="Number" class="w-full text-sm outline-none text-gray-600" disabled>
                  <input type="text" placeholder="MM / YY" class="w-20 text-sm outline-none text-gray-600 text-center border-l border-gray-100 ml-2" disabled>
                  <input type="text" placeholder="CVC" class="w-16 text-sm outline-none text-gray-600 text-center border-l border-gray-100 ml-2" disabled>
                </div>
              </div>

              <div class="mb-6 bg-white border border-gray-200 rounded p-4">
                <label class="block text-xs text-gray-600 mb-3">Address</label>
                <input v-model="form.fullName" type="text" placeholder="Full name" required class="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-400">
                <input v-model="form.address" type="text" placeholder="Address" required class="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
              </div>

              <div class="flex items-start gap-2 mb-6">
                <input v-model="form.consent" type="checkbox" required class="mt-1 w-4 h-4 rounded border-gray-300 cursor-pointer">
                <p class="text-[11px] text-gray-500 leading-tight">
                  I consent to <a href="#" class="font-bold underline">Terms of Use</a> and understand my 3-day free trial will automatically convert to
                  <span class="font-bold">${{ data.plan.totalPrice }} per {{ data.plan.period }}</span> starting on <span class="font-bold">{{ trialEndDate }}</span>.
                  The {{ data.plan.period }}ly fee will be automatically charged each {{ data.plan.period }} going forward unless I cancel my account at least one (1) business day before the end of the current billing period, which can be done by calling (888) 463-3163.
                </p>
              </div>

              <button
                type="submit"
                :disabled="!form.consent"
                :class="form.consent ? 'bg-[#333333] text-white hover:bg-black' : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'"
                class="px-8 py-2.5 rounded font-bold text-sm transition-colors cursor-pointer"
              >
                Try It Free
              </button>

              <p v-if="successMsg" class="mt-4 text-green-600 font-bold text-sm">{{ successMsg }}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useHead({
  title: 'Оплата підписки',
  script: [{ src: 'https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js' }],
  link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }]
})

const route = useRoute()
const { data, pending } = await useFetch('/api/checkout', {
  query: { plan: route.query.plan }
})

const date = new Date()
date.setDate(date.getDate() + 3)
const trialEndDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

const form = ref({
  fullName: 'dev4 dev4',
  address: '',
  consent: false
})
const successMsg = ref('')

const submitCheckout = async () => {
  try {
    const response = await $fetch('/api/subscription/create', { method: 'POST', body: form.value })
    if (response.success) successMsg.value = response.message
  } catch (error) {
    console.error(error)
  }
}
</script>
