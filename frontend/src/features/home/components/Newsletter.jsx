import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import ScrollText from '../../../components/common/ScrollText.jsx'

function Newsletter() {
  const [subscribed, setSubscribed] = useState(false)

  return (
    <section className="newsletter">
      <div><span className="kicker">Postcards from the hills</span><h2><ScrollText>Fresh harvests, brew notes, no noise.</ScrollText></h2></div>
      {subscribed ? (
        <p className="success-message"><Check size={20} /> You’re on the list. See you in your inbox.</p>
      ) : (
        <form onSubmit={(event) => { event.preventDefault(); setSubscribed(true) }}>
          <label className="sr-only" htmlFor="email">Email address</label>
          <input id="email" type="email" placeholder="Your email address" required />
          <button type="submit" aria-label="Subscribe"><ArrowRight size={20} /></button>
        </form>
      )}
    </section>
  )
}

export default Newsletter
