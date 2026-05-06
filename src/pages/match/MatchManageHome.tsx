import { Link } from 'react-router-dom'
import './match.css'

export function MatchManageHome() {
  return (
    <div className="page">
      <h1 className="page_title">관리하기</h1>
      <section className="section">
        <Link className="card" to="/my/applications">
          <h2>개인</h2>
          <p>개인 참가 신청과 내 경기 일정을 확인해요.</p>
        </Link>
        <Link className="card" to="/team">
          <h2>팀</h2>
          <p>팀 단위 신청, 팀원 모집, 팀 정보를 관리해요.</p>
        </Link>
      </section>
    </div>
  )
}
