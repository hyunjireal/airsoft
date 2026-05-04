import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function MyPage() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true')

  const logout = () => {
    localStorage.removeItem('isLoggedIn')
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return (
      <div className="page">
        <section className="card">
          <h1>로그인이 필요한 메뉴예요</h1>
          <button className="button primary_button" type="button" onClick={() => navigate('/login')}>로그인하기</button>
        </section>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page_title">MY</h1>
      <section className="section">
        <Link className="card" to="/my/profile">프로필 수정</Link>
        <Link className="card" to="/my/schedule">내 경기 일정</Link>
        <Link className="card" to="/my/applications">신청 내역</Link>
        <Link className="card" to="/my/posts">내가 쓴 글</Link>
        <Link className="card" to="/my/notifications">알림 설정</Link>
        <button className="button" type="button" onClick={logout}>로그아웃</button>
      </section>
    </div>
  )
}
