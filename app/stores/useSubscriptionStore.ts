// app/stores/useSubscriptionStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubscriptionStore = defineStore('subscription', () => {
  // Зберігаємо назву плану (за замовчуванням Team - Annual)
  const planName = ref('Team - Annual')

  // Зберігаємо період: 'year' або 'month'
  const period = ref('year')

  // Функція, щоб зберегти вибір юзера перед переходом на чекаут
  function setSubscription(name: string, newPeriod: string) {
    planName.value = name
    period.value = newPeriod
  }

  return { planName, period, setSubscription }
})
