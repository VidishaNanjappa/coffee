import { apiBase, requestJson } from './client.js'

export function startCheckout(token) {
  return requestJson(`${apiBase}/payments/checkout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}
