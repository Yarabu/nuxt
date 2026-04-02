export default defineEventHandler(async (event) => {
  const response = await $fetch('https://dummyjson.com/products?limit=0')
  return response
})
