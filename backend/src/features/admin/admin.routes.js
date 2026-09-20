import { Router } from 'express'
import { prisma } from '../../db/prisma.js'
import { adminRequired, authRequired } from '../../middleware/auth.js'
import { requiredText } from '../../utils/validation.js'

const router = Router()
router.use(authRequired, adminRequired)

router.get('/products', async (request, response) => {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } })
  response.json({ products })
})

router.post('/products', async (request, response) => {
  const price = Number(request.body.price)
  if (!Number.isFinite(price) || price <= 0) return response.status(400).json({ error: 'Price must be a positive number' })
  const product = await prisma.product.create({
    data: {
      name: requiredText(request.body.name, 'Name'),
      category: request.body.category || 'Coffee',
      roast: request.body.roast || '',
      notes: request.body.notes || '',
      price: Math.round(price),
      weight: request.body.weight || '250g',
      image: request.body.image || '',
      tag: request.body.tag || '',
      format: request.body.format || '',
      active: request.body.active !== false,
    },
  })
  response.status(201).json({ product })
})

router.patch('/products/:id', async (request, response) => {
  const existing = await prisma.product.findUnique({ where: { id: request.params.id } })
  if (!existing) return response.status(404).json({ error: 'Product not found' })
  if (request.body.price !== undefined && (!Number.isFinite(Number(request.body.price)) || Number(request.body.price) <= 0)) return response.status(400).json({ error: 'Price must be a positive number' })
  const data = {}
  for (const field of ['name', 'category', 'roast', 'notes', 'weight', 'image', 'tag', 'format', 'active']) {
    if (request.body[field] !== undefined) data[field] = request.body[field]
  }
  if (request.body.price !== undefined) data.price = Math.round(Number(request.body.price))
  const product = await prisma.product.update({ where: { id: request.params.id }, data })
  response.json({ product })
})

router.delete('/products/:id', async (request, response) => {
  const existing = await prisma.product.findUnique({ where: { id: request.params.id } })
  if (!existing) return response.status(404).json({ error: 'Product not found' })
  const product = await prisma.product.update({ where: { id: request.params.id }, data: { active: false } })
  response.json({ product })
})

router.get('/orders', async (request, response) => {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } })
  response.json({ orders })
})

router.patch('/orders/:id', async (request, response) => {
  const allowedStatuses = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
  if (!allowedStatuses.includes(request.body.status)) return response.status(400).json({ error: 'Invalid order status' })
  const existing = await prisma.order.findUnique({ where: { id: request.params.id } })
  if (!existing) return response.status(404).json({ error: 'Order not found' })
  const order = await prisma.order.update({ where: { id: request.params.id }, data: { status: request.body.status }, include: { items: true } })
  response.json({ order })
})

export default router
