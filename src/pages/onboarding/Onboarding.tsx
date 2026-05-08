import { useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './Onboarding.css'
import { InfoScreen, onboardingInfoSlides } from './InfoScreen'
import { IntroScreen } from './IntroScreen'

const ONBOARDING_SWIPE_THRESHOLD = 48

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
