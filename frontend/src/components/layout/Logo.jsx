import { Coffee } from 'lucide-react'
import { Link } from 'react-router-dom'

function Logo() {
  return (
    <Link className="logo" to="/" aria-label="Coorg Cup home">
      <span className="logo-mark"><Coffee size={19} strokeWidth={1.8} /></span>
      <span>COORG <b>CUP</b></span>
    </Link>
  )
}

export default Logo
