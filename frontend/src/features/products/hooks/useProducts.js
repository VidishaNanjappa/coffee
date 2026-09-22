import { useEffect, useState } from 'react'
import { fetchProducts } from '../../../api/productsApi.js'
import { products as fallbackProducts } from '../data/products.js'
import cardamomImage from '../../../assets/cardamom.jpg'
import pepperImage from '../../../assets/pepper.jpg'
import honeyImage from '../../../assets/honey.jpg'

// Bundled photos for products whose remote (Unsplash) images are unreliable or removed.
const localImages = {
  'spice-cardamon': cardamomImage,
  'spice-black-pepper': pepperImage,
  'honey-forest-honey': honeyImage,
}

function withLocalImages(items) {
  return items.map((item) => (localImages[item.id] ? { ...item, image: localImages[item.id] } : item))
}

export function useProducts() {
  // Seed with the built-in catalog so the shop renders instantly, even during a backend cold start.
  const [products, setProducts] = useState(fallbackProducts)

  useEffect(() => {
    let active = true
    fetchProducts()
      .then((result) => { if (active && result.products?.length) setProducts(withLocalImages(result.products)) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return { products }
}
