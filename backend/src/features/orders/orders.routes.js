import { Router } from 'express'
import { prisma } from '../../db/prisma.js'
import { authRequired } from '../../middleware/auth.js'
import { getOrCreateCart, serializeCart } from '../cart/cart.service.js'

const router = Router()

router.post('/', authRequired, async (request, response) => {
  const cart = serializeCart(await getOrCreateCart(request.auth.sub))
  if (!cart.items.length) return response.status(400).json({ error: 'Your cart is empty' })
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: request.auth.sub,
        subtotal: cart.subtotal,
        status: 'pending_payment',
        shippingAddress: request.body.shippingAddress ?? undefined,
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          })),
        },
      },
      include: { items: true },
    })
    await tx.cartItem.deleteMany({ where: { cart: { userId: request.auth.sub } } })
    return created
  })
  response.status(201).json({ order })
})

router.get('/', authRequired, async (request, response) => {
  const orders = await prisma.order.findMany({ where: { userId: request.auth.sub }, include: { items: true }, orderBy: { createdAt: 'desc' } })
  response.json({ orders })
})

export default router
