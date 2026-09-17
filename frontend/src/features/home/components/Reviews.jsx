import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { useState } from 'react'

const reviews = [
  ['Ayesha R.', 'The Monsoon Morning is all toasted nuts and a soft, syrupy sweetness. It has made my daily cup feel genuinely special.'],
  ['Karthik N.', 'Finally, a coffee that carries the familiar depth of Coorg without losing its brightness. Beautifully roasted.'],
  ['Mira D.', 'I opened the bag and my kitchen smelled like chocolate and rain. The filter roast is now a permanent fixture.'],
]

function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [name, quote] = reviews[activeIndex]
  const move = (direction) => setActiveIndex((index) => (index + direction + reviews.length) % reviews.length)

  return (
    <section className="reviews-section reveal" aria-label="Customer reviews">
      <div><span className="kicker">From our table</span><h2>Notes from<br /><em>coffee people.</em></h2></div>
      <figure>
        <div className="stars" aria-label="Five star review">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill="currentColor" />)}</div>
        <blockquote>“{quote}”</blockquote>
        <figcaption>{name} <span>Verified customer</span></figcaption>
      </figure>
      <div className="review-controls">
        <button onClick={() => move(-1)} aria-label="Previous review"><ArrowLeft size={18} /></button>
        <span>{String(activeIndex + 1).padStart(2, '0')} / 03</span>
        <button onClick={() => move(1)} aria-label="Next review"><ArrowRight size={18} /></button>
      </div>
    </section>
  )
}

export default Reviews