import type { CSSProperties, ReactNode } from 'react'
import arrowR from '../asset/icons/arrow_r.svg'

type MoreProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

const moreStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 5,
  width: 'fit-content',
  border: 0,
  padding: 0,
  background: 'transparent',
  color: '#98999A',
  fontFamily: 'Pretendard Variable, Pretendard, system-ui, sans-serif',
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 'normal',
  letterSpacing: 0,
}

const arrowStyle: CSSProperties = {
  width: 12,
  height: 12,
  flexShrink: 0,
}

function More({ children = '\uB354\uBCF4\uAE30', className, style }: MoreProps) {
  return (
    <span className={className} style={{ ...moreStyle, ...style }}>
      <span>{children}</span>
      <img aria-hidden="true" alt="" className="arrow_r" src={arrowR} style={arrowStyle} />
    </span>
  )
}

export default More
