import { Sprout } from 'lucide-react'

function EstateSection() {
  return (
    <section className="estate-section reveal" id="estate">
      <div className="estate-map">
        <iframe
          title="Map of Somwarpet, Coorg, Karnataka"
          src="https://www.google.com/maps?q=12.5956,75.8514&z=12&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="estate-copy">
        <span className="kicker"><Sprout size={15} /> 12.3375 N, 75.8069 E</span>
        <h2>One mountain range.<br /><em>Many small miracles.</em></h2>
        <p>Our lots begin in the high, rain-fed estates around Madikeri, where coffee shares the forest with silver oak, wild pepper, and birdsong.</p>
        <div className="estate-stats">
          <span><b>1,050m</b> altitude</span>
          <span><b>42</b> grower families</span>
          <span><b>100%</b> shade grown</span>
        </div>
      </div>
    </section>
  )
}

export default EstateSection