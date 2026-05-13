import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import './match.css'

type CreatedMatch = {
  id: string
  type?: string
  title?: string
  date?: string
  time?: string
  region?: string
  fieldName?: string
  currentParticipants?: number
  maxParticipants?: number
  recruitType?: string
}

type ManagedTeamSchedule = {
  id: string
  title: string
  date: string
  time: string
  region: string
  fieldName: string
  currentParticipants: number
  maxParticipants: number
}

const CREATED_MATCHES_KEY = 'airsoft:created-matches'
const DELETED_TEAM_SCHEDULE_IDS_KEY = 'airsoft:deleted-team-manage-ids'

const defaultTeamSchedules: ManagedTeamSchedule[] = [
  {
    id: 'team-manage-001',
    date: '2026-05-18',
    title: '주말 포레스트 매치',
    time: '15:30',
    region: '경기 북부',
    fieldName: '포레스트 아레나',
    currentParticipants: 22,
    maxParticipants: 30,
  },
  {
    id: 'team-manage-002',
    date: '2026-05-24',
    title: 'GUNIT 정기전',
    time: '13:00',
    region: '서울',
    fieldName: '어반 CQB',
    currentParticipants: 20,
    maxParticipants: 28,
  },
  {
    id: 'team-manage-003',
    date: '2026-06-01',
    title: '야간 CQB 연습전',
    time: '20:00',
    region: '서울',
    fieldName: '강남 CQB',
    currentParticipants: 10,
    maxParticipants: 16,
  },
]

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

