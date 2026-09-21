import { useOutletContext } from 'react-router-dom'
import ProductsSection from '../features/products/components/ProductsSection.jsx'
import { useProducts } from '../features/products/hooks/useProducts.js'

function ShopPage() {
  const { onAdd } = useOutletContext()
  const { products, loading, error } = useProducts()

  if (loading) return <section className="products-section"><p className="shop-status">Loading the harvest...</p></section>
  if (error) return <section className="products-section"><p className="shop-status">{error}</p></section>

  return <ProductsSection products={products} onAdd={onAdd} />
}

export default ShopPage
