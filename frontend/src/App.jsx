import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, ChevronRight, Coffee, Leaf, Menu, Minus, Plus, ShoppingBag, Sparkles, X } from 'lucide-react'
import './App.css'

const products = [
  { id: 1, name: 'Monsoon Morning', roast: 'Medium roast', notes: 'Cocoa · Hazelnut · Jaggery', price: 620, weight: '250g', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85', tag: 'Bestseller' },
  { id: 2, name: 'Estate No. 7', roast: 'Light roast', notes: 'Orange · Honey · Almond', price: 680, weight: '250g', image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=900&q=85', tag: 'Single origin' },
  { id: 3, name: 'Midnight Filter', roast: 'Dark roast', notes: 'Dark chocolate · Spice · Smoke', price: 590, weight: '250g', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85', tag: 'South Indian filter' },
]

function Logo() {
  return <a className="logo" href="#top" aria-label="Coorg Cup home"><span className="logo-mark"><Coffee size={19} strokeWidth={1.8} /></span><span>COORG <b>CUP</b></span></a>
}

function useScrollEffects() {
  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14 })

    revealItems.forEach((item) => observer.observe(item))
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      document.documentElement.style.setProperty('--scroll-progress', progress)
      document.documentElement.style.setProperty('--hero-shift', `${Math.min(window.scrollY * 0.18, 130)}px`)
      document.documentElement.style.setProperty('--story-shift', `${Math.max(-window.scrollY * 0.05, -45)}px`)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])
}

