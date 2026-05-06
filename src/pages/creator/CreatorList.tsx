import { Link } from 'react-router-dom'
import { creators } from '../../data/creators'
import './Creator.css'

export function CreatorList() {
  return (
    <div className="page">
      <h1 className="page_title">크리에이터 리스트</h1>
      <section className="section">
        {creators.map((creator) => (
          <Link className="card creator_list_card" key={creator.id} to={`/creator/${creator.id}`}>
            <div className="card_row">
              <div className="creator_avatar">{creator.rank}</div>
              <div>
                <h2>{creator.nickname}</h2>
                <p>구독자 {creator.subscribers}</p>
              </div>
            </div>
            <div className="chip_row">
              {creator.styleTags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
