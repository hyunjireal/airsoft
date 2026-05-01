import { Link } from 'react-router-dom'

export function GuestStart() {
  return (
    <main className="mobile-frame standalone-page">
      <section className="card">
        <h1>비회원으로 둘러볼 수 있어요</h1>
        <p>다만 경기 신청, 글 작성, MVP 투표, 팀/용병 모집 참여는 로그인이 필요해요.</p>
      </section>
      <Link className="button primary-button" to="/home">둘러보기 시작</Link>
      <Link className="button" to="/login">로그인하기</Link>
    </main>
  )
}
