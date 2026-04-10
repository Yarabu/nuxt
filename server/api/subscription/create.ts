export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('Нова підписка!', body)

  return {
    success: true,
    message: 'Підписка успішно оформлена!',
    receivedData: body
  }
})
