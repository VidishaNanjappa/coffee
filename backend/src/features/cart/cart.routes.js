import { Router } from 'express'
import { loadDatabase, saveDatabase } from '../../db/store.js'
import { authRequired } from '../../middleware/auth.js'
import { getCart, hydrateCart } from './cart.service.js'

const router = Router()

router.get('/', authRequired, async (request, response) => {
  const database = await loadDatabase()
  response.json({ cart: hydrateCart(database, getCart(database, request.auth.sub)) })
})

router.post('/items', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const product = database.products.find((item) => item.id === request.body.productId && item.active !== false)
  const quantity = Number(request.body.quantity || 1)
  if (!product) return response.status(404).json({ error: 'Product not found' })
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return response.status(400).json({ error: 'Quantity must be an integer between 1 and 20' })
  const cart = getCart(database, request.auth.sub)
  const existing = cart.items.find((item) => item.productId === product.id)
  if (existing) existing.quantity = Math.min(existing.quantity + quantity, 20)
  else cart.items.push({ productId: product.id, quantity })
  await saveDatabase(database)
  response.status(201).json({ cart: hydrateCart(database, cart) })
})

router.patch('/items/:productId', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const quantity = Number(request.body.quantity)
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 20) return response.status(400).json({ error: 'Quantity must be an integer between 0 and 20' })
  const cart = getCart(database, request.auth.sub)
  const item = cart.items.find((candidate) => candidate.productId === request.params.productId)
  if (!item) return response.status(404).json({ error: 'Cart item not found' })
  if (quantity === 0) cart.items = cart.items.filter((candidate) => candidate.productId !== request.params.productId)
  else item.quantity = quantity
  await saveDatabase(database)
  response.json({ cart: hydrateCart(database, cart) })
})

router.delete('/items/:productId', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const cart = getCart(database, request.auth.sub)
  cart.items = cart.items.filter((item) => item.productId !== request.params.productId)
  await saveDatabase(database)
  response.json({ cart: hydrateCart(database, cart) })
})

router.delete('/', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const cart = getCart(database, request.auth.sub)
  cart.items = []
  await saveDatabase(database)
  response.json({ cart: hydrateCart(database, cart) })
})

export default router
