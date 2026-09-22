import { useOutletContext } from 'react-router-dom'
import ProductsSection from '../features/products/components/ProductsSection.jsx'
import { useProducts } from '../features/products/hooks/useProducts.js'

function ShopPage() {
  const { onAdd } = useOutletContext()
  const { products } = useProducts()

  return <ProductsSection products={products} onAdd={onAdd} />
}

export default ShopPage
