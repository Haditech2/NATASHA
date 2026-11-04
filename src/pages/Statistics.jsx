import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Landmark,
  Map,
  MapPin,
  Sparkles,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import { IMAGE_PATHS, LGAS } from '../data'
import { getPosterStats, subscribeToPosters } from '../lib/posters'

export default function Statistics() {
  const [stats, setStats] = useState(() => getPosterStats())
  useEffect(() => subscribeToPosters(() => setStats(getPosterStats())), [])

  const maxCount = useMemo(() => Math.max(...Object.values(stats.byLga)), [stats])
  const wardTotal = useMemo(() => LGAS.reduce((total, lga) => total + lga.wards.length, 0), [])

  return (
    <>
      <section className="stats-hero">
        <div className="stats-hero-photo" style={{ '--stats-image': `url(${IMAGE_PATHS.navyPortrait})` }} />
        <div className="stats-hero-overlay" />
        <div className="container stats-hero-inner">
          <div>
            <span className="eyebrow eyebrow--glass"><TrendingUp size={14} /> Grassroots Mobilization Metrics</span>
            <h1>Kogi Central Statistics</h1>
            <p>Live poster activity and community coverage across all five Local Government Areas.</p>
          </div>
          <Link className="button button--light" to="/generate"><Sparkles size={17} /> Generate Poster <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="metrics-section section">
        <div className="container metrics-grid">
          <article className="metric-card">
            <span className="metric-icon metric-icon--green"><Camera size={23} /></span>
            <small>Total Posters Created</small>
            <strong>{stats.total.toLocaleString()}</strong>
            <p><TrendingUp size={14} /> {stats.generated ? `${stats.generated} created in this browser` : 'Ready for your first poster'}</p>
          </article>
          <article className="metric-card">
            <span className="metric-icon metric-icon--red"><Map size={23} /></span>
            <small>Local Governments</small>
            <strong>5 / 5</strong>
            <p><CheckCircle2 size={14} /> 100% district coverage</p>
          </article>
          <article className="metric-card">
            <span className="metric-icon metric-icon--gold"><MapPin size={23} /></span>
            <small>Electoral Wards</small>
            <strong>{wardTotal}</strong>
            <p><UsersRound size={14} /> Grassroots representation</p>
          </article>
          <article className="metric-card">
            <span className="metric-icon metric-icon--blue"><Landmark size={23} /></span>
            <small>Senatorial District</small>
            <strong>Kogi</strong>
            <p><CheckCircle2 size={14} /> Central, united, progressing</p>
          </article>
        </div>
      </section>

      <section className="lga-stats-section section">
        <div className="container section-heading section-heading--center">
          <span className="eyebrow eyebrow--green">Community engagement</span>
          <h2>Local Government Breakdown</h2>
          <p>Poster activity and ward coverage throughout Kogi Central.</p>
        </div>
        <div className="container lga-stats-grid">
          {LGAS.map((lga) => {
            const count = stats.byLga[lga.name]
            const share = (count / stats.total) * 100
            const relative = (count / maxCount) * 100
            return (
              <article className="lga-stat-card" key={lga.name}>
                <div className="lga-stat-heading">
                  <div><h3>{lga.name} LGA</h3><p>Kogi Central · {lga.wards.length} wards</p></div>
                  <span><CheckCircle2 size={20} /></span>
                </div>
                <div className="lga-stat-number"><small>Total Posters</small><strong>{count.toLocaleString()}</strong></div>
                <div className="progress-track"><span style={{ width: `${relative}%` }} /></div>
                <p className="lga-share">{share.toFixed(1)}% of district poster activity</p>
                <div className="ward-list">
                  <strong>Key wards</strong>
                  <div>
                    {lga.wards.slice(0, 6).map((ward) => <span key={ward}>{ward}</span>)}
                    {lga.wards.length > 6 && <span>+{lga.wards.length - 6} more</span>}
                  </div>
                </div>
                <Link to="/generate">Create poster in {lga.name} <ArrowRight size={14} /></Link>
              </article>
            )
          })}
        </div>
      </section>

      <section className="stats-cta">
        <div className="container stats-cta-inner">
          <div><span>Every poster adds another voice.</span><h2>Put Your Community on the Map</h2></div>
          <Link className="button button--light" to="/generate">Generate Yours <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  )
}
