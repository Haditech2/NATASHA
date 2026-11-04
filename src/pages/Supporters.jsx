import { useEffect, useMemo, useState } from 'react'
import { Download, MapPin, Quote, Sparkles, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { LGAS, SUPPORTER_SAMPLES } from '../data'
import { getGeneratedPosters, subscribeToPosters } from '../lib/posters'

export default function Supporters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedLga = searchParams.get('lga') || 'All'
  const [generated, setGenerated] = useState(() => getGeneratedPosters())
  const [activePoster, setActivePoster] = useState(null)

  useEffect(() => subscribeToPosters(setGenerated), [])
  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') setActivePoster(null)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  const posters = useMemo(() => {
    const all = [...generated, ...SUPPORTER_SAMPLES]
    return selectedLga === 'All' ? all : all.filter((poster) => poster.lga === selectedLga)
  }, [generated, selectedLga])

  const setFilter = (lga) => {
    setSearchParams(lga === 'All' ? {} : { lga })
  }

  const downloadPoster = (poster) => {
    const link = document.createElement('a')
    link.href = poster.image
    link.download = `Natasha-2027-${poster.name.replace(/[^a-z0-9]+/gi, '-')}.jpg`
    link.click()
  }

  return (
    <section className="supporters-page section">
      <div className="container supporters-heading section-heading section-heading--center">
        <span className="eyebrow eyebrow--green"><Sparkles size={14} /> People-powered movement</span>
        <h1>Our Supporters</h1>
        <p>Campaign designs and voices from communities across Kogi Central.</p>
        <div className="filter-tabs" role="group" aria-label="Filter supporters by Local Government Area">
          {['All', ...LGAS.map((lga) => lga.name)].map((lga) => (
            <button
              className={selectedLga === lga ? 'active' : ''}
              key={lga}
              type="button"
              onClick={() => setFilter(lga)}
            >
              {lga}
            </button>
          ))}
        </div>
      </div>

      <div className="container supporters-grid">
        {posters.map((poster) => (
          <button className="supporter-card" key={poster.id} type="button" onClick={() => setActivePoster(poster)}>
            <span className="supporter-image">
              <img src={poster.image} alt={`${poster.name} campaign support`} />
              <span className="supporter-hover"><Quote size={20} /> View poster</span>
            </span>
            <span className="supporter-info">
              <strong>{poster.name}</strong>
              <small><MapPin size={12} /> {poster.ward ? `${poster.ward}, ` : ''}{poster.lga}</small>
            </span>
          </button>
        ))}
      </div>

      {!generated.length && (
        <div className="container samples-note">
          <p>The gallery currently includes campaign samples. Be the first to add a personalized poster from this browser.</p>
          <Link className="button button--green button--small" to="/generate">Create Your Poster</Link>
        </div>
      )}

      {activePoster && (
        <div className="poster-modal" role="dialog" aria-modal="true" aria-label={`${activePoster.name}'s poster`} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setActivePoster(null)
        }}>
          <div className="poster-modal-card">
            <button className="poster-modal-close" type="button" aria-label="Close poster" onClick={() => setActivePoster(null)}><X size={20} /></button>
            <img className="poster-modal-image" src={activePoster.image} alt={`${activePoster.name}'s campaign poster`} />
            <div className="poster-modal-copy">
              <div>
                <h2>{activePoster.name}</h2>
                <p><MapPin size={13} /> {activePoster.ward ? `${activePoster.ward} · ` : ''}{activePoster.lga} LGA</p>
              </div>
              <button className="button button--green button--small" type="button" onClick={() => downloadPoster(activePoster)}><Download size={15} /> Download</button>
            </div>
            {activePoster.quote && <blockquote>“{activePoster.quote}”</blockquote>}
          </div>
        </div>
      )}
    </section>
  )
}
