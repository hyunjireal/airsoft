import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import headerComIcon from '../asset/icons/header_com.svg'
import headerHomeIcon from '../asset/icons/header_home.svg'
import headerMatchIcon from '../asset/icons/header_match.svg'
import headerMediaIcon from '../asset/icons/header_media.svg'
import headerMyIcon from '../asset/icons/header_my.svg'

const items = [
  { to: '/home', label: '홈', icon: headerHomeIcon },
  { to: '/match', label: '매치', icon: headerMatchIcon },
  { to: '/creator', label: '미디어', icon: headerMediaIcon },
  { to: '/community', label: '커뮤니티', icon: headerComIcon },
  { to: '/my', label: 'MY', icon: headerMyIcon },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const myItemRef = useRef<HTMLAnchorElement | null>(null)

  useLayoutEffect(() => {
    const updateMyCenter = () => {
      const myItem = myItemRef.current
      if (!myItem) return

      const rect = myItem.getBoundingClientRect()
      document.documentElement.style.setProperty('--nav-my-center-x', `${rect.left + rect.width / 2}px`)
    }

    const frame = window.requestAnimationFrame(updateMyCenter)
    const transitionFrame = window.setTimeout(updateMyCenter, 220)
    window.addEventListener('resize', updateMyCenter)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(transitionFrame)
      window.removeEventListener('resize', updateMyCenter)
    }
  }, [pathname])

  return (
    <header className="app_header">
      <nav className="bottom_nav" aria-label="주요 내비게이션">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            ref={item.to === '/my' ? myItemRef : undefined}
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
