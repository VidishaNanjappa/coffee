import { Router } from 'express'
import { prisma } from '../../db/prisma.js'
import { authRequired } from '../../middleware/auth.js'
import { getOrCreateCart, loadCart, serializeCart } from './cart.service.js'

const router = Router()

router.get('/', authRequired, async (request, response) => {
  const cart = await getOrCreateCart(request.auth.sub)
  response.json({ cart: serializeCart(cart) })
})

router.post('/items', authRequired, async (request, response) => {
  const product = await prisma.product.findFirst({ where: { id: request.body.productId, active: true } })
  const quantity = Number(request.body.quantity || 1)
  if (!product) return response.status(404).json({ error: 'Product not found' })
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return response.status(400).json({ error: 'Quantity must be an integer between 1 and 20' })
  const cart = await getOrCreateCart(request.auth.sub)
  const existing = cart.items.find((item) => item.productId === product.id)
  const nextQuantity = existing ? Math.min(existing.quantity + quantity, 20) : quantity
  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    create: { cartId: cart.id, productId: product.id, quantity: nextQuantity },
    update: { quantity: nextQuantity },
  })
  response.status(201).json({ cart: serializeCart(await loadCart(request.auth.sub)) })
})

router.patch('/items/:productId', authRequired, async (request, response) => {
  const quantity = Number(request.body.quantity)
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 20) return response.status(400).json({ error: 'Quantity must be an integer between 0 and 20' })
  const cart = await getOrCreateCart(request.auth.sub)
  const exists = cart.items.some((candidate) => candidate.productId === request.params.productId)
  if (!exists) return response.status(404).json({ error: 'Cart item not found' })
  if (quantity === 0) await prisma.cartItem.delete({ where: { cartId_productId: { cartId: cart.id, productId: request.params.productId } } })
  else await prisma.cartItem.update({ where: { cartId_productId: { cartId: cart.id, productId: request.params.productId } }, data: { quantity } })
  response.json({ cart: serializeCart(await loadCart(request.auth.sub)) })
})

router.delete('/items/:productId', authRequired, async (request, response) => {
  const cart = await getOrCreateCart(request.auth.sub)
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: request.params.productId } })
  response.json({ cart: serializeCart(await loadCart(request.auth.sub)) })
})

router.delete('/', authRequired, async (request, response) => {
  const cart = await getOrCreateCart(request.auth.sub)
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  response.json({ cart: serializeCart(await loadCart(request.auth.sub)) })
})

export default router
