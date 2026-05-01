import { Link } from 'react-router-dom'
import { creators } from '../../data/creators'

export function CreatorList() {
  return (
    <div className="page">
      <h1 className="page-title">크리에이터 리스트</h1>
      <section className="section">
        {creators.map((creator) => (
          <Link className="card creator-list-card" key={creator.id} to={`/creator/${creator.id}`}>
            <div className="card-row">
              <div className="creator-avatar">{creator.rank}</div>
              <div>
                <h2>{creator.nickname}</h2>
                <p>구독자 {creator.subscribers}</p>
              </div>
            </div>
            <div className="chip-row">
              {creator.styleTags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
