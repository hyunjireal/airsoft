import { Link } from 'react-router-dom'

export function MatchHome() {
  return (
    <div className="page">
      <h1 className="page-title">매치</h1>
      <section className="section">
        <Link className="card" to="/match/list">
          <h2>개인 참가</h2>
          <p>팀이 없어도 참여 가능한 경기를 찾아요.</p>
        </Link>
        <Link className="card" to="/match/filter">
          <h2>일정으로 찾기</h2>
          <p>날짜와 지역을 기준으로 참여 가능한 경기를 확인해요.</p>
        </Link>
        <Link className="card" to="/match/list?beginner=true">
          <h2>초보 환영 경기</h2>
          <p>처음 참여하는 사람도 부담 없는 경기를 모아봐요.</p>
        </Link>
      </section>
    </div>
  )
}
