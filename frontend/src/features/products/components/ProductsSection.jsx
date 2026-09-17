import ScrollText from '../../../components/common/ScrollText.jsx'
import ProductRail from './ProductRail.jsx'

function ProductsSection({ products, onAdd }) {
  return (
    <section className="products-section reveal" id="coffee">
      <div className="section-heading">
        <div><span className="kicker">The current harvest</span><h2><ScrollText>Meet your morning cup.</ScrollText></h2></div>
        <p>Three expressions of Coorg, each roasted to bring out what the bean does best.</p>
      </div>
      <div className="rail-meta"><span>Drag to wander through the harvest</span><span className="rail-arrow">← &nbsp; →</span></div>
      <ProductRail products={products} onAdd={onAdd} />
    </section>
  )
}

export default ProductsSection
