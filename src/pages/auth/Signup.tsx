import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserLevel } from '../../types'

export function Signup() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [region, setRegion] = useState('')
  const [level, setLevel] = useState<UserLevel>('입문자')

  const signup = () => {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('nickname', nickname || '삼삼오오 유저')
    localStorage.setItem('region', region || '미설정')
    localStorage.setItem('level', level)
    navigate('/home')
  }

  return (
    <main className="mobile_frame standalone_page">
      <h1>회원가입</h1>
      <label className="field">닉네임<input className="input" value={nickname} onChange={(event) => setNickname(event.target.value)} /></label>
      <label className="field">이메일<input className="input" type="email" /></label>
      <label className="field">비밀번호<input className="input" type="password" /></label>
      <label className="field">활동 지역<input className="input" value={region} onChange={(event) => setRegion(event.target.value)} /></label>
      <label className="field">
        현재 수준 선택
        <select className="select" value={level} onChange={(event) => setLevel(event.target.value as UserLevel)}>
          <option>입문자</option>
          <option>초보</option>
          <option>경험자</option>
        </select>
      </label>
      <button className="button primary_button" type="button" onClick={signup}>가입하고 시작하기</button>
    </main>
  )
}
