const stages = [
  {
    number: '01',
    title: 'Pick',
    copy: 'Only ripe crimson cherries make the morning harvest. Every branch is picked by hand beneath the shade canopy.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=85',
  },
  {
    number: '02',
    title: 'Rest',
    copy: 'The fruit is gently pulped, then rested just long enough for the sweetness inside each seed to deepen.',
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=85',
  },
  {
    number: '03',
    title: 'Sun',
    copy: 'On raised patios, the beans meet the Coorg sun. They are turned through the day and tucked away before dusk.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
  },
  {
    number: '04',
    title: 'Roast',
    copy: 'Small batches are roasted close to home, preserving the quiet spice and soft fruit of the season.',
    image: 'https://images.unsplash.com/photo-1520975958225-112042190a2c?auto=format&fit=crop&w=1200&q=85',
  },
]

function ProcessingStory() {
  return (
    <section className="processing-section" id="process">
      <div className="processing-intro reveal">
        <span className="kicker">The slow way through</span>
        <h2>From mist to<br /><em>morning ritual.</em></h2>
        <p>Nothing rushed. Nothing hidden. Follow one harvest from the estate floor to your cup.</p>
      </div>
      <div className="processing-stages">
        {stages.map((stage) => (
          <article className="process-stage reveal" key={stage.number}>
            <div className="process-stage-image">
              <img src={stage.image} loading="lazy" alt={`${stage.title} stage of the coffee process`} />
              <span>{stage.number}</span>
            </div>
            <div className="process-stage-copy">
              <h3>{stage.title}</h3>
              <p>{stage.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProcessingStory