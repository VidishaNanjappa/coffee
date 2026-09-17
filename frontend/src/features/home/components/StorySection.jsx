import { ChevronRight } from 'lucide-react'
import ScrollText from '../../../components/common/ScrollText.jsx'

function StorySection() {
  return (
    <section className="story-section reveal" id="story">
      <div className="story-image">
        <img src="https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=85" alt="Coffee farmer sorting freshly picked cherries" />
        <span className="image-caption">Madikeri, Karnataka · 2026 harvest</span>
      </div>
      <div className="story-copy">
        <span className="kicker">From the source</span>
        <h2><ScrollText>Good coffee begins with good neighbours.</ScrollText></h2>
        <p>We work directly with small family estates across Coorg. Their coffee grows slowly beneath jackfruit, silver oak, and pepper vines, building the deep sweetness that makes this region unlike anywhere else.</p>
        <p>Every bag supports careful farming, fair prices, and a landscape worth protecting.</p>
        <a href="#ritual">Read our field notes <ChevronRight size={17} /></a>
      </div>
    </section>
  )
}

export default StorySection
