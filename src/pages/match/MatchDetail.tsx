import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { matches } from '../../data/mockData'
import { RequireLoginModal } from '../../layout/RequireLoginModal'
import './match.css'

export function MatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const match = matches.find((item) => item.id === id)

  if (!match) {
    return <div className="page"><h1 className="page_title">경기를 찾을 수 없어요</h1></div>
  }

  const apply = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate(`/match/${match.id}/apply`)
      return
    }
    setModalOpen(true)
  }

  return (
    <div className="page">
      <h1 className="page_title">{match.title}</h1>
      <section className="section">
        <article className="card"><h2>경기 기본 정보</h2><p>{match.date} {match.time} / {match.region}</p></article>
        <article className="card"><h2>참여 조건</h2><p>{match.difficulty} / {match.currentParticipants}명 참여 중</p></article>
        <article className="card"><h2>준비물</h2><p>고글, 장갑, 편한 신발, 현장 규정 확인</p></article>
        <article className="card"><h2>초보자 확인사항</h2><p>{match.beginnerFriendly ? '초보자 참여 가능' : '경험자 중심 경기'}</p></article>
        <article className="card">
          <h2>위치/필드 정보</h2>
          <p>{match.fieldName}</p>
          <Link className="button" to="/match/fields">필드 정보 보기</Link>
        </article>
        <article className="card"><h2>참가 인원</h2><p>{match.currentParticipants} / {match.maxParticipants}</p></article>
      </section>
      <button className="button primary_button" type="button" onClick={apply}>참가 신청하기</button>
      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
