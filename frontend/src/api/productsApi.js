import { apiBase, requestJson } from './client.js'

export function fetchProducts() {
  return requestJson(`${apiBase}/products`)
}
