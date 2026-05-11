import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserLevel } from '../../types'
import './Auth.css'

const skillOptions: Array<{
  level: Extract<UserLevel, '입문자' | '숙련자'>
  label: string
  alias: string
  description: string
  homePreset: string
}> = [
  {
    level: '입문자',
    label: '입문자',
    alias: '뉴비',
    description: '에어소프트건이 처음이거나 아직 배우는 중이에요.',
    homePreset: 'AI 질문 가이드, 기초 퀴즈',
  },
  {
    level: '숙련자',
    label: '숙련자',
    alias: '베테랑',
    description: '내 장비는 내가 정비하고 필드 경험도 많아요.',
    homePreset: '전술 지도, 경기 매칭, 하이라이트',
  },
]

export function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'skill' | 'profile'>('skill')
  const [nickname, setNickname] = useState('삼삼오오')
  const [email, setEmail] = useState('rookie@airsoft.test')
  const [password, setPassword] = useState('airsoft1234')
  const [region, setRegion] = useState('서울 마포구')
  const [level, setLevel] = useState<UserLevel>('입문자')

  const selectedSkill = skillOptions.find((option) => option.level === level) ?? skillOptions[0]

  const signup = () => {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('nickname', nickname || '삼삼오오 유저')
    localStorage.setItem('email', email || '미설정')
    localStorage.setItem('region', region || '미설정')
    localStorage.setItem('level', level)
    localStorage.setItem('skillAlias', selectedSkill.alias)
    localStorage.setItem('homePreset', selectedSkill.homePreset)
    navigate('/home')
  }

  if (step === 'skill') {
    return (
      <main className="mobile_frame standalone_page signup_flow">
        <section className="list">
          <div>
            <h1 className="page_title">실력을 먼저 알려주세요</h1>
            <p className="page_description">선택한 값에 맞춰 가입 후 홈 화면 구성을 저장해둘게요.</p>
          </div>
          {skillOptions.map((option) => (
            <button
              key={option.level}
              className={`card signup_choice_card ${level === option.level ? 'selected' : ''}`}
              type="button"
              onClick={() => setLevel(option.level)}
            >
              <strong>{option.label} ({option.alias})</strong>
              <span>{option.description}</span>
              <small>홈 세팅: {option.homePreset} 위주</small>
            </button>
          ))}
        </section>
        <button className="button primary_button" type="button" onClick={() => setStep('profile')}>
          다음
        </button>
      </main>
    )
  }

  return (
    <main className="mobile_frame standalone_page signup_flow">
      <div>
        <h1 className="page_title">회원가입</h1>
        <p className="page_description">{selectedSkill.label} ({selectedSkill.alias}) 홈 세팅으로 시작합니다.</p>
      </div>
      <label className="field">닉네임<input className="input" value={nickname} onChange={(event) => setNickname(event.target.value)} /></label>
      <label className="field">이메일<input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label className="field">비밀번호<input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <label className="field">활동 지역<input className="input" value={region} onChange={(event) => setRegion(event.target.value)} /></label>
      <article className="card">
        <h2 className="section_title">선택한 실력</h2>
        <p>{selectedSkill.label} ({selectedSkill.alias})</p>
        <p className="muted">{selectedSkill.homePreset} 위주로 홈 화면 세팅</p>
      </article>
      <button className="button primary_button" type="button" onClick={signup}>가입하고 시작하기</button>
      <button className="button" type="button" onClick={() => setStep('skill')}>이전</button>
    </main>
  )
}
