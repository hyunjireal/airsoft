import { useNavigate } from 'react-router-dom'

export function FloatingAiButton() {
  const navigate = useNavigate()

  return (
    <button className="floating_ai" type="button" onClick={() => navigate('/chat')}>
      AI에게 물어보기
    </button>
  )
}
