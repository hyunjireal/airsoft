import type { MouseEvent } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CommunityTopbar } from './CommunityTopbar'
import './Community.css'

export function CommunityHome() {
  const location = useLocation()
  const navigate = useNavigate()
  const isBeginnerTab = location.pathname === '/community' || location.pathname === '/community/'
  const activeTab = isBeginnerTab ? 'beginner' : 'free'

  const handleBeginnerClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (activeTab === 'beginner') return
    navigate('/community', { state: { tabSlide: 'from-left' } })
  }

  const handleFreeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (activeTab === 'free') return
    navigate('/community/free', { state: { tabSlide: 'from-right' } })
  }

  return (
    <div className="community_page">
      <CommunityTopbar
        activeTab={activeTab}
        onBeginnerClick={handleBeginnerClick}
        onFreeClick={handleFreeClick}
      />
      <Outlet />
    </div>
  )
}
