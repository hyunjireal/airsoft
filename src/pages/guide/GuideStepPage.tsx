import { Link } from 'react-router-dom'
import { guideFlow } from '../../data/guideFlow'
import './Guide.css'

type GuideStepPageProps = {
  stepId: string
}

export function GuideStepPage({ stepId }: GuideStepPageProps) {
  const stepIndex = guideFlow.findIndex((guide) => guide.id === stepId)
  const guide = guideFlow[stepIndex] ?? guideFlow[0]
  const prevGuide = guideFlow[stepIndex - 1]
  const nextGuide = guideFlow[stepIndex + 1]
  const progress = ((stepIndex + 1) / guideFlow.length) * 100

  return (
    <div className="page guide_step_page">
      <div className="guide_step_header">
        <span>{stepIndex + 1} / {guideFlow.length}</span>
        <div className="guide_progress" aria-label={`가이드 진행률 ${stepIndex + 1} / ${guideFlow.length}`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h1 className="page_title">{guide.number} {guide.title}</h1>
      <article className="placeholder_image guide_hero_image" aria-label={`${guide.title} 안내 이미지`}>
        {guide.title}
      </article>

      <p className="page_description">{guide.summary}</p>

      <section className="section">
        <article className="card">
          <h2>꼭 기억해요</h2>
          <ul className="guide_list">
            {guide.remember.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
        <article className="card">
          <h2>이런 행동은 위험해요</h2>
          <ul className="guide_list">
            {guide.warning.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
        <Link className="button" to="/community/beginner">초보 질문방에 물어보기</Link>
      </section>

      <div className="grid_two">
        {prevGuide ? <Link className="button" to={prevGuide.route}>이전</Link> : <Link className="button" to="/guide">목차</Link>}
        <Link className="button primary_button" to={nextGuide ? nextGuide.route : '/guide/complete'}>
          {nextGuide ? '다음' : '완료'}
        </Link>
      </div>
    </div>
  )
}
