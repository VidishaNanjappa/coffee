import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import CartDrawer from '../../features/cart/components/CartDrawer.jsx'
import { useCart } from '../../features/cart/hooks/useCart.js'
import { useCheckout } from '../../features/checkout/hooks/useCheckout.js'
import { useScrollEffects } from '../../hooks/useScrollEffects.js'

function Layout() {
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cart, addToCart, changeQuantity, itemCount, subtotal } = useCart()
  const checkout = useCheckout(cart)
  const location = useLocation()

  useScrollEffects(location.pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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
        <div className="page" key={location.pathname}>
          <Outlet context={{ onAdd: handleAddToCart }} />
        </div>
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

export default Layout
