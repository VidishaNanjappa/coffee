import { useEffect, useRef } from 'react'

function ScrollText({ children }) {
  const textRef = useRef(null)
  const words = children.split(' ')

  useEffect(() => {
    const text = textRef.current
    if (!text) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        text.classList.add('is-visible')
        observer.disconnect()
      }
    }, { threshold: 0.4 })
    observer.observe(text)
    return () => observer.disconnect()
  }, [])

  return (
    <span className="scroll-text" ref={textRef}>
      {words.map((word, index) => (
        <span className="scroll-word" style={{ '--word-delay': `${index * 90}ms` }} key={`${word}-${index}`}>
          {word}{index < words.length - 1 ? '\u00a0' : ''}
        </span>
      ))}
    </span>
  )
}

export default ScrollText
