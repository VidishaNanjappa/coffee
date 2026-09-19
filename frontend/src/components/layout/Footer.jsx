import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

function Footer() {
  return (
    <footer>
      <Logo />
      <p>Born in the hills. Roasted for everywhere.</p>
      <div className="footer-links">
        <Link to="/shop">Shop</Link>
        <Link to="/story">Story</Link>
        <a href="mailto:hello@coorgcup.in">Contact</a>
      </div>
      <span>© 2026 Coorg Cup</span>
    </footer>
  )
}

export default Footer
