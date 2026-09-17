import { useState } from 'react'
import Footer from './components/layout/Footer.jsx'
import Header from './components/layout/Header.jsx'
import CartDrawer from './features/cart/components/CartDrawer.jsx'
import { useCart } from './features/cart/hooks/useCart.js'
import { useCheckout } from './features/checkout/hooks/useCheckout.js'
import HarvestTicker from './features/home/components/HarvestTicker.jsx'
import Hero from './features/home/components/Hero.jsx'
import Newsletter from './features/home/components/Newsletter.jsx'
import PromiseStrip from './features/home/components/PromiseStrip.jsx'
import RitualSection from './features/home/components/RitualSection.jsx'
import StorySection from './features/home/components/StorySection.jsx'
import { products } from './features/products/data/products.js'
import ProductsSection from './features/products/components/ProductsSection.jsx'
import { useScrollEffects } from './hooks/useScrollEffects.js'
import './App.css'

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cart, addToCart, changeQuantity, itemCount, subtotal } = useCart()
  const checkout = useCheckout(cart)

  useScrollEffects()

  function handleAddToCart(product) {
    addToCart(product)
    setCartOpen(true)
  }

  return (
    <div id="top">
      <div className="scroll-progress" aria-hidden="true" />
      <div className="announcement"><span>Roasted fresh in Coorg</span><span className="announcement-dot">✦</span><span>Free shipping above ₹999</span></div>
      <Header menuOpen={menuOpen} onToggleMenu={setMenuOpen} itemCount={itemCount} onOpenCart={() => setCartOpen(true)} />

      <main>
        <Hero />
        <PromiseStrip />
        <HarvestTicker />
        <ProductsSection products={products} onAdd={handleAddToCart} />
        <StorySection />
        <RitualSection />
        <Newsletter />
      </main>

      <Footer />

      <CartDrawer
        cart={cart}
        cartOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        changeQuantity={changeQuantity}
        subtotal={subtotal}
        checkout={checkout}
      />
    </div>
  )
}

export default App
