import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import phoneNumberImage from '../../asset/images/login_number_img.png'
import arrowRightIcon from '../../asset/icons/arrow_r.svg'
import iconEyeOff from '../../asset/icons/login_eye_off.svg'
import iconLocation from '../../asset/icons/login_location.svg'
import { AuthShell } from './AuthShell'

type SignupModeId = 'beginner' | 'veteran'

type SignupMode = {
  id: SignupModeId
  alias: string
  formSubtitle: string
  homePreset: string
  label: string
  title: string
  description: string
}

const signupModes: SignupMode[] = [
  {
    id: 'beginner',
    label: '입문자',
    alias: '뉴비',
    title: '입문자 (뉴비)',
    description: '에어소프트건이 처음이거나 배우는 중이에요',
    homePreset: 'AI 질문 가이드, 기초 퀴즈 위주',
    formSubtitle: '입문자(뉴비) 맞춤 세팅으로 시작합니다.',
  },
  {
    id: 'veteran',
    label: '숙련자',
    alias: '베테랑',
    title: '숙련자 (베테랑)',
    description: '필드 경험이 많고, 경기 지식이 풍부해요',
    homePreset: '전술 지도, 경기 매칭 위주',
    formSubtitle: '숙련자(베테랑) 맞춤 세팅으로 시작합니다.',
  },
]

const regionOptions = [
  '서울',
  '경기 북부',
  '경기 남부',
  '인천',
  '강원',
  '대전',
  '세종',
  '충북',
  '충남',
  '광주',
  '전북',
  '전남',
  '대구',
  '경북',
  '부산',
  '울산',
  '경남',
  '제주',
]

const regionPlaceholder = '활동 지역을 선택해주세요'

const dummySignupProfile = {
  nickname: '더미요원3355',
  email: 'dummy3355@airsoft.test',
  password: 'Dummy3355!',
  region: '서울',
  phoneNumber: '010-3355-0000',
}

