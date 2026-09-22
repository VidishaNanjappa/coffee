import { useEffect, useState } from 'react'
import { fetchProducts } from '../../../api/productsApi.js'
import { products as fallbackProducts } from '../data/products.js'

export function useProducts() {
  // Seed with the built-in catalog so the shop renders instantly, even during a backend cold start.
  const [products, setProducts] = useState(fallbackProducts)

  useEffect(() => {
    let active = true
    fetchProducts()
      .then((result) => { if (active && result.products?.length) setProducts(result.products) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return { products }
}
