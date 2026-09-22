import { useEffect, useState } from 'react'
import { fetchProducts } from '../../../api/productsApi.js'
import { products as fallbackProducts } from '../data/products.js'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchProducts()
      .then((result) => { if (active) setProducts(result.products) })
      .catch(() => {
        // Backend unreachable (e.g. free-tier cold start): show the built-in catalog instead of an empty shop.
        if (active) setProducts(fallbackProducts)
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return { products, loading }
}
