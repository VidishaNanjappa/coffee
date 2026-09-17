import { Router } from 'express'
import { createId, loadDatabase, saveDatabase } from '../../db/store.js'
import { authRequired } from '../../middleware/auth.js'
import { getCart, hydrateCart } from '../cart/cart.service.js'

const router = Router()

router.post('/', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const cart = getCart(database, request.auth.sub)
  const hydratedCart = hydrateCart(database, cart)
  if (!hydratedCart.items.length) return response.status(400).json({ error: 'Your cart is empty' })
  const order = {
    id: createId('order'),
    userId: request.auth.sub,
    items: hydratedCart.items.map(({ product, quantity, lineTotal }) => ({ productId: product.id, name: product.name, price: product.price, quantity, lineTotal })),
    subtotal: hydratedCart.subtotal,
    status: 'pending_payment',
    shippingAddress: request.body.shippingAddress || null,
    createdAt: new Date().toISOString(),
  }
  database.orders.push(order)
  cart.items = []
  await saveDatabase(database)
  response.status(201).json({ order })
})

router.get('/', authRequired, async (request, response) => {
  const database = await loadDatabase()
  response.json({ orders: database.orders.filter((order) => order.userId === request.auth.sub) })
})

export default router
