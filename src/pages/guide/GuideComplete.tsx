import { Link } from 'react-router-dom'

export function GuideComplete() {
  return (
    <div className="page">
      <section className="card">
        <h1>가이드가 완료되었어요</h1>
        <p>이제 질문을 정리하거나 초보 환영 경기를 찾아볼 수 있어요.</p>
      </section>
      <div className="list">
        <Link className="button primary-button" to="/match/list?beginner=true">초보 환영 경기 보기</Link>
        <Link className="button" to="/home">홈으로</Link>
      </div>
    </div>
  )
}