function tiltCard(event) {
  const card = event.currentTarget
  const bounds = card.getBoundingClientRect()
  card.style.setProperty('--tilt-x', `${((event.clientY - bounds.top) / bounds.height - 0.5) * -4}deg`)
  card.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 5}deg`)
}

function resetCard(event) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg')
  event.currentTarget.style.setProperty('--tilt-y', '0deg')
}

function ScrollText({ children }) {
  const textRef = useRef(null)
  const words = children.split(' ')

  useEffect(() => {
    const text = textRef.current
    if (!text) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        text.classList.add('is-visible')
        observer.disconnect()
      }
    }, { threshold: 0.4 })
    observer.observe(text)
    return () => observer.disconnect()
  }, [])

  return <span className="scroll-text" ref={textRef}>{words.map((word, index) => <span className="scroll-word" style={{ '--word-delay': `${index * 90}ms` }} key={`${word}-${index}`}>{word}{index < words.length - 1 ? '\u00a0' : ''}</span>)}</span>
}

function ProductRail({ products, addToCart }) {
  const railRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ startX: 0, scrollLeft: 0 })

  function startDrag(event) {
    if (!railRef.current) return
    setIsDragging(true)
    dragState.current = { startX: event.clientX, scrollLeft: railRef.current.scrollLeft }
  }

  function drag(event) {
    if (!isDragging || !railRef.current) return
    railRef.current.scrollLeft = dragState.current.scrollLeft - (event.clientX - dragState.current.startX) * 1.2
  }

  return <div className={`product-rail ${isDragging ? 'is-dragging' : ''}`} ref={railRef} onPointerDown={startDrag} onPointerMove={drag} onPointerUp={() => setIsDragging(false)} onPointerCancel={() => setIsDragging(false)} onPointerLeave={() => setIsDragging(false)}>
    {products.map((product, index) => (
      <article className="product-card reveal" style={{ '--delay': `${index * 110}ms` }} onPointerMove={tiltCard} onPointerLeave={resetCard} key={product.id}>
        <div className="product-image-wrap"><img src={product.image} alt={`${product.name} coffee`} /><span className="product-tag">{product.tag}</span><span className="product-index">0{index + 1}</span></div>
        <div className="product-info">
          <div className="product-title-row"><div><span>{product.roast}</span><h3>{product.name}</h3></div><strong>₹{product.price}</strong></div>
          <p>{product.notes}</p>
          <div className="product-footer"><span>{product.weight} · Whole bean</span><button onClick={(event) => { event.stopPropagation(); addToCart(product) }} aria-label={`Add ${product.name} to bag`}><Plus size={18} /> Add</button></div>
        </div>
      </article>
    ))}
  </div>
}

function App() {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  useScrollEffects()

  function addToCart(product) {
    setCart((current) => {
      const match = current.find((item) => item.id === product.id)
      return match
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  function changeQuantity(id, amount) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0))
  }

  return (
    <div id="top">
      <div className="scroll-progress" aria-hidden="true" />
      <div className="announcement"><span>Roasted fresh in Coorg</span><span className="announcement-dot">✦</span><span>Free shipping above ₹999</span></div>
      <header className="site-header">
        <Logo />
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
          <a href="#coffee" onClick={() => setMenuOpen(false)}>Shop coffee</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a><a href="#ritual" onClick={() => setMenuOpen(false)}>Brew guide</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${itemCount} items`}><ShoppingBag size={19} /><span>Bag</span><b>{itemCount}</b></button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <img className="hero-image" src="https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=2000&q=90" alt="Coffee cherries growing on a lush plantation" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="eyebrow"><Leaf size={15} /> Grown under the Coorg canopy</span>
            <h1>Wild hills.<br /><em>Remarkable coffee.</em></h1>
            <p>Shade-grown, hand-picked, and roasted in small batches. Coffee with the character of the Western Ghats.</p>
            <a className="primary-button" href="#coffee">Find your roast <ArrowRight size={18} /></a>
          </div>
          <div className="hero-detail"><span>12.3375° N</span><span>75.8069° E</span><span>COORG, INDIA</span></div>
          <div className="scroll-cue"><span>Scroll to explore</span><i /></div>
        </section>

        <section className="promise-strip" aria-label="Our promises">
          <div><Sparkles size={19} /><span><b>Small-batch roasted</b> every Tuesday</span></div>
          <div><Leaf size={19} /><span><b>100% Arabica</b> from family estates</span></div>
          <div><Coffee size={19} /><span><b>Roasted to order</b> for peak flavour</span></div>
        </section>

        <div className="harvest-ticker" aria-label="Coffee notes"><div><span>COORG / 12.3375° N</span><b>✦</b><span>SMALL BATCH / EVERY TUESDAY</span><b>✦</b><span>SHADE GROWN / HAND PICKED</span><b>✦</b><span>COORG / 12.3375° N</span></div></div>

        <section className="products-section reveal" id="coffee">
          <div className="section-heading"><div><span className="kicker">The current harvest</span><h2><ScrollText>Meet your morning cup.</ScrollText></h2></div><p>Three expressions of Coorg, each roasted to bring out what the bean does best.</p></div>
          <div className="rail-meta"><span>Drag to wander through the harvest</span><span className="rail-arrow">← &nbsp; →</span></div>
          <ProductRail products={products} addToCart={addToCart} />
        </section>

        <section className="story-section reveal" id="story">
          <div className="story-image"><img src="https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=85" alt="Coffee farmer sorting freshly picked cherries" /><span className="image-caption">Madikeri, Karnataka · 2026 harvest</span></div>
          <div className="story-copy"><span className="kicker">From the source</span><h2><ScrollText>Good coffee begins with good neighbours.</ScrollText></h2><p>We work directly with small family estates across Coorg. Their coffee grows slowly beneath jackfruit, silver oak, and pepper vines, building the deep sweetness that makes this region unlike anywhere else.</p><p>Every bag supports careful farming, fair prices, and a landscape worth protecting.</p><a href="#ritual">Read our field notes <ChevronRight size={17} /></a></div>
        </section>

        <section className="ritual-section reveal" id="ritual">
          <div className="ritual-heading"><span className="kicker">A simple ritual</span><h2><ScrollText>Brew it the Coorg way.</ScrollText></h2></div>
          <div className="steps"><div className="step reveal" style={{ '--delay': '80ms' }}><span>01</span><h3>Grind</h3><p>18g coffee, ground medium-fine. Think table salt.</p></div><div className="step reveal" style={{ '--delay': '180ms' }}><span>02</span><h3>Bloom</h3><p>Add 40ml hot water. Wait 30 seconds and breathe it in.</p></div><div className="step reveal" style={{ '--delay': '280ms' }}><span>03</span><h3>Pour</h3><p>Slowly add water to 280ml. Your cup is ready in 3 minutes.</p></div></div>
        </section>

        <section className="newsletter">
          <div><span className="kicker">Postcards from the hills</span><h2><ScrollText>Fresh harvests, brew notes, no noise.</ScrollText></h2></div>
          {subscribed ? <p className="success-message"><Check size={20} /> You’re on the list. See you in your inbox.</p> : <form onSubmit={(event) => { event.preventDefault(); setSubscribed(true) }}><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Your email address" required /><button type="submit" aria-label="Subscribe"><ArrowRight size={20} /></button></form>}
        </section>
      </main>

      <footer><Logo /><p>Born in the hills. Roasted for everywhere.</p><div className="footer-links"><a href="#coffee">Shop</a><a href="#story">Story</a><a href="mailto:hello@coorgcup.in">Contact</a></div><span>© 2026 Coorg Cup</span></footer>

      <button className={cartOpen ? 'cart-backdrop visible' : 'cart-backdrop'} onClick={() => setCartOpen(false)} aria-label="Close shopping bag" />
      <aside className={cartOpen ? 'cart-drawer open' : 'cart-drawer'} aria-label="Shopping bag" aria-hidden={!cartOpen}>
        <div className="cart-header"><div><span className="kicker">Your selection</span><h2>Shopping bag</h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button></div>
        <div className="cart-content">
          {cart.length === 0 ? <div className="empty-cart"><Coffee size={34} strokeWidth={1.4} /><h3>Your bag is empty</h3><p>Good mornings are one bag away.</p><button onClick={() => setCartOpen(false)}>Explore coffee</button></div> : cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div><h3>{item.name}</h3><span>{item.weight} · Whole bean</span><strong>₹{item.price}</strong></div><div className="quantity-control"><button onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}><Plus size={14} /></button></div></div>)}
        </div>
        {cart.length > 0 && <div className="cart-summary"><div><span>Subtotal</span><strong>₹{subtotal}</strong></div><p>Shipping calculated at checkout.</p><button>Checkout <ArrowRight size={18} /></button></div>}
      </aside>
    </div>
  )
}

export default App
