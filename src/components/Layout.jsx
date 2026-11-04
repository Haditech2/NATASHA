import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import BrandMark from './BrandMark'

const NAV_ITEMS = [
  ['Home', '/'],
  ['Generate', '/generate'],
  ['Supporters', '/supporters'],
  ['Statistics', '/statistics'],
]

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <BrandMark />
            <span className="brand-copy">
              <strong>Natasha 2027</strong>
              <small>Kogi Central Deserves More</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {NAV_ITEMS.map(([label, path]) => (
              <NavLink key={path} to={path} end={path === '/'}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <Link className="button button--small button--dark desktop-cta" to="/generate">
              Generate Poster
            </Link>
            <button
              className="menu-button"
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <div className="container mobile-nav-inner">
              {NAV_ITEMS.map(([label, path]) => (
                <NavLink key={path} to={path} end={path === '/'}>
                  {label}
                </NavLink>
              ))}
              <Link className="button button--green mobile-nav-cta" to="/generate">
                Generate Poster
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <nav className="footer-nav" aria-label="Footer navigation">
              {NAV_ITEMS.map(([label, path]) => (
                <Link key={path} to={path}>{label}</Link>
              ))}
            </nav>
            <p>© 2026 Natasha 2027. All rights reserved.</p>
            <p className="footer-note">A supporter poster platform for Kogi Central.</p>
          </div>
          <div className="footer-marks" aria-label="Campaign marks">
            <img src="/images/pdp-mark.svg" alt="Peoples Democratic Party" />
            <img src="/images/nigeria-mark.svg" alt="Nigeria" />
            <span className="footer-wordmark">KOGI<br /><strong>CENTRAL</strong></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
