import type { CSSProperties } from 'react'
import { NavLink } from 'react-router-dom'
import headerComIcon from '../asset/icons/header_com.svg'
import headerHomeIcon from '../asset/icons/header_home.svg'
import headerMatchIcon from '../asset/icons/header_match.svg'
import headerMediaIcon from '../asset/icons/header_media.svg'

const items = [
  { to: '/home', label: '홈', icon: headerHomeIcon },
  { to: '/match', label: '매치', icon: headerMatchIcon },
  { to: '/creator', label: '미디어', icon: headerMediaIcon },
  { to: '/community', label: '커뮤니티', icon: headerComIcon },
]

export function BottomNav() {
  return (
    <header className="app_header">
      <nav className="bottom_nav" aria-label="주요 내비게이션">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            <span className="bottom_nav_icon" style={{ '--nav-icon': `url(${item.icon})` } as CSSProperties} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
