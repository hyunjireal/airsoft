import { NavLink, useLocation } from 'react-router-dom'
import gaiImage from '../asset/images/gai.png'

const items = [
  { to: '/home', label: '홈' },
  { to: '/match', label: '매치' },
  { to: '/media', label: '미디어' },
  { to: '/community', label: '커뮤니티' },
]

export function BottomNav() {
  const location = useLocation()
  const pathname = location.pathname
  const shouldActivateMatchTab =
    pathname === '/my/schedule' ||
    pathname === '/tournament' ||
    pathname === '/tournament/mvp-vote'
  const activeIndex = Math.max(
    items.findIndex((item) => {
      if (shouldActivateMatchTab && item.to === '/match') {
        return true
      }

      return pathname === item.to || pathname.startsWith(`${item.to}/`)
    }),
    0,
  )

  return (
    <header className="app_header">
      <nav className="app_header_left" aria-label="주요 내비게이션">
        {items.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={`app_header_menu${activeIndex === index ? ' is-active' : ''}`}
          >
            <span className="app_header_hover_circle" aria-hidden="true" />
            <span className="app_header_label_stack">
              <span className="app_header_label">{item.label}</span>
              <span className="app_header_label_hover" aria-hidden="true">
                {item.label}
              </span>
            </span>
          </NavLink>
        ))}
      </nav>

      <nav className="app_header_right" aria-label="AI 챗봇">
        <NavLink to="/chat" className="app_header_ai" aria-label="AI 챗봇">
          <img className="app_header_gai" src={gaiImage} alt="" aria-hidden="true" />
        </NavLink>
      </nav>
    </header>
  )
}
