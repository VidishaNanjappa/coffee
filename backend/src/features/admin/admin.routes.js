import { Router } from 'express'
import { createId, loadDatabase, saveDatabase } from '../../db/store.js'
import { adminRequired, authRequired } from '../../middleware/auth.js'
import { requiredText } from '../../utils/validation.js'

const router = Router()
router.use(authRequired, adminRequired)

router.get('/products', async (request, response) => {
  const database = await loadDatabase()
  response.json({ products: database.products })
})

router.post('/products', async (request, response) => {
  const database = await loadDatabase()
  const product = {
    id: createId('product'),
    name: requiredText(request.body.name, 'Name'),
    roast: request.body.roast || '',
    notes: request.body.notes || '',
    price: Number(request.body.price),
    weight: request.body.weight || '250g',
    image: request.body.image || '',
    tag: request.body.tag || '',
    active: request.body.active !== false,
  }
  if (!Number.isFinite(product.price) || product.price <= 0) return response.status(400).json({ error: 'Price must be a positive number' })
  database.products.push(product)
  await saveDatabase(database)
  response.status(201).json({ product })
})

router.patch('/products/:id', async (request, response) => {
  const database = await loadDatabase()
  const product = database.products.find((item) => item.id === request.params.id)
  if (!product) return response.status(404).json({ error: 'Product not found' })
  Object.assign(product, request.body)
  if (request.body.price !== undefined && (!Number.isFinite(Number(product.price)) || Number(product.price) <= 0)) return response.status(400).json({ error: 'Price must be a positive number' })
  await saveDatabase(database)
  response.json({ product })
})

router.delete('/products/:id', async (request, response) => {
  const database = await loadDatabase()
  const product = database.products.find((item) => item.id === request.params.id)
  if (!product) return response.status(404).json({ error: 'Product not found' })
  product.active = false
  await saveDatabase(database)
  response.json({ product })
})

router.get('/orders', async (request, response) => {
  const database = await loadDatabase()
  response.json({ orders: database.orders })
})

router.patch('/orders/:id', async (request, response) => {
  const database = await loadDatabase()
  const order = database.orders.find((item) => item.id === request.params.id)
  if (!order) return response.status(404).json({ error: 'Order not found' })
  const allowedStatuses = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
  if (!allowedStatuses.includes(request.body.status)) return response.status(400).json({ error: 'Invalid order status' })
  order.status = request.body.status
  await saveDatabase(database)
  response.json({ order })
})

export default router
