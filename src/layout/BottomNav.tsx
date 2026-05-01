import { NavLink } from 'react-router-dom'

const items = [
  { to: '/home', label: '홈' },
  { to: '/guide', label: '가이드' },
  { to: '/match', label: '매치' },
  { to: '/community', label: '커뮤니티' },
  { to: '/my', label: 'MY' },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="하단 내비게이션">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
