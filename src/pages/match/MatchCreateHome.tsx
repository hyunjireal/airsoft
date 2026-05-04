import { Link } from 'react-router-dom'

export function MatchCreateHome() {
  return (
    <div className="page">
      <h1 className="page_title">만들기</h1>
      <section className="section">
        <Link className="card" to="/team/create">
          <h2>팀 만들기</h2>
          <p>새 팀을 만들고 팀원 모집을 시작해요.</p>
        </Link>
        <Link className="card" to="/mercenary/create">
          <h2>용병 모집</h2>
          <p>우리 팀 경기에 필요한 게스트를 모집해요.</p>
        </Link>
        <Link className="card" to="/match/create/game">
          <h2>경기 생성</h2>
          <p>날짜, 장소, 난이도, 참가 조건을 설정해요.</p>
        </Link>
      </section>
    </div>
  )
}
