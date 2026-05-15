import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMatchPage = location.pathname === '/match' || location.pathname.startsWith('/match/')
  const isMediaPage = location.pathname === '/media' || location.pathname.startsWith('/media/')
  const isMediaProfile =
    location.pathname.startsWith('/media/') && location.pathname !== '/media/list'
  const isBeginnerBoardHome = location.pathname === '/community'
  const isGeneralBoardHome = location.pathname === '/community/free'
  const isCommunityPostDetail = location.pathname.startsWith('/community/post/')
  const isTournamentMain = location.pathname === '/tournament'
  const isTournamentMvpVote = location.pathname === '/tournament/mvp-vote'
  const isTournamentMvpComplete = location.pathname === '/tournament/mvp-complete'
  const isTournamentExperience = isTournamentMain || isTournamentMvpVote || isTournamentMvpComplete
  const hasTournamentBottomNav = isTournamentMain || isTournamentMvpVote
  const isChatPage = location.pathname === '/chat'
  const isMySchedulePage = location.pathname === '/my/schedule'
  const isGuideHubPage = location.pathname === '/guide'
  const isGuideQuizPage = location.pathname === '/guide/quiz'
  const isMatchEditPage = /^\/match\/edit\/[^/]+$/.test(location.pathname)
  const isMatchPresetEditPage = /^\/match\/presets\/[^/]+\/edit$/.test(location.pathname)
  const isMatchPresetFinishPage = location.pathname === '/match/presets/finish'
  const showBottomNav =
    !isCommunityPostDetail &&
    !isTournamentMvpComplete &&
    !isChatPage &&
    !isGuideQuizPage &&
    !location.pathname.startsWith('/match/schedule/') &&
    !isMatchEditPage &&
    !isMatchPresetEditPage &&
    !isMatchPresetFinishPage
  const keepTopInset = false
  const showBackButton =
    !isMatchPage &&
    !isMediaPage &&
    !isMediaProfile &&
    !isBeginnerBoardHome &&
    !isGeneralBoardHome &&
    !isCommunityPostDetail &&
    !isTournamentExperience &&
    !isChatPage &&
    !isGuideHubPage &&
    !isMySchedulePage &&
    !isGuideQuizPage &&
    location.pathname !== '/home' &&
    location.pathname !== '/my'

  const frameClassName = [
    'mobile_frame',
    showBottomNav ? 'has_app_bottom_nav' : '',
    hasTournamentBottomNav ? 'tournament_bottom_nav_frame' : '',
    isChatPage ? 'chat_frame' : '',
    isGuideHubPage ? 'guide_hub_frame' : '',
    isMediaProfile
      ? 'media_profile_frame'
      : isGuideQuizPage
        ? 'guide_quiz_frame'
      : showBackButton
        ? 'has_app_back_button'
        : keepTopInset
          ? 'has_app_top_inset'
          : '',
  ]
    .filter(Boolean)
    .join(' ')

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/home')
  }

  return (
    <div className={frameClassName}>
      {showBackButton ? (
        <button className="app_back_button" type="button" aria-label="뒤로가기" onClick={goBack}>
          ‹
        </button>
      ) : null}
      <main>
        <Outlet />
      </main>
      {showBottomNav ? <BottomNav /> : null}
    </div>
  )
}
