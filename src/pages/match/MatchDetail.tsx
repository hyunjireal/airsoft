import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { matches } from '../../data/mockData'
import { RequireLoginModal } from '../../layout/RequireLoginModal'
import './match.css'

const weekdayFormatter = new Intl.DateTimeFormat('ko-KR', { weekday: 'long' })

function formatMatchDate(match: { date: string; dateValue?: string; time: string }) {
  if (!match.dateValue) return `${match.date} ${match.time}`

  const date = new Date(`${match.dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) return `${match.date} ${match.time}`

  return `${match.date} (${weekdayFormatter.format(date)}) ${match.time}`
}

export function MatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const match = matches.find((item) => item.id === id)

  if (!match) {
    return <div className="page"><h1 className="page_title">경기를 찾을 수 없어요</h1></div>
  }

  const remainingSeats = Math.max(match.maxParticipants - match.currentParticipants, 0)
  const isFull = remainingSeats === 0

  const apply = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate(`/match/${match.id}/apply`)
      return
    }
    setModalOpen(true)
  }

  return (
    <div className="page match_flow_page">
      <section className="match_detail_hero">
        <div className="chip_row">
          <span className="badge">{match.difficulty}</span>
          {match.beginnerFriendly ? <span className="badge">초보 가능</span> : <span className="badge">경험자 위주</span>}
        </div>
        <h1>{match.title}</h1>
        <p>{match.description}</p>
      </section>

      <section className="match_info_grid" aria-label="모집글 핵심 정보">
        <article className="match_info_card">
          <span>필드</span>
          <strong>{match.fieldName}</strong>
          <p>{match.region}{match.fieldAddress ? ` · ${match.fieldAddress}` : ''}</p>
          <Link className="match_inline_link" to="/match/fields">필드 정보 보기</Link>
        </article>
        <article className="match_info_card">
          <span>일정</span>
          <strong>{formatMatchDate(match)}</strong>
          <p>참가비 {match.fee}</p>
        </article>
        <article className="match_info_card">
          <span>참여 조건</span>
          <strong>{isFull ? '모집 마감' : `${remainingSeats}자리 남음`}</strong>
          <p>{match.currentParticipants} / {match.maxParticipants}명 참여 중 · {match.difficulty}</p>
        </article>
      </section>

      <section className="section">
        <article className="match_notice_panel">
          <h2>준비물</h2>
          <ul>
            {(match.preparationItems ?? ['고글', '장갑', '편한 신발', '현장 규정 확인']).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="match_support_text">
            장비 렌탈: {match.rentalAvailable ? '가능합니다. 신청서에서 렌탈 필요 여부를 표시해주세요.' : '제공되지 않아요. 개인 장비를 준비해주세요.'}
          </p>
        </article>

        <article className="match_notice_panel">
          <h2>숙련도 안내</h2>
          <p>{match.skillGuide ?? (match.beginnerFriendly ? '초보자도 참여할 수 있는 일정입니다.' : '숙련자 위주로 진행되는 일정입니다.')}</p>
        </article>

        <article className="match_notice_panel">
          <h2>{match.organizerName ?? '모집자'} 전달사항</h2>
          <p>{match.organizerNotice ?? '현장 운영 안내와 팀장 승인 메시지를 신청 후 꼭 확인해주세요.'}</p>
        </article>
      </section>

      <button className="button primary_button" type="button" onClick={apply} disabled={isFull}>
        {isFull ? '모집 마감' : '참가 신청하기'}
      </button>
      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
