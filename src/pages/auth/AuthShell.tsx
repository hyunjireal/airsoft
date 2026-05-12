import { useEffect } from 'react'
import type { ReactNode } from 'react'
import iconArrowLeft from '../../asset/icons/arrow_l.svg'
import './Auth.css'

type AuthShellProps = {
  children: ReactNode
  onBack: () => void
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
        <div className="auth_screen__status" aria-hidden="true" />

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
