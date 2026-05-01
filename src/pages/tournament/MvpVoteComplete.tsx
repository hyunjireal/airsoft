import { Link } from 'react-router-dom'

export function MvpVoteComplete() {
  return (
    <div className="page">
      <h1 className="page-title">투표가 완료되었어요</h1>
      <div className="list">
        <Link className="button primary-button" to="/tournament/ranking">현재 랭킹 보기</Link>
        <Link className="button" to="/home">홈으로</Link>
      </div>
    </div>
  )
}
