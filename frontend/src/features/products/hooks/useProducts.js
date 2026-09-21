import { useEffect, useState } from 'react'
import { fetchProducts } from '../../../api/productsApi.js'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetchProducts()
      .then((result) => { if (active) setProducts(result.products) })
      .catch((fetchError) => { if (active) setError(fetchError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return { products, loading, error }
}
