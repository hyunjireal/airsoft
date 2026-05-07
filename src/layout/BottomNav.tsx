import { NavLink } from 'react-router-dom'

const items = [
  { to: '/home', label: '홈' },
  { to: '/match', label: '매치' },
  { to: '/creator', label: '크리에이터' },
  { to: '/community', label: '커뮤니티' },
  { to: '/my', label: '마이', disabled: true },
]

export function BottomNav() {
  return (
    <nav className="bottom_nav" aria-label="하단 내비게이션">
      {items.map((item) =>
        item.disabled ? (
          <NavLink
            className="bottom_nav_disabled"
            key={item.to}
            to={item.to}
            aria-disabled="true"
            onClick={(event) => event.preventDefault()}
          >
            {item.label}
          </NavLink>
        ) : (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            {item.label}
          </NavLink>
        ),
      )}
    </nav>
  )
}
