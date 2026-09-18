import coffeeBlossom from '../../../assets/coffee_blossom.jpg'
import coffeeDrying from '../../../assets/coffee_drying.jpg'
import coffeeGrinding from '../../../assets/coffee_grinding.avif'
import coffeePicking from '../../../assets/coffee_picking.jpg'
import coffeePulping from '../../../assets/coffee_pulping.avif'
import coffeeSorting from '../../../assets/coffee_sorting.jpg'

const stages = [
  {
    number: '01',
    title: 'Blossom',
    copy: 'After the blossom showers, coffee branches flower white. Each bloom slowly becomes a green cherry, then ripens to red.',
    image: coffeeBlossom,
  },
  {
    number: '02',
    title: 'Pick',
    copy: 'Ripe cherries are selectively hand-picked. On one branch, red fruit and unripe green cherries can grow side by side.',
    image: coffeePicking,
  },
  {
    number: '03',
    title: 'Sort & clean',
    copy: 'Leaves, twigs, damaged fruit, and unripe cherries are removed, leaving only the cleanest harvest for processing.',
    image: coffeeSorting,
  },
  {
    number: '04',
    title: 'Process',
    copy: 'Lots follow their character: naturally dried in fruit, washed after pulping and fermentation, or honey processed with some mucilage intact.',
    image: coffeePulping,
  },
  {
    number: '05',
    title: 'Dry & cure',
    copy: 'Coffee dries slowly on patios or raised beds, turned often for an even finish. Once dry, the parchment or husk is hulled away and green coffee is graded.',
    image: coffeeDrying,
  },
  {
    number: '06',
    title: 'Roast & grind',
    copy: 'Small batches are roasted close to home, then freshly ground to match the brew method and become a fragrant cup.',
    image: coffeeGrinding,
  },
]

function ProcessingStory() {
  return (
    <section className="processing-section" id="process">
      <div className="processing-intro reveal">
        <span className="kicker">The slow way through</span>
        <h2>From mist to<br /><em>morning ritual.</em></h2>
        <p>From blossom showers to the final grind, follow an estate harvest through every careful stage.</p>
      </div>
      <div className="processing-stages">
        {stages.map((stage, index) => (
          <article className={`process-stage reveal ${index % 2 ? 'process-stage-reverse' : ''}`} key={stage.number}>
            <div className="process-stage-image">
              <img src={stage.image} loading="lazy" alt={`${stage.title} stage of the coffee process`} />
            </div>
            <div className="process-stage-copy">
              <span className="process-number">{stage.number}</span>
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