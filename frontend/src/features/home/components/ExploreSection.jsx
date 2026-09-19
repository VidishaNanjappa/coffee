import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ScrollText from '../../../components/common/ScrollText.jsx'

const cards = [
  {
    to: '/shop',
    kicker: 'The current harvest',
    title: 'Shop the estate',
    text: 'Small-batch coffee, wildflower honey, and hill-grown spices — ready to ship.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=85',
    cta: 'Browse the harvest',
  },
  {
    to: '/story',
    kicker: 'From the source',
    title: 'Our story',
    text: 'Meet the families, the shade canopy, and the slow craft behind every cup.',
    image: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=85',
    cta: 'Walk the estate',
  },
]

function ExploreSection() {
  return (
    <section className="explore-section reveal">
      <div className="section-heading">
        <div><span className="kicker">Where to next</span><h2><ScrollText>Two ways in.</ScrollText></h2></div>
        <p>Start with the coffee or start with the story — both lead back to the same hills.</p>
      </div>
      <div className="explore-grid">
        {cards.map((card) => (
          <Link className="explore-card" to={card.to} key={card.to}>
            <div className="explore-card-image"><img src={card.image} alt={card.title} /></div>
            <div className="explore-card-body">
              <span className="kicker">{card.kicker}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <span className="explore-card-cta">{card.cta} <ArrowRight size={16} /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ExploreSection
