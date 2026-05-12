import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

type LoginButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: ReactNode
}

const loginButtonStyle: CSSProperties = {
  colorScheme: 'light',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 50,
  minHeight: 50,
  padding: '12px 16px',
  border: 'none',
  borderRadius: 10,
  overflow: 'hidden',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  opacity: 1,
  background: 'var(--color-white)',
  backgroundColor: 'var(--color-white)',
  backgroundImage: 'none',
  color: 'var(--color-black)',
  WebkitTextFillColor: 'var(--color-black)',
  fontFamily: "var(--font-pretendard)",
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.3,
  letterSpacing: '-0.36px',
  boxShadow: 'none',
  filter: 'none',
  mixBlendMode: 'normal',
  textDecoration: 'none',
  outline: 'none',
  position: 'relative',
  zIndex: 1,
  isolation: 'isolate',
  cursor: 'pointer',
}

export function LoginButton({
  children = '로그인',
  style,
  type = 'button',
  ...props
}: LoginButtonProps) {
  return (
    <button {...props} type={type} style={{ ...loginButtonStyle, ...style }}>
      <span style={{ color: 'inherit', textDecoration: 'none' }}>{children}</span>
    </button>
  )
}
