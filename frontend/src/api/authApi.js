import { apiBase, requestJson } from './client.js'

export function login({ email, password }) {
  return requestJson(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export function register({ name, email, password }) {
  return requestJson(`${apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
}
