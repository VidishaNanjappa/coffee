import { LogOut, Menu, ShoppingBag, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'

function Header({ menuOpen, onToggleMenu, itemCount, onOpenCart, isAuthenticated, user, onSignOut }) {
  return (
    <header className="site-header">
      <Logo />
      <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
        <NavLink to="/" end onClick={() => onToggleMenu(false)}>Home</NavLink>
        <NavLink to="/shop" onClick={() => onToggleMenu(false)}>Shop the harvest</NavLink>
        <NavLink to="/story" onClick={() => onToggleMenu(false)}>Our story</NavLink>
      </nav>
      <div className="header-actions">
        {isAuthenticated && (
          <button className="signout-button" onClick={onSignOut} aria-label="Sign out">
            <LogOut size={17} /><span>{user?.name ? `Sign out ${user.name.split(' ')[0]}` : 'Sign out'}</span>
          </button>
        )}
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
