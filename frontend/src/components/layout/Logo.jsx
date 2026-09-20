import { Link } from 'react-router-dom'
import logo from '../../assets/coorg_cup_logo_min_no_bg.png'

function Logo() {
  return (
    <Link className="logo" to="/" aria-label="Coorg Cup home">
      <span className="logo-mark"><img src={logo} alt="" /></span>
    </Link>
  )
}

export default Logo
