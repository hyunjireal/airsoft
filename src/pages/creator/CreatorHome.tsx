import { Link } from 'react-router-dom'
import { creators, mediaContents } from '../../data/creators'

export function CreatorHome() {
  const rankedCreators = [...creators].sort((a, b) => a.rank - b.rank)

  return (
    <div className="page">
      <h1 className="page-title">크리에이터</h1>

      <section className="section">
        <div className="card-row">
          <span className="badge">랭킹</span>
          <h2 className="section-title">크리에이터 랭킹</h2>
        </div>
        <div className="creator-rank-row">
          {rankedCreators.map((creator) => (
            <Link className="creator-rank-item" key={creator.id} to={`/creator/${creator.id}`}>
              <div className="creator-avatar">{creator.rank}</div>
              <strong>{creator.nickname}</strong>
            </Link>
          ))}
        </div>
        <Link className="button" to="/creator/list">더 보러가기</Link>
      </section>

      <section className="section">
        <div className="card-row">
          <span className="badge">미디어</span>
          <h2 className="section-title">미디어 컨텐츠</h2>
        </div>
        {mediaContents.map((content) => {
          const creator = creators.find((item) => item.id === content.creatorId)
          return (
            <Link className="card media-card" key={content.id} to={`/creator/${content.creatorId}`}>
              <div className="placeholder-image">영상 하이라이트 썸네일</div>
              <h2>{content.title}</h2>
              <p>{content.summary}</p>
              <span className="muted">by {creator?.nickname}</span>
            </Link>
          )
        })}
      </section>
    </div>
  )
}
