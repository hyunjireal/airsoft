import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

type StartButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: ReactNode
}

const startButtonStyle: CSSProperties = {
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
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  opacity: 1,
  background: '#E2FD34',
  backgroundColor: '#E2FD34',
  backgroundImage: 'none',
  color: '#1A1A1A',
  WebkitTextFillColor: '#1A1A1A',
  fontFamily: "'Pretendard', system-ui, sans-serif",
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.3,
  letterSpacing: '-0.36px',
  boxShadow: 'none',
  filter: 'none',
  mixBlendMode: 'normal',
  cursor: 'pointer',
}

export function StartButton({
  children = '시작하기',
  style,
  type = 'button',
  ...props
}: StartButtonProps) {
  return (
    <button {...props} type={type} style={{ ...startButtonStyle, ...style }}>
      {children}
    </button>
  )
}
