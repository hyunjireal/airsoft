interface BadgeProps {
  children: React.ReactNode
  tone?: 'default' | 'primary' | 'muted'
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}
