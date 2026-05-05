import { Link } from 'react-router-dom'
import { highlights } from '../../data/mockData'

export function MvpVoteComplete() {
  const votedMvpId = localStorage.getItem('votedMvpId')
  const ranking = [...highlights]
    .map((item) => ({
      ...item,
      currentVotes: item.votes + (item.id === votedMvpId ? 1 : 0),
      voted: item.id === votedMvpId,
    }))
    .sort((a, b) => b.currentVotes - a.currentVotes)

  return (
    <div className="page">
      <h1 className="page_title">투표가 완료되었어요</h1>
      <p className="page_description">내 투표를 반영한 현재 랭킹 상황이에요.</p>
      <section className="section">
        {ranking.map((item, index) => (
          <article className="card" key={item.id}>
            <span className="badge">{index + 1}위{item.voted ? ' · 내 투표' : ''}</span>
            <h2>{item.playerName}</h2>
            <p>{item.teamName}</p>
            <p>현재 투표수 {item.currentVotes}</p>
            <Link className="button" to={`/tournament/highlights/${item.id}`}>하이라이트 보기</Link>
          </article>
        ))}
      </section>
      <div className="list">
        <Link className="button primary_button" to="/tournament/ranking">현재 랭킹 보기</Link>
        <Link className="button" to="/home">홈으로</Link>
      </div>
    </div>
  )
}
