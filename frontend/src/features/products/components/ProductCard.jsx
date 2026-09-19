import { Plus } from 'lucide-react'
import { resetCard, tiltCard } from '../../../utils/tilt.js'

function ProductCard({ product, index, onAdd }) {
  return (
    <article className="product-card" onPointerMove={tiltCard} onPointerLeave={resetCard}>
      <div className="product-image-wrap">
        <img src={product.image} alt={`${product.name} ${product.category.toLowerCase()}`} />
        <span className="product-tag">{product.tag}</span>
        <span className="product-index">0{index + 1}</span>
      </div>
      <div className="product-info">
        <div className="product-title-row">
          <div><span>{product.roast}</span><h3>{product.name}</h3></div>
          <strong>₹{product.price}</strong>
        </div>
        <p>{product.notes}</p>
        <div className="product-footer">
          <span>{product.format}</span>
          <button onClick={(event) => { event.stopPropagation(); onAdd(product) }} aria-label={`Add ${product.name} to bag`}>
            <Plus size={18} /> Add
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
