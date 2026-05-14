import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { PageHeader } from '../../components/PageHeader'
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

        <PageHeader
          className="auth_screen__topbar"
          backIcon={iconArrowLeft}
          backButtonClassName="auth_screen__back"
          onBack={onBack}
          variant="dark"
        />

        {children}
      </div>
    </main>
  )
}
