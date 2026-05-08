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
  height: 'fit-content',
  padding: '3px 6px',
  gap: 10,
  boxSizing: 'border-box',
  borderRadius: '55px',
}

function CategoryTag({ children, className, style }: CategoryTagProps) {
  return (
    <span className={className} style={{ ...categoryTagStyle, ...style }}>
      {children}
    </span>
  )
}

export default CategoryTag
