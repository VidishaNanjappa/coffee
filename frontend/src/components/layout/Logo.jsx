import { Coffee } from 'lucide-react'

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Coorg Cup home">
      <span className="logo-mark"><Coffee size={19} strokeWidth={1.8} /></span>
      <span>COORG <b>CUP</b></span>
    </a>
  )
}

export default Logo
