import { ArrowRight, Coffee, Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import CheckoutAuthForm from '../../checkout/components/CheckoutAuthForm.jsx'

function CartDrawer({ cart, cartOpen, onClose, changeQuantity, subtotal, checkout }) {
  const [showAuth, setShowAuth] = useState(false)

  function startCheckout() {
    setShowAuth(!checkout.isAuthenticated)
    checkout.handleCheckout()
  }

  return (
    <>
      <button className={cartOpen ? 'cart-backdrop visible' : 'cart-backdrop'} onClick={onClose} aria-label="Close shopping bag" />
      <aside className={cartOpen ? 'cart-drawer open' : 'cart-drawer'} aria-label="Shopping bag" aria-hidden={!cartOpen}>
        <div className="cart-header">
          <div><span className="kicker">Your selection</span><h2>Shopping bag</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close cart"><X /></button>
        </div>
        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <Coffee size={34} strokeWidth={1.4} />
              <h3>Your bag is empty</h3>
              <p>Good mornings are one bag away.</p>
              <button onClick={onClose}>Explore coffee</button>
            </div>
          ) : cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={`${item.name} coffee bag`} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <span>{item.weight} · Whole bean · {item.roast}</span>
                <small>{item.notes}</small>
                <strong>₹{item.price * item.quantity}</strong>
              </div>
              <div className="quantity-control">
                <button onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}><Minus size={14} /></button>
                <span aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                <button onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}><Plus size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-summary">
            <div><span>Subtotal</span><strong>₹{subtotal}</strong></div>
            <p>Shipping calculated at checkout.</p>
            {checkout.checkoutMessage && <p className="checkout-message" aria-live="polite">{checkout.checkoutMessage}</p>}
            <button onClick={startCheckout}>Checkout <ArrowRight size={18} /></button>
            {showAuth && !checkout.isAuthenticated && <CheckoutAuthForm checkout={checkout} />}
          </div>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