function readCreatedMatches(): CreatedMatch[] {
  try {
    const value = JSON.parse(localStorage.getItem(CREATED_MATCHES_KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function writeCreatedMatches(value: CreatedMatch[]) {
  localStorage.setItem(CREATED_MATCHES_KEY, JSON.stringify(value))
}

function readDeletedScheduleIds() {
  try {
    const value = JSON.parse(localStorage.getItem(DELETED_TEAM_SCHEDULE_IDS_KEY) ?? '[]')
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function writeDeletedScheduleIds(value: string[]) {
  localStorage.setItem(DELETED_TEAM_SCHEDULE_IDS_KEY, JSON.stringify(Array.from(new Set(value))))
}

function isTeamMatch(match: CreatedMatch) {
  return match.type === 'team' || match.recruitType === 'team'
}

function toManagedSchedule(match: CreatedMatch): ManagedTeamSchedule | null {
  if (typeof match.id !== 'string') return null

  return {
    id: match.id,
    title: typeof match.title === 'string' ? match.title : '팀 매치',
    date: typeof match.date === 'string' ? match.date : '2026-05-18',
    time: typeof match.time === 'string' ? match.time : '14:00',
    region: typeof match.region === 'string' ? match.region : '서울',
    fieldName: typeof match.fieldName === 'string' ? match.fieldName : '어반 CQB',
    currentParticipants: Number(match.currentParticipants) || 1,
    maxParticipants: Number(match.maxParticipants) || 16,
  }
}

function toCreatedMatch(schedule: ManagedTeamSchedule): CreatedMatch {
  return {
    id: schedule.id,
    type: 'team',
    recruitType: 'team',
    title: schedule.title,
    date: schedule.date,
    time: schedule.time,
    region: schedule.region,
    fieldName: schedule.fieldName,
    currentParticipants: schedule.currentParticipants,
    maxParticipants: schedule.maxParticipants,
  }
}

function sortSchedules(a: ManagedTeamSchedule, b: ManagedTeamSchedule) {
  const dateCompare = a.date.localeCompare(b.date)
  if (dateCompare !== 0) return dateCompare

  return a.time.localeCompare(b.time)
}

function buildManagedSchedules() {
  const deletedIds = new Set(readDeletedScheduleIds())
  const savedTeamSchedules = readCreatedMatches()
    .filter((match): match is CreatedMatch => Boolean(match) && typeof match === 'object' && isTeamMatch(match))
    .map(toManagedSchedule)
    .filter((schedule): schedule is ManagedTeamSchedule => Boolean(schedule))

  const savedScheduleMap = new Map(savedTeamSchedules.map((schedule) => [schedule.id, schedule]))
  const defaultScheduleIds = new Set(defaultTeamSchedules.map((schedule) => schedule.id))

  const mergedDefaults = defaultTeamSchedules
    .filter((schedule) => !deletedIds.has(schedule.id))
    .map((schedule) => savedScheduleMap.get(schedule.id) ?? schedule)

  const extraSavedSchedules = savedTeamSchedules.filter((schedule) => !defaultScheduleIds.has(schedule.id))

  return [...mergedDefaults, ...extraSavedSchedules].sort(sortSchedules)
}

function formatDisplayDate(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return dateValue.replaceAll('-', '.')
  }

  const weekday = weekdays[date.getDay()]
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day} (${weekday})`
}

export function MatchManageHome() {
  const navigate = useNavigate()
  const [schedules, setSchedules] = useState<ManagedTeamSchedule[]>(() => buildManagedSchedules())

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/match')
  }

  const handleEdit = (schedule: ManagedTeamSchedule) => {
    const savedMatches = readCreatedMatches()
    const hasSavedMatch = savedMatches.some((match) => match && typeof match === 'object' && match.id === schedule.id)

    if (!hasSavedMatch) {
      writeCreatedMatches([toCreatedMatch(schedule), ...savedMatches])
    }

    writeDeletedScheduleIds(readDeletedScheduleIds().filter((item) => item !== schedule.id))
    navigate(`/match/create?edit=${schedule.id}`)
  }

  const handleDelete = (schedule: ManagedTeamSchedule) => {
    const shouldDelete = window.confirm(`"${schedule.title}" 일정을 삭제할까요?`)
    if (!shouldDelete) return

    const savedMatches = readCreatedMatches().filter((match) => !match || typeof match !== 'object' || match.id !== schedule.id)
    writeCreatedMatches(savedMatches)

    if (defaultTeamSchedules.some((item) => item.id === schedule.id)) {
      writeDeletedScheduleIds([...readDeletedScheduleIds(), schedule.id])
    }

    setSchedules((current) => current.filter((item) => item.id !== schedule.id))
  }

  return (
    <div className="match_page match_manage_page">
      <header className="match_page_header match_manage_page_header">
        <button className="match_page_back_button" type="button" aria-label="뒤로가기" onClick={goBack}>
          <img src={arrowLIcon} alt="" aria-hidden="true" />
        </button>
        <h1 className="match_page_title">팀 관리</h1>
      </header>

      <section className="match_manage_list_section" aria-live="polite">
        {schedules.length > 0 ? (
          <div className="match_manage_list">
            {schedules.map((schedule) => (
              <article className="match_manage_card" key={schedule.id}>
                <div className="match_manage_card_body">
                  <p className="match_manage_card_date">{formatDisplayDate(schedule.date)}</p>
                  <h2 className="match_manage_card_title">{schedule.title}</h2>
                  <div className="match_manage_meta_list">
                    <p className="match_manage_meta_row">
                      <span className="match_manage_meta_label">시간</span>
                      <span className="match_manage_meta_value">{schedule.time}</span>
                    </p>
                    <p className="match_manage_meta_row">
                      <span className="match_manage_meta_label">장소</span>
                      <span className="match_manage_meta_value">{schedule.region} · {schedule.fieldName}</span>
                    </p>
                    <p className="match_manage_meta_row">
                      <span className="match_manage_meta_label">인원</span>
                      <span className="match_manage_meta_value">{schedule.currentParticipants}/{schedule.maxParticipants}명</span>
                    </p>
                  </div>
                </div>

                <div className="match_manage_actions">
                  <button
                    className="match_manage_action_button is_edit"
                    type="button"
                    onClick={() => handleEdit(schedule)}
                  >
                    수정
                  </button>
                  <button
                    className="match_manage_action_button is_delete"
                    type="button"
                    onClick={() => handleDelete(schedule)}
                  >
                    삭제
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className="match_manage_empty">
            <strong>관리 중인 팀 일정이 없어요.</strong>
            <p>새 팀 매치를 만들고 일정 변경이 필요할 때 이곳에서 바로 관리해 보세요.</p>
            <Link className="match_full_button match_dark_button" to="/match/create?kind=team">
              팀 일정 만들기
            </Link>
          </article>
        )}
      </section>

      <section className="match_manage_notice" aria-labelledby="match-manage-notice-title">
        <h2 id="match-manage-notice-title">안내</h2>
        <ul>
          <li>내가 만든 팀 일정은 수정 및 삭제가 가능합니다.</li>
          <li>팀 일정은 팀원 모두에게 공유됩니다.</li>
          <li>일정 변경 시 팀원에게 알림이 발송됩니다.</li>
        </ul>
      </section>
    </div>
  )
}
