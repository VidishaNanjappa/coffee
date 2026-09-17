import { MapPin, Sprout } from 'lucide-react'

function EstateSection() {
  return (
    <section className="estate-section reveal" id="estate">
      <div className="estate-map" role="img" aria-label="Map showing Coorg in Karnataka, India">
        <img src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1500&q=85" loading="lazy" alt="Misty green hills in Coorg" />
        <span className="map-pin"><MapPin size={20} fill="currentColor" /> Coorg</span>
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