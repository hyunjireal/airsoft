import type { CSSProperties, ReactNode } from 'react'

type MainTagProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

const mainTagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'fit-content',
  height: 24,
  padding: '5px 10px',
  gap: 10,
  boxSizing: 'border-box',
}

function MainTag({ children, className, style }: MainTagProps) {
  return (
    <span className={className} style={{ ...mainTagStyle, ...style }}>
      {children}
    </span>
  )
}

export default MainTag
