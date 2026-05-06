import { NavLink, Outlet } from 'react-router-dom'
import './Community.css'

export function CommunityHome() {
  return (
    <div className="community_page">
      <nav className="community_tabs" aria-label="커뮤니티 게시판">
        <NavLink to="/community" end>
          초보 게시판
        </NavLink>
        <NavLink to="/community/free">
          일반 게시판
        </NavLink>
      </nav>

      <Outlet />
    </div>
  )
}
