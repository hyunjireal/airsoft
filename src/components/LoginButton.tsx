import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import './ActionButton.css'

type LoginButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: ReactNode
}

const loginButtonStyle: CSSProperties = {
  overflow: 'hidden',
  outline: 'none',
  position: 'relative',
  zIndex: 1,
  isolation: 'isolate',
  WebkitTextFillColor: 'var(--color-black)',
}

export function LoginButton({
  children = '로그인',
  className,
  style,
  type = 'button',
  ...props
}: LoginButtonProps) {
  return (
    <button
      {...props}
      className={['app_action_button', 'app_action_button--light', className].filter(Boolean).join(' ')}
      type={type}
      style={{ ...loginButtonStyle, ...style }}
    >
      <span className="app_action_button__label">{children}</span>
    </button>
  )
}
