import type { CSSProperties, ReactNode } from 'react'

type KeywordTagProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

const keywordTagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'fit-content',
  height: 20,
  padding: '3px 6px',
  boxSizing: 'border-box',
  fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif',
  fontSize: 10,
  fontWeight: 400,
  lineHeight: 'normal',
  letterSpacing: '-0.02em',
  background: '#F6FFBC',
  borderRadius: '999px'
}

function KeywordTag({ children, className, style }: KeywordTagProps) {
  return (
    <span className={className} style={{ ...keywordTagStyle, ...style }}>
      {children}
    </span>
  )
}

export default KeywordTag
