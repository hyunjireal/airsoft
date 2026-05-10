import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMatchPage = location.pathname === '/match' || location.pathname.startsWith('/match/')
  const isBeginnerBoardHome = location.pathname === '/community'
  const isGeneralBoardHome = location.pathname === '/community/free'
  const isCommunityPostDetail = location.pathname.startsWith('/community/post/')
  const isTournamentMvpVote = location.pathname === '/tournament/mvp-vote'
  const keepTopInset = false
  const showBackButton =
    !isMatchPage &&
    !isBeginnerBoardHome &&
    !isGeneralBoardHome &&
    !isCommunityPostDetail &&
    !isTournamentMvpVote &&
    location.pathname !== '/home' &&
    location.pathname !== '/my'

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/home')
  }

  return (
    <div
      className={`mobile_frame ${
        showBackButton ? 'has_app_back_button' : keepTopInset ? 'has_app_top_inset' : ''
      }`}
    >
      {showBackButton ? (
        <button className="app_back_button" type="button" aria-label="뒤로가기" onClick={goBack}>
          ‹
        </button>
      ) : null}
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
