import { Link } from 'react-router-dom'

export function CommunityHome() {
  return (
    <div className="page">
      <h1 className="page_title">커뮤니티</h1>
      <section className="section">
        <Link className="card beginner_community_card" to="/community/beginner">
          <span className="badge">뉴비 전용</span>
          <h2>초보 게시판</h2>
          <p>입문자 질문과 베테랑 멘토 답변이 모이는 안전한 질문방입니다.</p>
        </Link>
        <Link className="card" to="/community/free">
          <span className="badge">전체 이용</span>
          <h2>일반 게시판</h2>
          <p>자유글, 후기, 팁, 공지 등 일반 커뮤니티 게시판을 확인해요.</p>
        </Link>
      </section>
    </div>
  )
}
