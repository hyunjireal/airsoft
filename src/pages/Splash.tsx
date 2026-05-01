import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { appName } from '../data/copy'

export function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/onboarding'), 1000)
    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <main className="mobile-frame standalone-page">
      <div className="list" style={{ textAlign: 'center' }}>
        <h1>{appName}</h1>
        <p className="muted">에어소프트건을 더 쉽게 시작하는 방법</p>
      </div>
      <button className="button primary-button" type="button" onClick={() => navigate('/onboarding')}>
        바로 시작하기
      </button>
    </main>
  )
}
