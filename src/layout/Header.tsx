import { useNavigate } from 'react-router-dom'
import { appName } from '../data/copy'

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="header">
      <button className="text-button" type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
        ←
      </button>
      <div className="header-title">{appName}</div>
      <div className="header-actions">
        <button className="text-button" type="button" onClick={() => navigate('/search')}>
          검색
        </button>
        <button className="text-button" type="button" onClick={() => navigate('/notifications')}>
          알림
        </button>
      </div>
    </header>
  )
}
