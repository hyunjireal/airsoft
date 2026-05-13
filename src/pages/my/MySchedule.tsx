import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import arrowRIcon from '../../asset/icons/arrow_r.svg'
import matchPencilIcon from '../../asset/icons/match_pencil.svg'
import matchList01 from '../../asset/images/match_list01.jpg'
import matchList02 from '../../asset/images/match_list02.jpg'
import matchList03 from '../../asset/images/match_list03.jpg'
import { matches } from '../../data/mockData'
import './my.css'

type ScheduleStatus = 'applied' | 'confirmed'
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

const JOINED_MATCH_IDS_KEY = 'joinedMatchIds'
const CANCELED_MATCH_IDS_KEY = 'airsoft:canceled-match-ids'
const CREATED_MATCHES_KEY = 'airsoft:created-matches'

const tabs: ScheduleTab[] = [
  { label: '신청 중', value: 'applied' },
  { label: '확정', value: 'confirmed' },
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
    region: '경기 남부',
    fieldName: '택티쿨 필드',
    currentParticipants: 18,
    maxParticipants: 24,
    imageSrc: matchList03,
  },
]

function readStringList(key: string) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function readCreatedSchedules(): ScheduleMatch[] {
  try {
    const value = JSON.parse(localStorage.getItem(CREATED_MATCHES_KEY) ?? '[]')
    if (!Array.isArray(value)) return []

    return value
      .filter((match) => match && typeof match === 'object' && typeof match.id === 'string')
      .map((match): ScheduleMatch => {
        const type = match.type === 'team' || match.type === 'mercenary' ? match.type : 'personal'
        const imageSrc = type === 'team' ? matchList02 : type === 'mercenary' ? matchList03 : matchList01
        const dateLabel = typeof match.date === 'string' ? match.date.replaceAll('-', '.') : '2026.05.18'

        return {
          id: `created-${match.id}`,
          matchId: match.id,
          status: 'applied',
          type,
          title: typeof match.title === 'string' ? match.title : '내가 만든 매치',
          time: `${dateLabel} · ${typeof match.time === 'string' ? match.time : '14:00'}`,
          region: typeof match.region === 'string' ? match.region : '서울',
          fieldName: typeof match.fieldName === 'string' ? match.fieldName : '어반 CQB',
          currentParticipants: Number(match.currentParticipants) || 1,
          maxParticipants: Number(match.maxParticipants) || 12,
          imageSrc,
          isMine: true,
        }
      })
  } catch {
    return []
  }
}

function createJoinedSchedules(canceledIds: string[]) {
  return readStringList(JOINED_MATCH_IDS_KEY)
    .filter((id) => !canceledIds.includes(id))
    .map((matchId) => matches.find((match) => match.id === matchId))
    .filter((match): match is NonNullable<typeof match> => Boolean(match))
    .map((match): ScheduleMatch => ({
      id: `joined-${match.id}`,
      matchId: match.id,
      status: 'applied',
      type: 'personal',
      title: match.title,
      time: `${match.dateValue?.replaceAll('-', '.') ?? match.date} · ${match.time}`,
      region: match.region,
      fieldName: match.fieldName,
      currentParticipants: match.currentParticipants,
      maxParticipants: match.maxParticipants,
      imageSrc: matchList01,
    }))
}

export function MySchedule() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<ScheduleStatus>('applied')

  const schedules = useMemo(() => {
    const canceledIds = readStringList(CANCELED_MATCH_IDS_KEY)
    const baseSchedules = initialSchedules.filter((schedule) => !canceledIds.includes(schedule.matchId))
    const joinedSchedules = createJoinedSchedules(canceledIds).filter(
      (joined) => !baseSchedules.some((schedule) => schedule.matchId === joined.matchId),
    )

    return [...baseSchedules, ...joinedSchedules, ...readCreatedSchedules()]
  }, [])

  const filteredSchedules = useMemo(
    () => schedules.filter((schedule) => schedule.status === selectedTab),
    [schedules, selectedTab],
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
              const actionTo = match.isMine ? `/match/create?edit=${match.matchId}` : `/match/detail/${match.matchId}`
              const actionLabel = match.isMine ? `${match.title} 수정하기` : `${match.title} 상세 보기`
              const actionIcon = match.isMine ? matchPencilIcon : arrowRIcon

              return (
                <Link className="my_schedule_match_item" to={actionTo} aria-label={actionLabel} key={match.id}>
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
                    <span className="my_schedule_match_arrow_link" aria-hidden="true">
                      <img
                        className={`my_schedule_match_arrow ${match.isMine ? 'is_pencil' : ''}`}
                        src={actionIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
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
