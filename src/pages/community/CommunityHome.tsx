import { Outlet } from 'react-router-dom'
import './Community.css'

export function CommunityHome() {
  return (
    <div className="community_page">
      <Outlet />
    </div>
  )
}
