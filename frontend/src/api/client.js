export const apiBase = import.meta.env.VITE_API_URL || '/api'

export async function requestJson(url, options = {}) {
  const controller = new AbortController()
  // Allow up to 60s so the first request can wake a sleeping free-tier backend.
  const timeout = window.setTimeout(() => controller.abort(), 60000)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      const message = response.status === 502 || response.status === 503 || response.status === 504
        ? 'The server is waking up. Please wait a moment and try again.'
        : result.error || `Request failed (${response.status})`
      const error = new Error(message)
      error.status = response.status
      throw error
    }
    return result
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The server took too long to respond. It may be waking up — please try again.')
    if (error instanceof TypeError) throw new Error('Cannot reach the server. Please check your connection and try again.')
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}
