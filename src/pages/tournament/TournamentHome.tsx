import { Link } from 'react-router-dom'

export function TournamentHome() {
  return (
    <div className="page">
      <h1 className="page_title">삼삼오오 대회</h1>
      <p className="page_description">하이라이트를 보고 MVP를 직접 투표해요.</p>
      <section className="section">
        <Link className="card" to="/tournament/highlights"><h2>대회 하이라이트</h2></Link>
        <Link className="card" to="/tournament/mvp-vote"><h2>MVP 투표</h2></Link>
        <Link className="card" to="/tournament/ranking"><h2>랭킹 보기</h2></Link>
      </section>
    </div>
  )
}
