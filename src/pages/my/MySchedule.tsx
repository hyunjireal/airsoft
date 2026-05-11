import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import arrowRIcon from '../../asset/icons/arrow_r.svg'
import matchPencilIcon from '../../asset/icons/match_pencil.svg'
import matchList01 from '../../asset/images/match_list01.jpg'
import matchList02 from '../../asset/images/match_list02.jpg'
import matchList03 from '../../asset/images/match_list03.jpg'
import './my.css'

type ScheduleStatus = 'applied' | 'confirmed' | 'completed'
type MatchType = 'personal' | 'team' | 'mercenary'

type ScheduleTab = {
  label: string
  value: ScheduleStatus
}

type ScheduleMatch = {
  id: string
  matchId: string
  status: ScheduleStatus
  type: MatchType
  title: string
  time: string
  region: string
  fieldName: string
  currentParticipants: number
  maxParticipants: number
  imageSrc: string
  isMine?: boolean
}

const tabs: ScheduleTab[] = [
  { label: '신청 중', value: 'applied' },
  { label: '확정', value: 'confirmed' },
  { label: '참가완료', value: 'completed' },
]

const initialSchedules: ScheduleMatch[] = [
  {
    id: 'schedule-001',
    matchId: 'match-003',
    status: 'applied',
    type: 'personal',
    title: '서울 CQB 입문 스크림',
    time: '2026.05.18 · 12:00',
    region: '서울',
    fieldName: '강남 CQB',
    currentParticipants: 14,
    maxParticipants: 16,
    imageSrc: matchList01,
  },
  {
    id: 'schedule-002',
    matchId: 'match-002',
    status: 'applied',
    type: 'team',
    title: '포레스트 팀전',
    time: '2026.05.02 · 15:30',
    region: '경기 북부',
    fieldName: '포레스트 아레나',
    currentParticipants: 10,
    maxParticipants: 14,
    imageSrc: matchList02,
  },
  {
    id: 'schedule-003',
    matchId: 'match-001',
    status: 'confirmed',
    type: 'personal',
    title: '초보 환영 야외전',
    time: '2026.05.23 · 14:00',
    region: '경기 하남',
    fieldName: '택티컬 필드',
    currentParticipants: 18,
    maxParticipants: 24,
    imageSrc: matchList03,
    isMine: true,
  },
  {
    id: 'schedule-004',
    matchId: 'match-004',
    status: 'completed',
    type: 'team',
    title: '야간 팀 스크림',
    time: '2026.04.30 · 18:00',
    region: '서울',
    fieldName: '강남 CQB',
    currentParticipants: 12,
    maxParticipants: 16,
    imageSrc: matchList01,
  },
]

export function MySchedule() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<ScheduleStatus>('applied')

  const filteredSchedules = useMemo(
    () => initialSchedules.filter((schedule) => schedule.status === selectedTab),
    [selectedTab],
  )

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/my')
  }

  return (
    <div className="my_schedule_page">
      <header className="my_schedule_top">
        <div className="my_schedule_tit">
          <button className="my_schedule_back" type="button" aria-label="뒤로가기" onClick={goBack}>
            <img src={arrowLIcon} alt="" aria-hidden="true" />
          </button>
          <h1 className="body_b_28">내 매치 현황</h1>
        </div>
      </header>

      <section className="my_schedule_tabs" aria-label="매치 현황 상태">
        {tabs.map((tab) => (
          <button
            className={`my_schedule_tab body_m_16 ${selectedTab === tab.value ? 'is_active' : ''}`}
            type="button"
            key={tab.value}
            onClick={() => setSelectedTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="my_schedule_list_section" aria-live="polite">
        {filteredSchedules.length > 0 ? (
          <div className="my_schedule_match_list">
            {filteredSchedules.map((match) => {
              const actionTo = match.isMine ? `/match/create?edit=${match.matchId}` : `/match/${match.matchId}`
              const actionLabel = match.isMine ? `${match.title} 수정하기` : `${match.title} 상세 보기`
              const actionIcon = match.isMine ? matchPencilIcon : arrowRIcon

              return (
                <div className="my_schedule_match_item" key={match.id}>
                  <div className="my_schedule_match_bottom">
                    <div className="my_schedule_match_media">
                      <img className="my_schedule_match_thumb" src={match.imageSrc} alt="" aria-hidden="true" />
                      <div className="my_schedule_match_info">
                        <strong className="my_schedule_match_title">{match.title}</strong>
                        <div className="my_schedule_match_meta">
                          <p className="my_schedule_match_meta_row">
                            <span className="my_schedule_match_meta_label">시간</span>
                            <span className="my_schedule_match_meta_value">{match.time}</span>
                          </p>
                          <p className="my_schedule_match_meta_row">
                            <span className="my_schedule_match_meta_label">장소</span>
                            <span className="my_schedule_match_meta_value">
                              {match.region} · {match.fieldName}
                            </span>
                          </p>
                        </div>
                        <p className="my_schedule_match_meta_row">
                          <span className="my_schedule_match_meta_label">인원</span>
                          <span className="my_schedule_match_meta_value">
                            {match.currentParticipants}/{match.maxParticipants}명
                          </span>
                        </p>
                      </div>
                    </div>
                    <Link className="my_schedule_match_arrow_link" to={actionTo} aria-label={actionLabel}>
                      <img
                        className={`my_schedule_match_arrow ${match.isMine ? 'is_pencil' : ''}`}
                        src={actionIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <article className="my_schedule_empty">
            <strong>{tabs.find((tab) => tab.value === selectedTab)?.label} 매치가 없어요</strong>
            <p>매치 페이지에서 새로운 일정을 찾아보세요.</p>
          </article>
        )}
      </section>
    </div>
  )
}
