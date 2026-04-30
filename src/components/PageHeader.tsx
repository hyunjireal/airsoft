import { Link } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  description: string
  backTo?: string
}

export function PageHeader({ title, description, backTo }: PageHeaderProps) {
  return (
    <header className="page-header">
      {backTo ? (
        <Link className="page-header__back" to={backTo}>
          뒤로가기
        </Link>
      ) : null}
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  )
}
