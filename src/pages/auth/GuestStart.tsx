import { useNavigate } from 'react-router-dom'
import loginCharacter from '../../asset/images/login_char01.png'
import { AuthShell } from './AuthShell'

export function GuestStart() {
  const navigate = useNavigate()

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/login')
  }

  return (
    <AuthShell onBack={goBack}>
      <section className="auth_page_body auth_guest_page">
        <div className="auth_guest_hero">
          <div className="auth_guest_visual" aria-hidden="true">
            <img src={loginCharacter} alt="" />
          </div>

          <div className="auth_guest_card">
            <h1 className="auth_guest_card__title">비회원으로 둘러볼 수 있어요</h1>
            <p className="auth_guest_card__description">
              <span>다만 경기 신청, 글 작성, MVP 투표,</span>
              <span>경기 모집 및 참여는 로그인이 필요해요</span>
            </p>
          </div>
        </div>

        <button className="auth_primary_button auth_page_footer_button" type="button" onClick={() => navigate('/home')}>
          시작하기
        </button>
      </section>
    </AuthShell>
  )
}
