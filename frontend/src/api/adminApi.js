import { apiBase, requestJson } from './client.js'

function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export function fetchAdminProducts(token) {
  return requestJson(`${apiBase}/admin/products`, { headers: authHeaders(token) })
}

export function createAdminProduct(token, product) {
  return requestJson(`${apiBase}/admin/products`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(product),
  })
}

export function updateAdminProduct(token, id, changes) {
  return requestJson(`${apiBase}/admin/products/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(changes),
  })
}

export function deactivateAdminProduct(token, id) {
  return requestJson(`${apiBase}/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

export function fetchAdminOrders(token) {
  return requestJson(`${apiBase}/admin/orders`, { headers: authHeaders(token) })
}

export function updateAdminOrderStatus(token, id, status) {
  return requestJson(`${apiBase}/admin/orders/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  })
}
