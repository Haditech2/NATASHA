import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  HeartPulse,
  ImagePlus,
  MapPin,
  Route,
  ScanSearch,
  Sparkles,
  Users,
} from 'lucide-react'
import { IMAGE_PATHS, LGAS, PRIORITIES, SUPPORTER_SAMPLES } from '../data'
import { getPosterStats, subscribeToPosters } from '../lib/posters'

function AnimatedCounter({ value }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 1100
    let frame
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setShown(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return shown.toLocaleString()
}

const stepItems = [
  {
    icon: ImagePlus,
    title: 'Add your image & details',
    text: 'Upload your photo, choose your Local Government Area and add your ward.',
  },
  {
    icon: ScanSearch,
    title: 'Preview your poster',
    text: 'Position your photo and review the personalized campaign poster instantly.',
  },
  {
    icon: Download,
    title: 'Generate & share',
    text: 'Download a high-quality poster to your device and share your support.',
  },
]

export default function Home() {
  const [stats, setStats] = useState(() => getPosterStats())
  const marqueeItems = useMemo(() => [...SUPPORTER_SAMPLES, ...SUPPORTER_SAMPLES], [])

  useEffect(() => subscribeToPosters(() => setStats(getPosterStats())), [])

  return (
    <>
      <section className="hero" style={{ '--hero-image': `url(${IMAGE_PATHS.rally})` }}>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow eyebrow--glass">Kogi Central 2027 · The Work Continues</span>
            <h1>
              Generate Your
              <br />Natasha Support
              <br />Poster Here
            </h1>
            <p>
              Join supporters across Kogi Central. Create your personalized campaign poster and
              stand for visible service, inclusive progress and purposeful representation.
            </p>
            <div className="hero-actions">
              <Link className="button button--glass button--pill" to="/generate">
                Generate My Poster <ArrowRight size={17} />
              </Link>
              <Link className="hero-text-link" to="/supporters">See the movement</Link>
            </div>
            <div className="hero-lga-list" aria-label="Kogi Central local governments">
              {LGAS.map((lga) => <span key={lga.name}><MapPin size={12} /> {lga.name}</span>)}
            </div>
          </div>

          <div className="hero-poster-wrap" aria-label="Campaign poster preview">
            <div className="poster-glow" />
            <div className="poster-card poster-card--back poster-card--left">
              <img src={IMAGE_PATHS.template} alt="" />
            </div>
            <div className="poster-card poster-card--back poster-card--right">
              <img src={IMAGE_PATHS.traditionalChair} alt="" />
            </div>
            <div className="poster-card poster-card--front">
              <img src={IMAGE_PATHS.campaignPoster} alt="Vote Senator Natasha Akpoti-Uduaghan campaign poster" />
              <span className="poster-card-label"><Sparkles size={13} /> Create yours</span>
            </div>
          </div>
        </div>
        <div className="scroll-cue">
          <span>Scroll Down</span>
          <ChevronDown size={18} />
        </div>
      </section>

      <section className="counter-section section">
        <div className="container counter-grid">
          <div>
            <span className="eyebrow eyebrow--green">A growing people-powered movement</span>
            <h2 className="mega-number"><AnimatedCounter value={stats.total} /></h2>
            <p className="counter-label">Posters Generated</p>
          </div>
          <div className="counter-details">
            <div className="live-badge"><span /> Grassroots Mobilization</div>
            <p>Support is growing across all five LGAs of Kogi Central.</p>
            <div className="mini-stat-grid">
              {LGAS.map((lga) => (
                <div className="mini-stat" key={lga.name}>
                  <strong>{stats.byLga[lga.name].toLocaleString()}+</strong>
                  <span>{lga.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="showcase-section section">
        <div className="container section-heading section-heading--center">
          <span className="eyebrow eyebrow--green">Our movement</span>
          <h2>Voices Across Kogi Central</h2>
          <p>One district, five local governments, one shared commitment to progress.</p>
        </div>

        <div className="marquee" aria-label="Campaign image gallery">
          <div className="marquee-track">
            {marqueeItems.map((item, index) => (
              <figure className="marquee-card" key={`${item.id}-${index}`}>
                <img src={item.image} alt={index < SUPPORTER_SAMPLES.length ? item.name : ''} />
                <figcaption>{item.lga}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="marquee marquee--reverse" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeItems].reverse().map((item, index) => (
              <figure className="marquee-card" key={`reverse-${item.id}-${index}`}>
                <img src={item.image} alt="" />
                <figcaption>{item.ward}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="showcase-action">
          <Link className="button button--outline button--pill" to="/supporters">
            View all supporters <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <div className="winning-banner">
        <div className="container">
          <span><Users size={28} /> Join the Winning Team</span>
        </div>
      </div>

      <section className="steps-section section">
        <div className="container steps-grid">
          <div className="steps-copy">
            <span className="eyebrow eyebrow--red">In 3 simple steps</span>
            <h2>Generate Yours</h2>
            <p className="section-lead">Your official personalized support poster is only a few clicks away.</p>
            <div className="step-list">
              {stepItems.map(({ icon: Icon, title, text }, index) => (
                <div className="step-item" key={title}>
                  <span className="step-number">{index + 1}</span>
                  <span className="step-icon"><Icon size={21} /></span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link className="button button--dark" to="/generate">
              Generate My Poster <ArrowRight size={17} />
            </Link>
          </div>

          <Link className="template-preview-link" to="/generate">
            <div className="template-preview">
              <img src={IMAGE_PATHS.template} alt="Senator Natasha campaign poster template" />
              <div className="template-photo-hint">
                <ImagePlus size={24} />
                <span>Add your image</span>
              </div>
            </div>
            <span className="template-preview-cta">Create your own poster <ArrowRight size={15} /></span>
          </Link>
        </div>
      </section>

      <section className="slogan-section">
        <div className="slogan-pattern" />
        <div className="container">
          <span>Service you can see</span>
          <h2>Progress You Can Build Upon</h2>
        </div>
      </section>

      <section className="priorities-section section">
        <div className="container">
          <div className="section-heading section-heading--center priorities-heading">
            <span className="eyebrow eyebrow--green">Kogi Central deserves more</span>
            <h2>Standing for the People</h2>
            <p>Leadership rooted in practical impact, fair opportunity and stronger communities.</p>
          </div>
          <div className="priority-grid">
            {PRIORITIES.map((priority, index) => {
              const icons = [Check, HeartPulse, Route, Users]
              const Icon = icons[index]
              return (
                <article className="priority-card" key={priority.title}>
                  <span><Icon size={23} /></span>
                  <h3>{priority.title}</h3>
                  <p>{priority.detail}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="profile-section section">
        <div className="container profile-card">
          <div className="profile-image-wrap">
            <img src={IMAGE_PATHS.traditionalFront} alt="Senator Natasha Akpoti-Uduaghan" />
          </div>
          <div className="profile-copy">
            <span className="eyebrow eyebrow--red">The work continues</span>
            <h2>Senator Natasha<br />Akpoti-Uduaghan</h2>
            <p className="profile-role">Senator representing Kogi Central Senatorial District</p>
            <p>
              This platform makes it simple for supporters across Kogi Central to create a
              personalized campaign poster and share a message of visible service, social justice,
              economic opportunity and inclusive development.
            </p>
            <div className="profile-points">
              <span><Check size={15} /> People-first representation</span>
              <span><Check size={15} /> Proven community impact</span>
            </div>
            <Link className="button button--green" to="/generate">Stand With Natasha <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
