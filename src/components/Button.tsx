import { Link } from 'react-router-dom'

interface ButtonProps {
  children: React.ReactNode
  to?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
}

export function Button({ children, to, variant = 'primary', type = 'button' }: ButtonProps) {
  const className = `button button--${variant}`

  if (to) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    )
  }

  return (
    <button className={className} type={type}>
      {children}
    </button>
  )
}
