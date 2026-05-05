import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { guideFlow } from '../../data/guideFlow'
import './Guide.css'

export function BeginnerHub() {
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const [readGuideIds, setReadGuideIds] = useState<string[]>([])
  const progress = Math.round((readGuideIds.length / guideFlow.length) * 100)
  const completed = readGuideIds.length === guideFlow.length

  const observerOptions = useMemo(
    () => ({
      root: null,
      rootMargin: '0px 0px -30% 0px',
      threshold: 0.55,
    }),
    [],
  )

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        const id = entry.target.getAttribute('data-guide-id')
        if (!id) {
          return
        }

        setReadGuideIds((ids) => (ids.includes(id) ? ids : [...ids, id]))
      })
    }, observerOptions)

    cardRefs.current.forEach((card) => {
      if (card) {
        observer.observe(card)
      }
    })

    return () => observer.disconnect()
  }, [observerOptions])

  return (
    <div className="page guide_intro_page">
      <div className="guide_sticky_progress">
        <div className="guide_step_header">
          <span>{readGuideIds.length} / {guideFlow.length}</span>
          <div className="guide_progress" aria-label={`가이드 진행률 ${progress}%`}>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <h1 className="page_title">초보자 가이드</h1>
      <p className="page_description">처음 필드 가기 전, 카드를 내려보며 꼭 필요한 내용을 확인해요.</p>

      <section className="section">
        <div className="chip_row">
          <span className="chip">약 5분</span>
          <span className="chip">안전/규칙/매너</span>
          <span className="chip">초보자 필수</span>
        </div>
      </section>

      <section className="section">
        {guideFlow.map((guide, index) => (
          <article
            className="card guide_scroll_card"
            data-guide-id={guide.id}
            key={guide.id}
            ref={(element) => {
              cardRefs.current[index] = element
            }}
          >
            <span className="badge">{guide.number}</span>
            <h2>{guide.title}</h2>
            <article className="placeholder_image guide_hero_image" aria-label={`${guide.title} 안내 이미지`}>
              {guide.title}
            </article>
            <p>{guide.summary}</p>
            <div>
              <h3>꼭 기억해요</h3>
              <ul className="guide_list">
                {guide.remember.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3>이런 행동은 위험해요</h3>
              <ul className="guide_list">
                {guide.warning.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </section>

      {completed ? (
        <Link className="button primary_button" to="/guide/complete">가이드 완료하기</Link>
      ) : (
        <button className="button" type="button" disabled>가이드 진행 중 {progress}%</button>
      )}
    </div>
  )
}
