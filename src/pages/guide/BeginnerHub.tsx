import { Link } from 'react-router-dom'
import { guideCards } from '../../data/mockData'

export function BeginnerHub() {
  return (
    <div className="page">
      <h1 className="page-title">초보자 가이드</h1>
      <p className="page-description">경기장에 가기 전 꼭 알아야 할 내용을 순서대로 확인해요.</p>
      <section className="section">
        {guideCards.map((guide) => (
          <Link className="card" key={guide.id} to={guide.route}>
            <span className="badge">{guide.required ? '필수' : '선택'}</span>
            <h2>{guide.title}</h2>
            <p>{guide.description}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
