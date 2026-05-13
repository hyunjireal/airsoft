import { useCallback, useEffect, useRef, useState } from 'react'
import matchRegisterToastFigure from '../../asset/images/match_char_resistered.png'

const MATCH_REGISTRATION_TOAST_KEY = 'airsoft:match-registration-toast'
const MATCH_REGISTRATION_TOAST_AUTO_CLOSE_MS = 2600
const MATCH_REGISTRATION_TOAST_EXIT_MS = 240

type MatchRegistrationToastProps = {
  open: boolean
  onClose: () => void
}

type MatchRegistrationToastPhase = 'enter' | 'exit'

export function markMatchRegistrationToastPending() {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(MATCH_REGISTRATION_TOAST_KEY, 'true')
}

export function consumeMatchRegistrationToastPending() {
  if (typeof window === 'undefined') {
    return false
  }

  const shouldShowToast = localStorage.getItem(MATCH_REGISTRATION_TOAST_KEY) === 'true'
  if (!shouldShowToast) {
    return false
  }

  localStorage.removeItem(MATCH_REGISTRATION_TOAST_KEY)
  return true
}

export function MatchRegistrationToast({ open, onClose }: MatchRegistrationToastProps) {
  const [phase, setPhase] = useState<MatchRegistrationToastPhase>('enter')
  const autoCloseTimeoutRef = useRef<number | null>(null)
  const exitTimeoutRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (autoCloseTimeoutRef.current !== null) {
      window.clearTimeout(autoCloseTimeoutRef.current)
      autoCloseTimeoutRef.current = null
    }

    if (exitTimeoutRef.current !== null) {
      window.clearTimeout(exitTimeoutRef.current)
      exitTimeoutRef.current = null
    }
  }, [])

  const startClose = useCallback(() => {
    if (exitTimeoutRef.current !== null) {
      return
    }

    if (autoCloseTimeoutRef.current !== null) {
      window.clearTimeout(autoCloseTimeoutRef.current)
      autoCloseTimeoutRef.current = null
    }

    setPhase('exit')
    exitTimeoutRef.current = window.setTimeout(() => {
      exitTimeoutRef.current = null
      onClose()
    }, MATCH_REGISTRATION_TOAST_EXIT_MS)
  }, [onClose])

  useEffect(() => {
    if (!open) {
      return
    }

    setPhase('enter')

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        startClose()
      }
    }

    autoCloseTimeoutRef.current = window.setTimeout(() => {
      autoCloseTimeoutRef.current = null
      startClose()
    }, MATCH_REGISTRATION_TOAST_AUTO_CLOSE_MS)

    window.addEventListener('keydown', handleEscape)
    return () => {
      clearTimers()
      window.removeEventListener('keydown', handleEscape)
    }
  }, [clearTimers, open, startClose])

  if (!open) {
    return null
  }

  return (
    <div
      className={`match_registration_toast${phase === 'exit' ? ' is_exiting' : ' is_entering'}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="match_registration_toast_content">
        <img
          className="match_registration_toast_figure"
          src={matchRegisterToastFigure}
          alt=""
          aria-hidden="true"
        />
        <div className="match_registration_toast_text">
          <p className="match_registration_toast_title">일정이 등록되었어요!</p>
          <p className="match_registration_toast_description">신청 내역을 통해 관리해 보세요</p>
        </div>
      </div>
      <button
        className="match_registration_toast_close"
        type="button"
        aria-label="등록 알림 닫기"
        onClick={startClose}
      />
    </div>
  )
}
