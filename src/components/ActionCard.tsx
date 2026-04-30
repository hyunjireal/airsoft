import { Link } from 'react-router-dom'
import { Card } from './Card'

interface ActionCardProps {
  title: string
  description: string
  to: string
  cta?: string
}

export function ActionCard({ title, description, to, cta = '이동하기' }: ActionCardProps) {
  return (
    <Card className="action-card">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Link to={to}>{cta}</Link>
    </Card>
  )
}
