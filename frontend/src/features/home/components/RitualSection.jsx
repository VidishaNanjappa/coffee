import ScrollText from '../../../components/common/ScrollText.jsx'

const steps = [
  { number: '01', title: 'Grind', description: '18g coffee, ground medium-fine. Think table salt.', delay: '80ms' },
  { number: '02', title: 'Bloom', description: 'Add 40ml hot water. Wait 30 seconds and breathe it in.', delay: '180ms' },
  { number: '03', title: 'Pour', description: 'Slowly add water to 280ml. Your cup is ready in 3 minutes.', delay: '280ms' },
]

function RitualSection() {
  return (
    <section className="ritual-section reveal" id="ritual">
      <div className="ritual-heading">
        <span className="kicker">A simple ritual</span>
        <h2><ScrollText>Brew it the Coorg way.</ScrollText></h2>
      </div>
      <div className="steps">
        {steps.map((step) => (
          <div className="step reveal" style={{ '--delay': step.delay }} key={step.number}>
            <span>{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RitualSection
