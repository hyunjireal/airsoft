import { Link, useNavigate } from 'react-router-dom'

const DUMMY_EMAIL = 'demo@3355.com'
const DUMMY_PASSWORD = 'airsoft1234'

export function Login() {
  const navigate = useNavigate()

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('email', DUMMY_EMAIL)
    navigate('/home')
  }

  return (
    <main className="mobile_frame standalone_page">
      <h1>로그인</h1>
      <label className="field">
        이메일
        <input className="input" type="email" defaultValue={DUMMY_EMAIL} />
      </label>
      <label className="field">
        비밀번호
        <input className="input" type="password" defaultValue={DUMMY_PASSWORD} />
      </label>
      <p className="muted">더미 계정: {DUMMY_EMAIL} / {DUMMY_PASSWORD}</p>
      <button className="button primary_button" type="button" onClick={login}>로그인</button>
      <Link className="button" to="/signup">회원가입 하러가기</Link>
      <Link className="button" to="/guest-start">비회원으로 둘러보기</Link>
    </main>
  )
}
