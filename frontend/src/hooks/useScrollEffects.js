import { useEffect } from 'react'

export function useScrollEffects(key) {
  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14 })

    revealItems.forEach((item) => observer.observe(item))
    let frameId = 0
    const updateProgress = () => {
      if (frameId) return
      frameId = requestAnimationFrame(() => {
        frameId = 0
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0
        document.documentElement.style.setProperty('--scroll-progress', progress)
        document.documentElement.style.setProperty('--hero-shift', `${Math.min(window.scrollY * 0.18, 130)}px`)
        document.documentElement.style.setProperty('--story-shift', `${Math.max(-window.scrollY * 0.05, -45)}px`)
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', updateProgress)
    }
  }, [key])
}
