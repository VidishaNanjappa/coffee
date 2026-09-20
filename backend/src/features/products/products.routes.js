import { Router } from 'express'
import { prisma } from '../../db/prisma.js'

const router = Router()

router.get('/', async (request, response) => {
  const products = await prisma.product.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  response.json({ products })
})

router.get('/:id', async (request, response) => {
  const product = await prisma.product.findFirst({ where: { id: request.params.id, active: true } })
  if (!product) return response.status(404).json({ error: 'Product not found' })
  response.json({ product })
})

export default router
