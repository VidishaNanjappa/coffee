import { useState } from 'react'
import ScrollText from '../../../components/common/ScrollText.jsx'
import ProductRail from './ProductRail.jsx'

function ProductsSection({ products, onAdd }) {
  const [category, setCategory] = useState('Coffee')
  const [roast, setRoast] = useState('All')
  const categories = ['Coffee', 'Honey', 'Spices']
  const roasts = ['All', ...new Set(products.filter((product) => product.category === 'Coffee').map((product) => product.roast))]
  const categoryProducts = products.filter((product) => product.category === category)
  const visibleProducts = category === 'Coffee' && roast !== 'All'
    ? categoryProducts.filter((product) => product.roast === roast)
    : categoryProducts

  return (
    <section className="products-section reveal" id="coffee">
      <div className="section-heading">
        <div><span className="kicker">The current harvest</span><h2><ScrollText>Meet your morning cup.</ScrollText></h2></div>
        <p>Coffee is our first language. Explore the small-batch honey and estate spices we bring home from the same hills.</p>
      </div>
      <div className="product-categories" aria-label="Shop by category">
        {categories.map((item) => <button className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setRoast('All') }} key={item}>{item}</button>)}
      </div>
      {category === 'Coffee' && <div className="roast-filters" aria-label="Filter coffee by roast">
        {roasts.map((item) => <button className={roast === item ? 'active' : ''} onClick={() => setRoast(item)} key={item}>{item}</button>)}
      </div>}
      <div className="rail-meta"><span>Swipe to explore the harvest</span><span className="rail-arrow">← &nbsp; →</span></div>
      <ProductRail products={visibleProducts} onAdd={onAdd} />
    </section>
  )
}

export default ProductsSection
