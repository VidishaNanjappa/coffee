export function tiltCard(event) {
  const card = event.currentTarget
  const bounds = card.getBoundingClientRect()
  card.style.setProperty('--tilt-x', `${((event.clientY - bounds.top) / bounds.height - 0.5) * -4}deg`)
  card.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 5}deg`)
}

export function resetCard(event) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg')
  event.currentTarget.style.setProperty('--tilt-y', '0deg')
}
