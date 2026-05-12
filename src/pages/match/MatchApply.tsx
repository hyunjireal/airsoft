import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import { matches } from '../../data/mockData'
import './match.css'

const CANCELED_MATCH_IDS_KEY = 'airsoft:canceled-match-ids'

const checks = [
  '안전수칙과 현장 규정을 확인했어요.',
  '신청 후 팀장 승인 여부를 기다릴게요.',
  '노쇼 없이 참석하거나 미리 취소 연락할게요.',
]

export function MatchApply() {
  const { id } = useParams()
  const navigate = useNavigate()
  const match = matches.find((item) => item.id === id)
  const [checked, setChecked] = useState<string[]>([])
  const allChecked = checked.length === checks.length

  const toggleAll = () => {
    setChecked((prev) => (prev.length === checks.length ? [] : checks))
  }

  const complete = () => {
    const stored = JSON.parse(localStorage.getItem('joinedMatchIds') || '[]') as string[]
    if (id && !stored.includes(id)) {
      localStorage.setItem('joinedMatchIds', JSON.stringify([...stored, id]))
    }
    if (id) {
      const canceled = JSON.parse(localStorage.getItem(CANCELED_MATCH_IDS_KEY) || '[]') as string[]
      localStorage.setItem(CANCELED_MATCH_IDS_KEY, JSON.stringify(canceled.filter((matchId) => matchId !== id)))
    }
    navigate(`/match/${id}/complete`)
  }

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(`/match/schedule/${id ?? 'match-003'}/join`)
  }

  return (
    <div className="match_apply_page match_flow_page">
      <header className="schedule_join_top match_apply_top">
        <div className="schedule_join_tit match_apply_tit">
          <button className="schedule_join_back" type="button" aria-label="뒤로가기" onClick={goBack}>
            <img src={arrowLIcon} alt="" aria-hidden="true" />
          </button>
          <h1 className="body_b_28">참가신청</h1>
        </div>
      </header>

      <main className="match_apply_main">
        <p className="match_apply_description body_m_16">서울 CQB 입문 경기에 신청할 정보를 입력해주세요.</p>

        <section className="match_apply_summary match_apply_intro_summary">
          <strong>어반 CQB</strong>
          <p>이번 주 일요일 12:00 서울</p>
        </section>

        <section className="match_apply_form" aria-label="신청자 정보">
          <label>
            <span className="match_apply_label">이름 또는 닉네임</span>
            <input className="input" name="nickname" placeholder="예 : 홍길동" />
          </label>
          <label>
            <span className="match_apply_label">연락처</span>
            <input className="input" name="phone" inputMode="tel" placeholder="예 : 010-1234-5678" />
          </label>
          <label>
            <span className="match_apply_label">장비 렌탈 필요 여부</span>
            <select className="select" name="rental" defaultValue="">
              <option value="" disabled>선택해주세요</option>
              <option>렌탈 필요 없음</option>
              <option disabled={!match?.rentalAvailable}>렌탈 필요</option>
            </select>
          </label>
          {match?.beginnerFriendly ? (
            <label>
              <span className="match_apply_label">1:1 멘토링 필요 여부</span>
              <select className="select" name="mentoring" defaultValue="">
                <option value="" disabled>선택해주세요</option>
                <option>멘토링 필요 없음</option>
                <option>멘토링 필요</option>
              </select>
            </label>
          ) : null}
        </section>

        <section className="match_checklist" aria-label="신청 전 체크리스트">
          <label className="match_check_item match_check_all">
            <input type="checkbox" checked={allChecked} onChange={toggleAll} />
            전체 선택
          </label>
          {checks.map((check) => (
            <label className="match_check_item" key={check}>
              <input
                type="checkbox"
                checked={checked.includes(check)}
                onChange={() =>
                  setChecked((prev) => (prev.includes(check) ? prev.filter((item) => item !== check) : [...prev, check]))
                }
              />
              <span>{check}</span>
            </label>
          ))}
        </section>
        <button className="button primary_button" type="button" onClick={complete} disabled={!allChecked}>
          신청 완료하기
        </button>
      </main>
    </div>
  )
}
