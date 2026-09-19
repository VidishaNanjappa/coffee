import { ArrowRight, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero-section">
      <img className="hero-image" src="https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=2000&q=90" alt="Coffee cherries growing on a lush plantation" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="eyebrow"><Leaf size={15} /> Grown under the Coorg canopy</span>
        <h1>Wild hills.<br /><em>Remarkable coffee.</em></h1>
        <p>Shade-grown, hand-picked, and roasted in small batches. Coffee with the character of the Western Ghats.</p>
        <Link className="primary-button" to="/shop">Find your roast <ArrowRight size={18} /></Link>
      </div>
      <div className="hero-detail"><span>12.3375° N</span><span>75.8069° E</span><span>COORG, INDIA</span></div>
      <div className="scroll-cue"><span>Scroll to explore</span><i /></div>
    </section>
  )
}

export default Hero
