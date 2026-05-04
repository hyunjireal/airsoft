import { Link, useNavigate } from 'react-router-dom'

export function Login() {
  const navigate = useNavigate()

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true')
    navigate('/home')
  }

  return (
    <main className="mobile_frame standalone_page">
      <h1>로그인</h1>
      <label className="field">
        이메일
        <input className="input" type="email" />
      </label>
      <label className="field">
        비밀번호
        <input className="input" type="password" />
      </label>
      <button className="button primary_button" type="button" onClick={login}>로그인</button>
      <Link className="button" to="/signup">회원가입 하러가기</Link>
      <Link className="button" to="/guest-start">비회원으로 둘러보기</Link>
    </main>
  )
}
