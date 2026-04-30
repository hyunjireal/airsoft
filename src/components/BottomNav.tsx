import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/match', label: '매치' },
  { to: '/creator', label: '크리에이터' },
  { to: '/community', label: '커뮤니티' },
  { to: '/my', label: '마이' },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="하단 탭 내비게이션">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => (isActive ? 'is-active' : undefined)}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
