import { BASE_POSTER_COUNT, LGAS } from '../data'

const POSTERS_KEY = 'natasha-2027-posters'

export function getGeneratedPosters() {
  try {
    const value = JSON.parse(localStorage.getItem(POSTERS_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function saveGeneratedPoster(poster) {
  const posters = [poster, ...getGeneratedPosters()].slice(0, 12)
  try {
    localStorage.setItem(POSTERS_KEY, JSON.stringify(posters))
  } catch {
    // Storage can be full when several large images are retained. Keep the latest three.
    try {
      localStorage.setItem(POSTERS_KEY, JSON.stringify(posters.slice(0, 3)))
    } catch {
      // The download still works even when private browsing blocks persistence.
    }
  }
  window.dispatchEvent(new Event('natasha-posters-updated'))
  return posters
}

export function getPosterStats() {
  const posters = getGeneratedPosters()
  const byLga = Object.fromEntries(LGAS.map((lga) => [lga.name, lga.seedCount]))

  posters.forEach((poster) => {
    if (poster.lga && Object.hasOwn(byLga, poster.lga)) byLga[poster.lga] += 1
  })

  return {
    total: BASE_POSTER_COUNT + posters.length,
    generated: posters.length,
    byLga,
  }
}

export function subscribeToPosters(callback) {
  const handler = () => callback(getGeneratedPosters())
  window.addEventListener('storage', handler)
  window.addEventListener('natasha-posters-updated', handler)
  return () => {
    window.removeEventListener('storage', handler)
    window.removeEventListener('natasha-posters-updated', handler)
  }
}