function ChevronDownIcon({ className = 'auth_phone_chevron' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m2 4 4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="auth_region_sheet_check" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 8.3 6.7 11.4 12.5 4.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'level' | 'profile'>('level')
  const [selectedModeId, setSelectedModeId] = useState<SignupModeId>('beginner')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [region, setRegion] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [regionSheetOpen, setRegionSheetOpen] = useState(false)

  const selectedMode = signupModes.find((mode) => mode.id === selectedModeId) ?? signupModes[0]
  const nicknameError = submitted && nickname.trim() === '' ? '닉네임을 입력하세요' : ''
  const emailError = submitted && email.trim() === '' ? '이메일을 입력하세요' : ''
  const passwordError = submitted && password.trim() === '' ? '비밀번호를 입력하세요' : ''
  const passwordConfirmError = submitted && passwordConfirm.trim() === '' ? '비밀번호 확인을 입력하세요' : ''

  useEffect(() => {
    if (!regionSheetOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRegionSheetOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [regionSheetOpen])

  const goBack = () => {
    if (regionSheetOpen) {
      setRegionSheetOpen(false)
      return
    }

    if (step === 'profile') {
      setStep('level')
      return
    }

    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/onboarding')
  }

  const handleRegionSelect = (option: string) => {
    setRegion(option)
    setRegionSheetOpen(false)
  }

  const handleUseDummyAccount = () => {
    setNickname(dummySignupProfile.nickname)
    setEmail(dummySignupProfile.email)
    setPassword(dummySignupProfile.password)
    setPasswordConfirm(dummySignupProfile.password)
    setRegion(dummySignupProfile.region)
    setPhoneNumber(dummySignupProfile.phoneNumber)
    setSubmitted(false)
    setRegionSheetOpen(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const isVeteran = selectedMode.id === 'veteran'
    const trimmedNickname = nickname.trim()
    const trimmedEmail = email.trim()

    if (!trimmedNickname || !trimmedEmail || !password || !passwordConfirm) {
      return
    }

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('nickname', trimmedNickname)
    localStorage.setItem('email', trimmedEmail)
    localStorage.setItem('region', region || '서울')
    localStorage.setItem('level', isVeteran ? '숙련자' : '입문자')
    localStorage.setItem('skillAlias', isVeteran ? '베테랑' : '뉴비')
    localStorage.setItem('homePreset', selectedMode.homePreset)
    localStorage.setItem('homeProfileBadge', isVeteran ? 'badge03' : 'symbol_beginner')
    localStorage.setItem('homeProfileTitle', isVeteran ? '베테랑 숙련자' : '안전제일 뉴비')

    navigate('/home')
  }

  return (
    <AuthShell onBack={goBack} showTopbar={false} scrollLock={step === 'profile'}>
      {step === 'level' ? (
        <section className="auth_page_body auth_signup_level_page">
          <div className="auth_page_header auth_page_header_center">
            <h1 className="auth_page_title auth_page_title_medium">실력을 먼저 알려주세요</h1>
            <p className="auth_page_description auth_page_description_center">
              선택한 실력에 맞춰 가입 후 홈 화면을 맞춤 설정해드릴게요
            </p>
          </div>

          <div className="auth_option_list">
            {signupModes.map((mode) => (
              <button
                key={mode.id}
                className={`auth_option_card ${selectedMode.id === mode.id ? 'is_selected' : ''}`}
                type="button"
                onClick={() => setSelectedModeId(mode.id)}
              >
                <strong>{mode.title}</strong>
                <span>{mode.description}</span>
                <small>홈 세팅 : {mode.homePreset}</small>
              </button>
            ))}
          </div>

          <button className="auth_primary_button auth_page_footer_button" type="button" onClick={() => setStep('profile')}>
            다음
          </button>
        </section>
      ) : (
        <form className="auth_page_body auth_signup_form_page" onSubmit={handleSubmit}>
          <div className="auth_signup_scroll_area">
            <div className="auth_page_header auth_page_header_left">
              <h1 className="auth_page_title">회원가입</h1>
              <p className="auth_page_description">{selectedMode.formSubtitle}</p>
              <button className="auth_dummy_account_button" type="button" onClick={handleUseDummyAccount}>
                <span>더미 계정 사용</span>
                <img src={arrowRightIcon} alt="" aria-hidden="true" />
              </button>
            </div>

            <div className="auth_form_block auth_form_block_signup">
              <label className="auth_field">
                <span className="auth_field__label">닉네임</span>
                <input
                  className="auth_input"
                  type="text"
                  value={nickname}
                  placeholder="닉네임을 입력해주세요"
                  onChange={(event) => setNickname(event.target.value)}
                  aria-invalid={nicknameError ? 'true' : undefined}
                  aria-describedby={nicknameError ? 'signup-nickname-error' : undefined}
                />
                {nicknameError ? (
                  <span id="signup-nickname-error" className="auth_field_error">
                    {nicknameError}
                  </span>
                ) : null}
              </label>

            <label className="auth_field">
              <span className="auth_field__label">이메일</span>
              <input
                className="auth_input"
                type="text"
                inputMode="email"
                value={email}
                placeholder="이메일을 입력해주세요"
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={emailError ? 'true' : undefined}
                aria-describedby={emailError ? 'signup-email-error' : undefined}
              />
              {emailError ? (
                <span id="signup-email-error" className="auth_field_error">
                  {emailError}
                </span>
              ) : null}
            </label>

            <label className="auth_field">
              <span className="auth_field__label">비밀번호</span>
              <span className="auth_input_wrap">
                <input
                  className="auth_input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  placeholder="비밀번호를 입력해주세요"
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={passwordError ? 'true' : undefined}
                  aria-describedby={passwordError ? 'signup-password-error' : undefined}
                />
                <button
                  className="auth_input_icon_button"
                  type="button"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <img src={iconEyeOff} alt="" aria-hidden="true" />
                </button>
              </span>
              {passwordError ? (
                <span id="signup-password-error" className="auth_field_error">
                  {passwordError}
                </span>
              ) : null}
            </label>

            <label className="auth_field">
              <span className="auth_field__label">비밀번호 확인</span>
              <span className="auth_input_wrap">
                <input
                  className="auth_input"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirm}
                  placeholder="비밀번호를 한 번 더 입력해주세요"
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  aria-invalid={passwordConfirmError ? 'true' : undefined}
                  aria-describedby={passwordConfirmError ? 'signup-password-confirm-error' : undefined}
                />
                <button
                  className="auth_input_icon_button"
                  type="button"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <img src={iconEyeOff} alt="" aria-hidden="true" />
                </button>
              </span>
              {passwordConfirmError ? (
                <span id="signup-password-confirm-error" className="auth_field_error">
                  {passwordConfirmError}
                </span>
              ) : null}
            </label>

            <label className="auth_field">
              <span className="auth_field__label">활동지역 (선택)</span>
              <button
                className="auth_region_field_button"
                type="button"
                aria-expanded={regionSheetOpen}
                aria-haspopup="dialog"
                onClick={() => setRegionSheetOpen(true)}
              >
                <span className={`auth_region_field_value ${region ? '' : 'is_placeholder'}`}>
                  {region || regionPlaceholder}
                </span>
                <span className="auth_region_field_suffix" aria-hidden="true">
                  <img src={iconLocation} alt="" />
                  <ChevronDownIcon className="auth_region_field_chevron" />
                </span>
              </button>
            </label>

            <label className="auth_field">
              <span className="auth_field__label">전화번호 (선택)</span>
              <span className="auth_phone_input">
                <span className="auth_phone_prefix" aria-hidden="true">
                  <img className="auth_phone_flag" src={phoneNumberImage} alt="" />
                  <ChevronDownIcon />
                </span>
                <input
                  className="auth_input auth_phone_number"
                  type="tel"
                  value={phoneNumber}
                  placeholder="(000) 000-0000"
                  onChange={(event) => setPhoneNumber(event.target.value)}
                />
              </span>
            </label>
            </div>
          </div>

          <button className="auth_primary_button auth_page_footer_button" type="submit">
            시작하기
          </button>

          {regionSheetOpen ? (
            <div className="auth_region_sheet_backdrop" onClick={() => setRegionSheetOpen(false)}>
              <div
                className="auth_region_sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-region-sheet-title"
                onClick={(event) => event.stopPropagation()}
              >
                <span className="auth_region_sheet_handle" aria-hidden="true" />

                <div className="auth_region_sheet_header">
                  <div>
                    <h2 className="auth_region_sheet_title" id="auth-region-sheet-title">
                      활동 지역 선택
                    </h2>
                  </div>

                  <button className="auth_region_sheet_close" type="button" onClick={() => setRegionSheetOpen(false)}>
                    닫기
                  </button>
                </div>

                <div className="auth_region_sheet_list">
                  {regionOptions.map((option) => {
                    const isSelected = region === option

                    return (
                      <button
                        key={option}
                        className={`auth_region_sheet_option ${isSelected ? 'is_selected' : ''}`}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleRegionSelect(option)}
                      >
                        <span>{option}</span>
                        {isSelected ? <CheckIcon /> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </form>
      )}
    </AuthShell>
  )
}
