import { Link } from 'react-router-dom'
import { guideChecklist } from '../../data/guideFlow'
import './Guide.css'

export function GuideComplete() {
  return (
    <div className="page guide_complete_page">
      <section className="card guide_complete_hero">
        <span className="guide_complete_icon" aria-hidden="true">✓</span>
        <h1>가이드 완료</h1>
        <p>첫 게임 전 기본 규칙을 확인했어요. 이제 필드에서 더 안전하고 즐겁게 즐겨요!</p>
      </section>

      <section className="section">
        <h2 className="section_title">마지막 체크</h2>
        <article className="card">
          {guideChecklist.map((item) => (
            <label className="guide_check_item" key={item}>
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </article>
      </section>

      <section className="section">
        <Link className="card guide_next_card" to="/guide/quiz">
          <h2>초보자 퀴즈 참여하기</h2>
          <span aria-hidden="true">›</span>
        </Link>
        <Link className="card guide_next_card" to="/community/beginner">
          <h2>초보 질문방으로 가기</h2>
          <span aria-hidden="true">›</span>
        </Link>
        <Link className="card guide_next_card" to="/match/list?beginner=true">
          <h2>매치 찾으러 가기</h2>
          <span aria-hidden="true">›</span>
        </Link>
      </section>
    </div>
  )
}
