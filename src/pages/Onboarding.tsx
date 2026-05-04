import { Link } from 'react-router-dom'

export function Onboarding() {
  return (
    <main className="mobile_frame standalone_page">
      <section className="list">
        <div className="card">
          <h2>처음이어도 괜찮아요</h2>
          <p>안전수칙부터 경기 참여까지, 필요한 흐름만 먼저 안내할게요.</p>
        </div>
        <div className="card">
          <h2>팀이 없어도 참여할 수 있어요</h2>
          <p>개인 참가, 용병 모집, 게스트 모집 흐름을 한 곳에서 확인할 수 있어요.</p>
        </div>
        <div className="card">
          <h2>궁금한 건 바로 물어보세요</h2>
          <p>기초 질문은 AI에게 먼저 묻고, 필요한 경우 커뮤니티 답변까지 이어갈 수 있어요.</p>
        </div>
      </section>
      <Link className="button primary_button" to="/login">로그인하기</Link>
      <Link className="button" to="/signup">회원가입</Link>
      <Link className="button" to="/guest-start">비회원으로 둘러보기</Link>
    </main>
  )
}
