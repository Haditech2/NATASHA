import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Download, Home, Share2, Sparkles } from 'lucide-react'

export default function GenerateSuccess() {
  const location = useLocation()
  const [shared, setShared] = useState(false)
  const storedPoster = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('natasha-last-poster') || 'null')
    } catch {
      return null
    }
  }, [])
  const poster = location.state?.poster || storedPoster
  const downloadUrl = location.state?.downloadUrl || poster?.image

  const downloadAgain = () => {
    if (!downloadUrl) return
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `Natasha-2027-${poster?.lga || 'Support'}-Poster.jpg`
    link.click()
  }

  const sharePoster = async () => {
    if (!poster) return
    try {
      if (navigator.share) {
        const response = await fetch(poster.image)
        const blob = await response.blob()
        const file = new File([blob], 'Natasha-2027-Poster.jpg', { type: 'image/jpeg' })
        await navigator.share({
          title: 'My Natasha 2027 Support Poster',
          text: 'Service you can see. Progress you can build upon.',
          files: navigator.canShare?.({ files: [file] }) ? [file] : undefined,
        })
      } else {
        await navigator.clipboard.writeText(window.location.origin)
        setShared(true)
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setShared(true)
    }
  }

  if (!poster) {
    return (
      <section className="empty-state section">
        <div className="container empty-state-card">
          <Sparkles size={34} />
          <h1>Create Your Poster</h1>
          <p>No generated poster was found in this browser.</p>
          <Link className="button button--green" to="/generate">Open Poster Generator</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="success-page section">
      <div className="confetti-dots" aria-hidden="true" />
      <div className="container success-grid">
        <div className="success-preview">
          <img src={poster.image} alt={`${poster.name}'s Natasha 2027 campaign poster`} />
        </div>
        <div className="success-copy">
          <span className="success-icon"><CheckCircle2 size={34} /></span>
          <span className="eyebrow eyebrow--green">Poster ready</span>
          <h1>You’re Part of the Movement!</h1>
          <p>
            Your personalized campaign poster has been generated and downloaded. Share it with
            family, friends and your community.
          </p>
          <div className="success-meta">
            <span><strong>{poster.name}</strong>Supporter</span>
            <span><strong>{poster.lga}</strong>{poster.ward || 'Kogi Central'}</span>
          </div>
          <div className="success-actions">
            <button className="button button--green" type="button" onClick={downloadAgain}><Download size={17} /> Download Again</button>
            <button className="button button--outline" type="button" onClick={sharePoster}><Share2 size={17} /> {shared ? 'Link Copied' : 'Share Poster'}</button>
          </div>
          <div className="success-links">
            <Link to="/generate"><Sparkles size={15} /> Create another</Link>
            <Link to="/"><Home size={15} /> Back home</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
