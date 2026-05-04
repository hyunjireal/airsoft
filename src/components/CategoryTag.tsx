import type { CSSProperties, ReactNode } from 'react'

type CategoryTagProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

const categoryTagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'fit-content',
  height: 30,
  padding: '4px 10px',
  gap: 10,
  boxSizing: 'border-box',
  fontFamily: 'Pretendard, system-ui, sans-serif',
  fontSize: 14,
  lineHeight: '130%',
  letterSpacing: '-0.02em',
}

function CategoryTag({ children, className, style }: CategoryTagProps) {
  return (
    <span className={className} style={{ ...categoryTagStyle, ...style }}>
      {children}
    </span>
  )
}

export default CategoryTag
