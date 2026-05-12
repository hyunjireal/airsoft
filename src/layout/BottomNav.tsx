import type { CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import headerComIcon from '../asset/icons/header_com.svg'
import headerHomeIcon from '../asset/icons/header_home.svg'
import headerMatchIcon from '../asset/icons/header_match.svg'
import headerMediaIcon from '../asset/icons/header_media.svg'
import gaiImage from '../asset/images/gai.png'

const items = [
  { to: '/home', label: '홈', icon: headerHomeIcon },
  { to: '/match', label: '매치', icon: headerMatchIcon },
  { to: '/media', label: '미디어', icon: headerMediaIcon },
  { to: '/community', label: '커뮤니티', icon: headerComIcon },
]

export function BottomNav() {
  const location = useLocation()
  const activeIndex = Math.max(
    items.findIndex((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)),
    0,
  )
  const navStyle = { '--active-index': activeIndex } as CSSProperties

  return (
    <header className="app_header">
      <nav className="app_header_left" style={navStyle} aria-label="주요 내비게이션">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className="app_header_menu">
            <img className="app_header_icon" src={item.icon} alt="" aria-hidden="true" />
            <span>{item.label}</span>
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
