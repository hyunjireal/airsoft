import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { FloatingAiButton } from './FloatingAiButton'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const showBackButton = location.pathname !== '/home'

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/home')
  }

  return (
    <div className={`mobile_frame ${showBackButton ? 'has_app_back_button' : ''}`}>
      {showBackButton ? (
        <button className="app_back_button" type="button" aria-label="뒤로가기" onClick={goBack}>
          ‹
        </button>
      ) : null}
      <main>
        <Outlet />
      </main>
      <FloatingAiButton />
      <BottomNav />
    </div>
  )
}
