export function errorHandler(error, request, response, next) {
  console.error(error)
  response.status(400).json({ error: error.message || 'Request failed' })
}
