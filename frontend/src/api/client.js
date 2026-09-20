export const apiBase = import.meta.env.VITE_API_URL || '/api'

export async function requestJson(url, options = {}) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      const error = new Error(result.error || `Request failed (${response.status})`)
      error.status = response.status
      throw error
    }
    return result
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The backend took too long to respond. Start it with npm run dev in backend.')
    if (error instanceof TypeError) throw new Error('Cannot reach the backend. Start it with npm run dev in backend.')
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}
