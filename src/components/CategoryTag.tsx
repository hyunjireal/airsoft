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
  height: 'auto',
  padding: '3px 6px',
  border: '1px solid #EE2106',
  gap: 10,
  boxSizing: 'border-box',
  fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif',
  fontSize: 11,
  fontWeight: 300,
  lineHeight: '130%',
  letterSpacing: '-0.02em',
  color: '#EE2106',
  borderRadius: '999px',
}

function CategoryTag({ children, className, style }: CategoryTagProps) {
  return (
    <span className={className} style={{ ...categoryTagStyle, ...style }}>
      {children}
    </span>
  )
}

export default CategoryTag
