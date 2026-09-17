import { Router } from 'express'
import { loadDatabase } from '../../db/store.js'

const router = Router()

router.get('/', async (request, response) => {
  const database = await loadDatabase()
  const products = database.products.filter((product) => product.active !== false)
  response.json({ products })
})

router.get('/:id', async (request, response) => {
  const database = await loadDatabase()
  const product = database.products.find((item) => item.id === request.params.id && item.active !== false)
  if (!product) return response.status(404).json({ error: 'Product not found' })
  response.json({ product })
})

export default router
