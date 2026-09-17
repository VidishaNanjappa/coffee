import { Menu, ShoppingBag, X } from 'lucide-react'
import Logo from './Logo.jsx'

function Header({ menuOpen, onToggleMenu, itemCount, onOpenCart }) {
  return (
    <header className="site-header">
      <Logo />
      <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
        <a href="#coffee" onClick={() => onToggleMenu(false)}>Shop coffee</a>
        <a href="#story" onClick={() => onToggleMenu(false)}>Our story</a>
        <a href="#ritual" onClick={() => onToggleMenu(false)}>Brew guide</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button mobile-menu" onClick={() => onToggleMenu(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <button className="cart-button" onClick={onOpenCart} aria-label={`Open cart with ${itemCount} items`}>
          <ShoppingBag size={19} /><span>Bag</span><b>{itemCount}</b>
        </button>
      </div>
    </header>
  )
}

export default Header
