import { useRef, useState } from 'react'
import ProductCard from './ProductCard.jsx'

function ProductRail({ products, onAdd }) {
  const railRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ startX: 0, scrollLeft: 0 })

  function startDrag(event) {
    // Let touch devices scroll natively (with momentum); only drag with a mouse.
    if (!railRef.current || event.pointerType !== 'mouse') return
    setIsDragging(true)
    dragState.current = { startX: event.clientX, scrollLeft: railRef.current.scrollLeft }
  }

  function drag(event) {
    if (!isDragging || !railRef.current) return
    railRef.current.scrollLeft = dragState.current.scrollLeft - (event.clientX - dragState.current.startX) * 1.2
  }

  return (
    <div
      className={`product-rail ${isDragging ? 'is-dragging' : ''}`}
      ref={railRef}
      onPointerDown={startDrag}
      onPointerMove={drag}
      onPointerUp={() => setIsDragging(false)}
      onPointerCancel={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
    >
      {products.map((product, index) => (
        <ProductCard product={product} index={index} onAdd={onAdd} key={product.id} />
      ))}
    </div>
  )
}

export default ProductRail
