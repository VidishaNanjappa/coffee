import { prisma } from '../../db/prisma.js'

const cartInclude = { items: { include: { product: true }, orderBy: { productId: 'asc' } } }

export async function getOrCreateCart(userId) {
  return prisma.cart.upsert({ where: { userId }, create: { userId }, update: {}, include: cartInclude })
}

export async function loadCart(userId) {
  return prisma.cart.findUnique({ where: { userId }, include: cartInclude })
}

export function serializeCart(cart) {
  const items = (cart?.items ?? []).map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
    lineTotal: item.product.price * item.quantity,
  }))
  return { items, subtotal: items.reduce((total, item) => total + item.lineTotal, 0) }
}
