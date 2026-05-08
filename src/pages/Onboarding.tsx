import { useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import onboarding01Image from '../asset/images/onboarding01.png'
import onboarding02Image from '../asset/images/onboarding02.png'
import onboarding03Image from '../asset/images/onboarding03.png'
import onboardingLogo from '../asset/images/onboarding_logo.png'
import onboarding01Video from '../asset/video/onboarding01.mp4'
import { LoginButton } from '../components/LoginButton'
import { SignupButton } from '../components/SignupButton'
import { StartButton } from '../components/StartButton'

const ONBOARDING_SWIPE_THRESHOLD = 48

type InfoSlide = {
  id: string
  titleLines: string[]
  descriptionLines: string[]
  imageSrc: string
  imageWidth: number
  imageHeight: number
}

const onboardingInfoSlides: InfoSlide[] = [
  {
    id: 'ai-guide',
    titleLines: ['장비가 없어도', '어떻게 시작할지 몰라도'],
    descriptionLines: ['장비부터 규칙, 참여 방법까지', 'AI 챗봇 GAI에게 물어보세요'],
    imageSrc: onboarding01Image,
    imageWidth: 203,
    imageHeight: 161,
  },
  {
    id: 'buddy-guide',
    titleLines: ['혼자가 아닌', '숙련된 버디와 함께'],
    descriptionLines: ['버디와 함께', '차근차근 시작해보세요'],
    imageSrc: onboarding02Image,
    imageWidth: 184,
    imageHeight: 161,
  },
  {
    id: 'creator-guide',
    titleLines: ['나만의 크리에이터를', '응원해보세요'],
    descriptionLines: ['영상 · 경기 · 커뮤니티 활동까지', '팬들과 함께 즐길 수 있어요'],
    imageSrc: onboarding03Image,
    imageWidth: 234,
    imageHeight: 161,
  },
]

const onboardingPageStyles = `
  .onboarding_flow {
    position: relative;
    width: min(100%, 393px);
    min-height: 100vh;
    min-height: 100dvh;
    margin: 0 auto;
    overflow: hidden;
    border-left: 0;
    border-right: 0;
    background: #1a1a1a;
    color: #ffffff;
    isolation: isolate;
  }

  .onboarding_intro {
    position: relative;
    min-height: 100vh;
    min-height: 100dvh;
    background: #111111;
  }

  .onboarding_intro__video,
  .onboarding_intro__shade {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .onboarding_intro__video {
    object-fit: cover;
    object-position: center;
    filter: brightness(0.6) saturate(0.92);
  }

  .onboarding_intro__shade {
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0.08) 30%, rgba(0, 0, 0, 0.22) 70%, rgba(0, 0, 0, 0.52) 100%),
      linear-gradient(180deg, rgba(17, 17, 17, 0.08) 0%, rgba(17, 17, 17, 0.04) 46%, rgba(17, 17, 17, 0.34) 100%);
    pointer-events: none;
  }

  .onboarding_intro__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 160px 24px 67px;
  }

  .onboarding_intro__hero {
    max-width: 224px;
  }

  .onboarding_intro__logo {
    display: block;
    width: 100px;
    height: auto;
    margin-bottom: 15px;
  }

  .onboarding_intro__title,
  .onboarding_panel__title {
    margin: 0;
    letter-spacing: -0.02em;
  }

  .onboarding_intro__title {
    font-size: 32px;
    font-weight: 600;
    line-height: 1.3;
  }

  .onboarding_intro__title_line,
  .onboarding_panel__title_line,
  .onboarding_panel__description_line {
    display: block;
  }

  .onboarding_intro__title_line--accent {
    color: #e2fd34;
  }

  .onboarding_intro__description {
    margin: 24px 0 0;
    color: #adadad;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -0.02em;
  }

  .onboarding_intro__button_wrap,
  .onboarding_panel__actions {
    width: 100%;
  }

  .onboarding_panel {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100dvh;
    background: #1a1a1a;
  }

  .onboarding_panel__viewport {
    overflow: hidden;
    touch-action: pan-y;
    user-select: none;
  }

  .onboarding_panel__track {
    display: flex;
    width: 100%;
  }

  .onboarding_panel__slide {
    flex: 0 0 100%;
    width: 100%;
  }

  .onboarding_panel__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 50px;
    min-height: 443px;
    padding: 130px 24px 50px;
  }

  .onboarding_panel__logo {
    display: block;
    width: 123px;
    height: auto;
  }

  .onboarding_panel__illustration {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 161px;
  }

  .onboarding_panel__illustration img {
    display: block;
    object-fit: contain;
  }

  .onboarding_panel__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 35px;
    min-height: 213px;
    padding: 0 24px 24px;
    text-align: center;
  }

  .onboarding_panel__copy {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .onboarding_panel__indicator {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .onboarding_panel__indicator_button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .onboarding_panel__indicator_dot {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #d9d9d9;
    transition: width 0.2s ease, background-color 0.2s ease;
  }

  .onboarding_panel__indicator_button.is-active .onboarding_panel__indicator_dot {
    width: 32px;
    background: #e2fd34;
  }

  .onboarding_panel__title {
    font-size: 22px;
    font-weight: 700;
    line-height: 1.3;
    color: #ffffff;
  }

  .onboarding_panel__description {
    margin: 0;
    color: #e9e9e9;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.3;
    letter-spacing: -0.02em;
  }

  .onboarding_panel__actions {
    display: grid;
    gap: 12px;
    padding: 0 24px 50px;
    min-height: 196px;
    margin-top: auto;
    align-content: center;
  }

  @supports (min-height: 100svh) {
    .onboarding_flow,
    .onboarding_intro,
    .onboarding_intro__content,
    .onboarding_panel {
      min-height: 100svh;
    }
  }

  @media (max-width: 393px) {
    .onboarding_intro__content {
      padding-top: 140px;
    }
  }
`

type IntroScreenProps = {
  onStart: () => void
}

function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="onboarding_intro" aria-labelledby="onboarding-title">
      <video
        className="onboarding_intro__video"
        src={onboarding01Video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="onboarding_intro__shade" aria-hidden="true" />

      <div className="onboarding_intro__content">
        <div className="onboarding_intro__hero">
          <img className="onboarding_intro__logo" src={onboardingLogo} alt="" aria-hidden="true" />

          <h1 id="onboarding-title" className="onboarding_intro__title">
            <span className="onboarding_intro__title_line onboarding_intro__title_line--accent">
              에어소프트 건,
            </span>
            <span className="onboarding_intro__title_line">시작하고 싶었지만</span>
            <span className="onboarding_intro__title_line">막막하셨죠?</span>
          </h1>

          <p className="onboarding_intro__description">
            정보는 흩어져 있고
            <br />
            커뮤니티는 어렵게 느껴졌을 거예요
          </p>
        </div>

        <div className="onboarding_intro__button_wrap">
          <StartButton aria-label="시작하기" onClick={onStart} />
        </div>
      </div>
    </section>
  )
}

