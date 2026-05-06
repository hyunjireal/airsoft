import { Link } from 'react-router-dom'
import './match.css'

export function MatchApplyComplete() {
  return (
    <div className="page">
      <section className="card">
        <h1>참가 신청이 완료되었어요</h1>
        <p>내 경기 일정에서 신청한 경기를 다시 확인할 수 있어요.</p>
      </section>
      <div className="list">
        <Link className="button primary_button" to="/my/schedule">내 경기 일정 보기</Link>
        <Link className="button" to="/home">홈으로</Link>
      </div>
    </div>
  )
}
