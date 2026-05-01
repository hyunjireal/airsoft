import { Link } from 'react-router-dom'
import { boardNames } from '../../data/copy'

export function CommunityHome() {
  return (
    <div className="page">
      <h1 className="page-title">커뮤니티</h1>
      <section className="section">
        {Object.entries(boardNames).map(([type, name]) => (
          <Link className="card" key={type} to={`/community/${type}`}>
            <h2>{name}</h2>
          </Link>
        ))}
      </section>
    </div>
  )
}