type InfoScreenProps = {
  activeIndex: number
  onSelectSlide: (index: number) => void
  onLogin: () => void
  onSignup: () => void
  onPanelClick: (event: ReactMouseEvent<HTMLElement>) => void
  dragOffset: number
  isDragging: boolean
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => void
}

function InfoScreen({
  activeIndex,
  onSelectSlide,
  onLogin,
  onSignup,
  onPanelClick,
  dragOffset,
  isDragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: InfoScreenProps) {
  const trackStyle = {
    transform: `translate3d(calc(${-activeIndex * 100}% + ${dragOffset}px), 0, 0)`,
    transition: isDragging ? 'none' : 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
  }

  return (
    <section className="onboarding_panel" aria-label="온보딩 안내" onClick={onPanelClick}>
      <div
        className="onboarding_panel__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div className="onboarding_panel__track" style={trackStyle}>
          {onboardingInfoSlides.map((slide, index) => (
            <article
              key={slide.id}
              className="onboarding_panel__slide"
              aria-hidden={activeIndex !== index}
            >
              <div className="onboarding_panel__hero">
                <img className="onboarding_panel__logo" src={onboardingLogo} alt="" aria-hidden="true" />

                <div className="onboarding_panel__illustration">
                  <img
                    src={slide.imageSrc}
                    alt=""
                    aria-hidden="true"
                    style={{ width: slide.imageWidth, height: slide.imageHeight }}
                  />
                </div>
              </div>

              <div className="onboarding_panel__body">
                <div className="onboarding_panel__indicator" aria-label="온보딩 안내 페이지">
                  {onboardingInfoSlides.map((item, indicatorIndex) => (
                    <button
                      key={item.id}
                      className={`onboarding_panel__indicator_button${activeIndex === indicatorIndex ? ' is-active' : ''}`}
                      type="button"
                      aria-label={`${indicatorIndex + 1}번 안내 보기`}
                      aria-current={activeIndex === indicatorIndex ? 'true' : undefined}
                      onClick={() => onSelectSlide(indicatorIndex)}
                    >
                      <span className="onboarding_panel__indicator_dot" />
                    </button>
                  ))}
                </div>

                <div className="onboarding_panel__copy">
                  <h2 id={`onboarding-info-title-${slide.id}`} className="onboarding_panel__title">
                    {slide.titleLines.map((line) => (
                      <span key={line} className="onboarding_panel__title_line">
                        {line}
                      </span>
                    ))}
                  </h2>

                  <p className="onboarding_panel__description">
                    {slide.descriptionLines.map((line) => (
                      <span key={line} className="onboarding_panel__description_line">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="onboarding_panel__actions">
        <LoginButton aria-label="로그인" onClick={onLogin} />
        <SignupButton aria-label="회원가입" onClick={onSignup} />
      </div>
    </section>
  )
}

export function Onboarding() {
  const navigate = useNavigate()
  const shouldIgnorePanelClickRef = useRef(false)
  const swipeStartXRef = useRef<number | null>(null)
  const swipePointerIdRef = useRef<number | null>(null)
  const [step, setStep] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const isIntroScreen = step === 0
  const infoSlideIndex = Math.max(step - 1, 0)

  const resetSwipe = () => {
    swipeStartXRef.current = null
    swipePointerIdRef.current = null
    setDragOffset(0)
    setIsDragging(false)
  }

  const handleStart = () => {
    setStep(1)
  }

  const handleSelectSlide = (index: number) => {
    resetSwipe()
    setStep(index + 1)
  }

  const completeSwipe = (offset: number) => {
    if (offset >= ONBOARDING_SWIPE_THRESHOLD && infoSlideIndex < onboardingInfoSlides.length - 1) {
      handleSelectSlide(infoSlideIndex + 1)
      return
    }

    if (offset <= -ONBOARDING_SWIPE_THRESHOLD && infoSlideIndex > 0) {
      handleSelectSlide(infoSlideIndex - 1)
      return
    }

    resetSwipe()
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    shouldIgnorePanelClickRef.current = false
    swipeStartXRef.current = event.clientX
    swipePointerIdRef.current = event.pointerId
    setDragOffset(0)
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || swipePointerIdRef.current !== event.pointerId || swipeStartXRef.current === null) {
      return
    }

    const rawOffset = event.clientX - swipeStartXRef.current
    if (Math.abs(rawOffset) > 6) {
      shouldIgnorePanelClickRef.current = true
    }
    const isPastFirstSlide = infoSlideIndex === 0 && rawOffset < 0
    const isPastLastSlide = infoSlideIndex === onboardingInfoSlides.length - 1 && rawOffset > 0
    const nextOffset = isPastFirstSlide || isPastLastSlide ? rawOffset * 0.35 : rawOffset
    setDragOffset(nextOffset)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipePointerIdRef.current !== event.pointerId || swipeStartXRef.current === null) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    completeSwipe(event.clientX - swipeStartXRef.current)
  }

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipePointerIdRef.current !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    resetSwipe()
  }

  const handlePanelClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (shouldIgnorePanelClickRef.current) {
      shouldIgnorePanelClickRef.current = false
      return
    }

    if ((event.target as HTMLElement).closest('button')) {
      return
    }

    const panelRect = event.currentTarget.getBoundingClientRect()
    const clickedLeftSide = event.clientX < panelRect.left + panelRect.width / 2

    if (clickedLeftSide) {
      if (infoSlideIndex === 0) {
        return
      }

      handleSelectSlide(infoSlideIndex - 1)
      return
    }

    if (infoSlideIndex >= onboardingInfoSlides.length - 1) {
      return
    }

    handleSelectSlide(infoSlideIndex + 1)
  }

  return (
    <main className="mobile_frame onboarding_flow">
      <style>{onboardingPageStyles}</style>

      {isIntroScreen ? (
        <IntroScreen onStart={handleStart} />
      ) : (
        <InfoScreen
          activeIndex={infoSlideIndex}
          onSelectSlide={handleSelectSlide}
          onLogin={() => navigate('/login')}
          onSignup={() => navigate('/signup')}
          onPanelClick={handlePanelClick}
          dragOffset={dragOffset}
          isDragging={isDragging}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        />
      )}
    </main>
  )
}
