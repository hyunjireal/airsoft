import { Link } from 'react-router-dom'

export function MatchHome() {
  return (
    <div className="page">
      <h1 className="page_title">매치</h1>
      <section className="section">
        <Link className="card" to="/match/join">
          <h2>참여하기</h2>
          <p>개인, 팀, 게스트 방식으로 참가할 매치를 찾아요.</p>
        </Link>
        <Link className="card" to="/match/create">
          <h2>만들기</h2>
          <p>팀 만들기, 용병 모집, 경기 생성을 시작해요.</p>
        </Link>
        <Link className="card" to="/tournament">
          <h2>토너먼트</h2>
          <p>대회 메뉴는 단일 메뉴로 이동해요.</p>
        </Link>
        <Link className="card" to="/match/manage">
          <h2>관리하기</h2>
          <p>개인 신청과 팀 신청 상태를 확인해요.</p>
        </Link>
        <Link className="card" to="/match/fields">
          <h2>필드정보</h2>
          <p>필드 규정과 이용 정보를 확인해요.</p>
        </Link>
      </section>
    </div>
  )
}
