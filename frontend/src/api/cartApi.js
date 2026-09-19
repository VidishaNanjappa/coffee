import { apiBase, requestJson } from './client.js'

export function addCartItem(token, { productId, quantity }) {
  return requestJson(`${apiBase}/cart/items`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  })
}

export function clearCart(token) {
  return requestJson(`${apiBase}/cart`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}
