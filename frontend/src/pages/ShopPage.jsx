import { useOutletContext } from 'react-router-dom'
import ProductsSection from '../features/products/components/ProductsSection.jsx'
import { products } from '../features/products/data/products.js'

function ShopPage() {
  const { onAdd } = useOutletContext()
  return <ProductsSection products={products} onAdd={onAdd} />
}

export default ShopPage
