import { useNavigate } from 'react-router-dom'
import gaiFloatingImage from '../asset/images/gai_floating.png'

export function AiFloatingButton() {
  const navigate = useNavigate()

  return (
    <button className="floating_ai" type="button" aria-label="AI에게 물어보기" onClick={() => navigate('/chat')}>
      <img src={gaiFloatingImage} alt="" />
    </button>
  )
}
