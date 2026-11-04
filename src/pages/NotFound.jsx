import { ArrowLeft, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="empty-state section">
      <div className="container empty-state-card">
        <span className="not-found-number">404</span>
        <h1>Page Not Found</h1>
        <p>The page you requested is not part of this campaign site.</p>
        <Link className="button button--green" to="/"><ArrowLeft size={16} /> Return Home <Home size={16} /></Link>
      </div>
    </section>
  )
}
