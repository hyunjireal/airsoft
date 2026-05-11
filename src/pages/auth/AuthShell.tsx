import { useEffect } from 'react'
import type { ReactNode } from 'react'
import iconArrowLeft from '../../asset/icons/arrow_l.svg'
import './Auth.css'

type AuthShellProps = {
  children: ReactNode
  onBack: () => void
}

function StatusSignalIcon() {
  return (
    <svg aria-hidden="true" className="auth_status_signal" viewBox="0 0 18 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="7" width="2.2" height="4" rx="1.1" fill="currentColor" />
      <rect x="5" y="5.5" width="2.2" height="5.5" rx="1.1" fill="currentColor" />
      <rect x="9" y="3.5" width="2.2" height="7.5" rx="1.1" fill="currentColor" />
      <rect x="13" y="1" width="2.2" height="10" rx="1.1" fill="currentColor" />
    </svg>
  )
}

function StatusWifiIcon() {
  return (
    <svg aria-hidden="true" className="auth_status_wifi" viewBox="0 0 16 12" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.4 4.2A10.5 10.5 0 0 1 8 2a10.5 10.5 0 0 1 6.6 2.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M3.8 6.7A7.2 7.2 0 0 1 8 5.3a7.2 7.2 0 0 1 4.2 1.4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M6.2 9.1A3.8 3.8 0 0 1 8 8.6a3.8 3.8 0 0 1 1.8.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <circle cx="8" cy="10.2" r="1" fill="currentColor" />
    </svg>
  )
}

function StatusBatteryIcon() {
  return (
    <svg aria-hidden="true" className="auth_status_battery" viewBox="0 0 26 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="21" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3.1" y="3.1" width="15.8" height="5.8" rx="2.1" fill="currentColor" />
      <rect x="22.8" y="3.4" width="2.2" height="5.2" rx="1.1" fill="currentColor" />
    </svg>
  )
}

export function AuthShell({ children, onBack }: AuthShellProps) {
  useEffect(() => {
    document.body.classList.add('auth_body')

    return () => {
      document.body.classList.remove('auth_body')
    }
  }, [])

  return (
    <main className="mobile_frame auth_screen">
      <div className="auth_screen__inner">
        <div className="auth_screen__status" aria-hidden="true">
          <span className="auth_screen__time">09:47</span>
          <div className="auth_screen__status_icons">
            <StatusSignalIcon />
            <StatusWifiIcon />
            <StatusBatteryIcon />
          </div>
        </div>

        <div className="auth_screen__topbar">
          <button className="auth_screen__back" type="button" aria-label="뒤로가기" onClick={onBack}>
            <img src={iconArrowLeft} alt="" aria-hidden="true" />
          </button>
        </div>

        {children}
      </div>
    </main>
  )
}
