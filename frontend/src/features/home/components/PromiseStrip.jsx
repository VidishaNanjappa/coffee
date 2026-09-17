import { Coffee, Leaf, Sparkles } from 'lucide-react'

function PromiseStrip() {
  return (
    <section className="promise-strip" aria-label="Our promises">
      <div><Sparkles size={19} /><span><b>Small-batch roasted</b> every Tuesday</span></div>
      <div><Leaf size={19} /><span><b>100% Arabica</b> from family estates</span></div>
      <div><Coffee size={19} /><span><b>Roasted to order</b> for peak flavour</span></div>
    </section>
  )
}

export default PromiseStrip
