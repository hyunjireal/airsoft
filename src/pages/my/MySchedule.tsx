import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './my.css'

type ScheduleStatus = 'applied' | 'confirmed' | 'completed'

type ScheduleTab = {
  label: string
  value: ScheduleStatus
}

type ScheduleMatch = {
  id: string
  matchId: string
  status: ScheduleStatus
  title: string
  date: string
  time: string
  place: string
  type: string
  participants: string
}

const tabs: ScheduleTab[] = [
  { label: '신청중', value: 'applied' },
  { label: '확정', value: 'confirmed' },
  { label: '참가완료', value: 'completed' },
]

const initialSchedules: ScheduleMatch[] = [
  {
    id: 'schedule-001',
    matchId: 'match-001',
    status: 'confirmed',
    title: '초보 환영 야외전',
    date: '2026.05.23 토',
    time: '14:00',
    place: '경기 남부 · 택티쿨 필드',
    type: '개인',
    participants: '18/24명',
  },
  {
    id: 'schedule-002',
    matchId: 'match-003',
    status: 'applied',
    title: '서울 CQB 입문 스크림',
    date: '2026.05.18 월',
    time: '12:00',
    place: '서울 · 어반 CQB',
    type: '개인',
    participants: '14/16명',
  },
  {
    id: 'schedule-003',
    matchId: 'match-002',
    status: 'applied',
    title: '포레스트 팀전',
    date: '2026.05.02 토',
    time: '15:30',
    place: '경기 북부 · 포레스트 아레나',
    type: '팀',
    participants: '10/14명',
  },
  {
    id: 'schedule-004',
    matchId: 'match-004',
    status: 'completed',
    title: '월말 팀 스크림',
    date: '2026.04.30 목',
    time: '18:00',
    place: '서울 · 어반 CQB',
    type: '팀',
    participants: '12/16명',
  },
]

export function MySchedule() {
  const [selectedTab, setSelectedTab] = useState<ScheduleStatus>('applied')
  const [schedules, setSchedules] = useState<ScheduleMatch[]>(initialSchedules)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const filteredSchedules = useMemo(
    () => schedules.filter((schedule) => schedule.status === selectedTab),
    [schedules, selectedTab],
  )

  const handleDelete = (id: string) => {
    setRemovingId(id)
    window.setTimeout(() => {
      setSchedules((current) => current.filter((schedule) => schedule.id !== id))
      setRemovingId(null)
    }, 320)
  }

  return (
    <div className="my_schedule_page">
      <header className="my_schedule_header">
        <p className="my_schedule_eyebrow">내 매치 현황</p>
        <h1>확정 일정</h1>
      </header>

      <section className="my_schedule_tabs" aria-label="매치 일정 상태">
        {tabs.map((tab) => (
          <button
            className={`my_schedule_tab ${selectedTab === tab.value ? 'is_active' : ''}`}
            type="button"
            key={tab.value}
            onClick={() => setSelectedTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="my_schedule_list" aria-live="polite">
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <article
              className={`my_schedule_card ${removingId === schedule.id ? 'is_removing' : ''}`}
              key={schedule.id}
            >
              <div className="my_schedule_card_top">
                <span className="my_schedule_badge">{schedule.type}</span>
                <span className="my_schedule_count">{schedule.participants}</span>
              </div>

              <div className="my_schedule_card_body">
                <h2>{schedule.title}</h2>
                <p>{schedule.date} · {schedule.time}</p>
                <p>{schedule.place}</p>
              </div>

              {schedule.status === 'confirmed' ? (
                <div className="my_schedule_actions">
                  <Link className="my_schedule_edit" to={`/match/create?edit=${schedule.matchId}`}>
                    수정
                  </Link>
                  <button
                    className="my_schedule_delete"
                    type="button"
                    onClick={() => handleDelete(schedule.id)}
                    disabled={removingId === schedule.id}
                  >
                    삭제하기
                  </button>
                </div>
              ) : (
                <Link className="my_schedule_detail" to={`/match/${schedule.matchId}`}>
                  상세 보기
                </Link>
              )}
            </article>
          ))
        ) : (
          <article className="my_schedule_empty">
            <strong>{tabs.find((tab) => tab.value === selectedTab)?.label} 일정이 없어요.</strong>
            <p>매치 페이지에서 새로운 일정을 찾아보세요.</p>
          </article>
        )}
      </section>
    </div>
  )
}
