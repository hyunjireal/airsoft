import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import onboarding01Video from '../asset/video/onboarding01.mp4'

const ONBOARDING_FIRST_SLIDE_KEY = 'airsoft:onboarding-first-slide-seen'

type OnboardingSlide = {
  id: string
  title: string
  description: string
  videoSrc?: string
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'intro-video',
    title: '에어소프트를 시작하는 가장 쉬운 방법',
    description: '처음 들어온 분들을 위한 시작 화면입니다.',
    videoSrc: onboarding01Video,
  },
  {
    id: 'guide',
    title: '안전 수칙부터 차근차근',
    description: '기본 장비, 경기 규칙, 필드 매너를 한 흐름으로 익혀요.',
  },
  {
    id: 'match',
    title: '내게 맞는 경기를 찾아요',
    description: '개인전, 팀전, 용병 모집까지 필요한 참여 방식을 빠르게 확인해요.',
  },
  {
    id: 'community',
    title: '궁금한 건 바로 물어봐요',
    description: 'AI 답변과 커뮤니티 질문으로 막히는 부분을 바로 해결해요.',
  },
]

export function Onboarding() {
  const navigate = useNavigate()
  const shouldShowFirstSlide = useMemo(() => {
    if (typeof window === 'undefined') {
      return true
    }

    return localStorage.getItem(ONBOARDING_FIRST_SLIDE_KEY) !== 'true'
  }, [])
  const [slideIndex, setSlideIndex] = useState(shouldShowFirstSlide ? 0 : 1)
  const slide = onboardingSlides[slideIndex]
  const isFirstSlide = slideIndex === 0
  const isLastSlide = slideIndex === onboardingSlides.length - 1

  const markFirstSlideAsSeen = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_FIRST_SLIDE_KEY, 'true')
    }
  }

  const handleNext = () => {
    if (isFirstSlide) {
      markFirstSlideAsSeen()
    }

    if (isLastSlide) {
      navigate('/login')
      return
    }

    setSlideIndex((currentIndex) => currentIndex + 1)
  }

  const handleSkip = () => {
    markFirstSlideAsSeen()
    navigate('/login')
  }

  return (
    <main className="mobile_frame onboarding_page">
      <section className="onboarding_slide" aria-labelledby="onboarding-title">
        {slide.videoSrc ? (
          <video
            className="onboarding_video"
            src={slide.videoSrc}
            autoPlay
            muted
            loop
            playsInline
            aria-label={slide.title}
          />
        ) : (
          <div className="onboarding_placeholder" aria-hidden="true" />
        )}

        <div className="onboarding_content">
          <div className="onboarding_text">
            <h1 id="onboarding-title">{slide.title}</h1>
            <p>{slide.description}</p>
          </div>

          <div className="onboarding_dots" aria-label="온보딩 진행 상태">
            {onboardingSlides.map((item, index) => (
              <span
                key={item.id}
                className={`onboarding_dot${index === slideIndex ? ' active' : ''}`}
              />
            ))}
          </div>

          <div className="onboarding_actions">
            <button className="button" type="button" onClick={handleSkip}>
              건너뛰기
            </button>
            <button className="button primary_button" type="button" onClick={handleNext}>
              {isLastSlide ? '시작하기' : '다음'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
