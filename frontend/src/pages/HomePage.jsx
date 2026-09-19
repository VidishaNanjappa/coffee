import Hero from '../features/home/components/Hero.jsx'
import PromiseStrip from '../features/home/components/PromiseStrip.jsx'
import HarvestTicker from '../features/home/components/HarvestTicker.jsx'
import ExploreSection from '../features/home/components/ExploreSection.jsx'
import Reviews from '../features/home/components/Reviews.jsx'
import EstateSection from '../features/home/components/EstateSection.jsx'
import Newsletter from '../features/home/components/Newsletter.jsx'

function HomePage() {
  return (
    <>
      <Hero />
      <PromiseStrip />
      <HarvestTicker />
      <ExploreSection />
      <Reviews />
      <EstateSection />
      <Newsletter />
    </>
  )
}

export default HomePage
