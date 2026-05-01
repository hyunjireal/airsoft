import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RequireLoginModal } from '../../layout/RequireLoginModal'

const certifiedGuides = [
  {
    title: '인증 가이드: 칼라파트와 법규 기본 체크',
    description: '주황색 칼라파트, 외관 변경, 운반 시 주의사항을 초보자 기준으로 정리했어요.',
  },
  {
    title: '인증 가이드: 첫 렌탈 장비 확인 순서',
    description: '고글, 탄창, 배터리, 탄속 측정까지 현장에서 확인할 순서를 안내해요.',
  },
  {
    title: '인증 가이드: 필드 매너와 히트 선언',
    description: '처음 게임에 들어가기 전 꼭 알아야 할 기본 매너를 모아놨어요.',
  },
]

const beginnerPosts = [
  {
    title: '입문용 전동건은 렌탈로 먼저 시작해도 괜찮나요?',
    author: '뉴비_하남',
    level: '입문자',
    comments: 6,
    answeredBy: '베테랑 멘토 답변 완료',
    tags: ['#장비추천 🔫', '#뉴비필독'],
  },
  {
    title: '탄속 측정할 때 어떤 걸 준비해야 하나요?',
    author: '첫필드준비',
    level: '입문자',
    comments: 4,
    answeredBy: 'AI가 답변완료',
    tags: ['#법규/규정 🚨', '#필드매너 🤝'],
  },
]

export function BeginnerBoard() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const userLevel = localStorage.getItem('level') || '입문자'
  const canWrite = userLevel === '입문자'

  const write = () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      setModalOpen(true)
      return
    }

    if (canWrite) {
      navigate('/community/post/create')
      return
    }

    window.alert('초보 질문방은 입문자만 글을 작성할 수 있어요. 숙련자는 댓글로 답변을 남겨주세요.')
  }

  return (
    <div className="page">
      <section className="section">
        <article className="card beginner-board-hero">
          <span className="badge">🌱 뉴비 전용</span>
          <h1 className="page-title">🌱 초보 질문방 (뉴비 전용)</h1>
          <p>눈치 보지 말고 마음껏 물어보세요! 입문자만 질문할 수 있고, 베테랑 멘토들이 다정하게 답해주는 안전한 공간이에요.</p>
          <div className="chip-row">
            <span className="chip">현재 작성 권한: {userLevel}</span>
            <span className="chip">입문자 작성 가능</span>
            <span className="chip">숙련자 댓글 가능</span>
          </div>
        </article>

        <button className="button" type="button" onClick={() => setSearchOpen((open) => !open)}>
          검색
        </button>

        {searchOpen ? (
          <article className="card search-panel">
            <label className="field">
              초보 질문방 검색
              <input className="input" placeholder="무엇이든 검색해보세요 (예: 입문용 전동건 추천)" />
            </label>
            <div className="scroll-chip-row" aria-label="태그 필터">
              <button className="chip" type="button">#법규/규정 🚨</button>
              <button className="chip" type="button">#장비추천 🔫</button>
              <button className="chip" type="button">#수리/튜닝 🛠️</button>
              <button className="chip" type="button">#필드매너 🤝</button>
            </div>
            <button className="button primary-button" type="button">검색하기</button>
          </article>
        ) : null}
      </section>

      <section className="section">
        <div className="card-row">
          <span className="badge">인증됨</span>
          <h2 className="section-title">초보자용 앱 공식 가이드</h2>
        </div>
        {certifiedGuides.map((guide) => (
          <article className="card certified-guide-card" key={guide.title}>
            <h3>{guide.title}</h3>
            <p>{guide.description}</p>
          </article>
        ))}
      </section>

      <section className="section">
        <div className="card-row">
          <span className="badge">Q&A</span>
          <h2 className="section-title">뉴비 질문 모음</h2>
        </div>
        <button className="button primary-button" type="button" onClick={write}>입문자 질문 작성하기</button>
        {beginnerPosts.map((post) => (
          <article className="card beginner-post-card" key={post.title}>
            <span className="badge">{post.level}</span>
            <h3>{post.title}</h3>
            <p>{post.author} / 댓글 {post.comments}개 / {post.answeredBy}</p>
            <div className="chip-row">
              {post.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
            </div>
          </article>
        ))}
      </section>

      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
