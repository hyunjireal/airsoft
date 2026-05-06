import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './match.css'

type MatchType = 'personal' | 'team' | 'mercenary'

type MatchSchedule = {
  id: string
  type: MatchType
  title: string
  time: string
  region: string
  fieldName: string
  difficulty: string
  currentParticipants: number
  maxParticipants: number
  action: string
}

type MatchTypeFilter = 'all' | MatchType

const typeFilters: Array<{ label: string; value: MatchTypeFilter }> = [
  { label: '전체', value: 'all' },
  { label: '개인', value: 'personal' },
  { label: '팀', value: 'team' },
  { label: '용병', value: 'mercenary' },
]

const weekDays = ['월', '화', '수', '목', '금', '토', '일']

const calendarDays: Array<{ label: string; muted?: boolean; types?: MatchType[] }> = [
  { label: '27', muted: true },
  { label: '28', muted: true },
  { label: '29', muted: true },
  { label: '30', muted: true },
  { label: '1' },
  { label: '2', types: ['personal', 'team'] },
  { label: '3', types: ['mercenary'] },
  { label: '4' },
  { label: '5' },
  { label: '6' },
  { label: '7' },
  { label: '8' },
  { label: '9', types: ['personal'] },
  { label: '10', types: ['team'] },
  { label: '11' },
  { label: '12', types: ['personal'] },
  { label: '13' },
  { label: '14' },
  { label: '15', types: ['mercenary'] },
  { label: '16', types: ['team'] },
  { label: '17', types: ['personal'] },
  { label: '18', types: ['personal', 'team', 'mercenary'] },
  { label: '19' },
  { label: '20' },
  { label: '21', types: ['team'] },
  { label: '22' },
  { label: '23', types: ['personal', 'team'] },
  { label: '24', types: ['mercenary'] },
  { label: '25' },
  { label: '26', types: ['team'] },
  { label: '27' },
  { label: '28' },
  { label: '29' },
  { label: '30', types: ['personal', 'team', 'mercenary'] },
  { label: '31', types: ['team'] },
]

const defaultMatchByType: Record<MatchType, Omit<MatchSchedule, 'id' | 'type'>> = {
  personal: {
    title: '초보 환영 야외전',
    time: '14:00',
    region: '경기 남부',
    fieldName: '택티쿨 필드',
    difficulty: '입문자',
    currentParticipants: 18,
    maxParticipants: 24,
    action: '상세 보기',
  },
  team: {
    title: '팀 단위 전술 스크림',
    time: '15:30',
    region: '경기 북부',
    fieldName: '포레스트 아레나',
    difficulty: '팀',
    currentParticipants: 12,
    maxParticipants: 16,
    action: '상세 보기',
  },
  mercenary: {
    title: '용병 조인 야외전',
    time: '17:00',
    region: '경기 남부',
    fieldName: '택티쿨 필드',
    difficulty: '용병',
    currentParticipants: 8,
    maxParticipants: 10,
    action: '참가 신청',
  },
}

const matchesByDay: Record<string, MatchSchedule[]> = {
  '2': [
    {
      id: 'match-002',
      type: 'personal',
      title: '주말 포레스트 매치',
      time: '10:30',
      region: '경기 북부',
      fieldName: '포레스트 아레나',
      difficulty: '초보',
      currentParticipants: 22,
      maxParticipants: 30,
      action: '상세 보기',
    },
    {
      id: 'match-002-team',
      type: 'team',
      title: '포레스트 팀전',
      time: '15:30',
      region: '경기 북부',
      fieldName: '포레스트 아레나',
      difficulty: '팀',
      currentParticipants: 10,
      maxParticipants: 14,
      action: '상세 보기',
    },
  ],
  '18': [
    {
      id: 'match-003',
      type: 'personal',
      title: '서울 CQB 입문 스크림',
      time: '12:00',
      region: '서울',
      fieldName: '어반 CQB',
      difficulty: '초보',
      currentParticipants: 14,
      maxParticipants: 16,
      action: '상세 보기',
    },
    {
      id: 'match-002',
      type: 'team',
      title: '주말 포레스트 매치',
      time: '15:30',
      region: '경기 북부',
      fieldName: '포레스트 아레나',
      difficulty: '팀',
      currentParticipants: 22,
      maxParticipants: 30,
      action: '상세 보기',
    },
    {
      id: 'match-001',
      type: 'mercenary',
      title: '용병 조인 야외전',
      time: '17:00',
      region: '경기 남부',
      fieldName: '택티쿨 필드',
      difficulty: '용병',
      currentParticipants: 8,
      maxParticipants: 10,
      action: '참가 신청',
    },
  ],
  '23': [
    {
      id: 'match-001',
      type: 'personal',
      title: '초보 환영 야외전',
      time: '14:00',
      region: '경기 남부',
      fieldName: '택티쿨 필드',
      difficulty: '입문자',
      currentParticipants: 18,
      maxParticipants: 24,
      action: '상세 보기',
    },
    {
      id: 'match-023-team',
      type: 'team',
      title: '남부 팀 매치',
      time: '16:00',
      region: '경기 남부',
      fieldName: '택티쿨 필드',
      difficulty: '팀',
      currentParticipants: 12,
      maxParticipants: 18,
      action: '상세 보기',
    },
  ],
  '30': [
    {
      id: 'match-004',
      type: 'team',
      title: '월말 팀 스크림',
      time: '18:00',
      region: '서울',
      fieldName: '어반 CQB',
      difficulty: '팀',
      currentParticipants: 12,
      maxParticipants: 16,
      action: '상세 보기',
    },
    {
      id: 'match-030-personal',
      type: 'personal',
      title: '월말 개인 CQB',
      time: '12:00',
      region: '서울',
      fieldName: '어반 CQB',
      difficulty: '초보',
      currentParticipants: 9,
      maxParticipants: 16,
      action: '상세 보기',
    },
    {
      id: 'match-030-mercenary',
      type: 'mercenary',
      title: '월말 용병 조인',
      time: '19:00',
      region: '서울',
      fieldName: '어반 CQB',
      difficulty: '용병',
      currentParticipants: 6,
      maxParticipants: 10,
      action: '참가 신청',
    },
  ],
}

function createMatchesForDay(dayLabel: string) {
  const day = calendarDays.find((item) => item.label === dayLabel && !item.muted)

  return (day?.types ?? []).map((type, index) => ({
    id: `match-${dayLabel}-${type}`,
    type,
    ...defaultMatchByType[type],
    time: index === 0 ? defaultMatchByType[type].time : `${15 + index}:30`,
  }))
}

function filterMatches(matches: MatchSchedule[], filter: MatchTypeFilter) {
  if (filter === 'all') {
    return matches
  }

  return matches.filter((match) => match.type === filter)
}

function hasVisibleSchedule(types: MatchType[] | undefined, filter: MatchTypeFilter) {
  if (!types?.length) {
    return false
  }

  return filter === 'all' || types.includes(filter)
}

export function MatchHome() {
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState('18')
  const [matchTypeFilter, setMatchTypeFilter] = useState<MatchTypeFilter>('all')
  const [notifyTournament, setNotifyTournament] = useState(false)
  const selectedDayMatches = matchesByDay[selectedDay] ?? createMatchesForDay(selectedDay)
  const selectedMatches = filterMatches(selectedDayMatches, matchTypeFilter)

  return (
    <div className="page match_page">
      <header className="match_header">
        <Link className="match_back_button" to="/home" aria-label="이전으로">
          &lt;
        </Link>
        <h1>매치</h1>
      </header>

      <section className="match_section" aria-labelledby="match-status-title">
        <h2 id="match-status-title" className="match_section_title">내 매치 현황</h2>
        <div className="match_status_grid">
          <Link className="match_status_card" to="/my/applications">
            <span className="match_status_icon match_status_icon_blue" aria-hidden="true">▣</span>
            <span className="match_status_content">
              <strong>신청 중</strong>
              <small>참가 신청한 매치를 확인해요.</small>
            </span>
            <b>2건</b>
          </Link>
          <Link className="match_status_card" to="/my/schedule">
            <span className="match_status_icon match_status_icon_green" aria-hidden="true">✓</span>
            <span className="match_status_content">
              <strong>확정 일정</strong>
              <small>확정된 경기 일정을 확인해요.</small>
            </span>
            <b>1건</b>
          </Link>
        </div>
        <Link className="match_full_button match_dark_button" to="/my/matches">
          내 매치 페이지
          <span aria-hidden="true">&gt;</span>
        </Link>
      </section>

      <section className="match_section match_schedule_section" aria-labelledby="match-schedule-title">
        <div>
          <h2 id="match-schedule-title" className="match_section_title">매치 일정 둘러보기</h2>
          <p className="match_section_description">참가 방식을 고르고 날짜를 선택하면 해당 일정이 바로 이어져요.</p>
        </div>

        <div className="match_type_filters" aria-label="참가 방식 필터">
          {typeFilters.map((filter) => (
            <button
              className={`match_type_filter ${matchTypeFilter === filter.value ? 'is_active' : ''}`}
              type="button"
              key={filter.value}
              onClick={() => setMatchTypeFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="match_calendar_view">
          <article className="match_month_card">
            <div className="match_month_header">
              <button type="button" aria-label="이전 달">&lt;</button>
              <h3>2026. 05</h3>
              <button type="button" aria-label="다음 달">&gt;</button>
            </div>

            <div className="match_weekdays">
              {weekDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="match_calendar_grid">
              {calendarDays.map((day, index) => {
                const visible = hasVisibleSchedule(day.types, matchTypeFilter)

                return (
                  <button
                    className={`match_day_cell ${day.muted ? 'is_muted' : ''} ${selectedDay === day.label && !day.muted ? 'is_selected' : ''}`}
                    type="button"
                    key={`${day.label}-${index}`}
                    aria-label={`${day.label}일 일정 보기`}
                    onClick={() => {
                      if (!day.muted) {
                        setSelectedDay(day.label)
                      }
                    }}
                  >
                    <span>{day.label}</span>
                    {visible ? <i className="match_day_indicator" aria-hidden="true" /> : null}
                  </button>
                )
              })}
            </div>

            <p className="match_calendar_hint">점이 있는 날짜에는 선택한 조건에 맞는 일정이 있어요.</p>
          </article>

          <article className="match_selected_schedule">
            <h3>5월 {selectedDay}일 일정 {selectedMatches.length}건</h3>
            {selectedMatches.length > 0 ? (
              <>
                <div className="match_selected_list">
                  {selectedMatches.map((match) => (
                    <div className="match_selected_item" key={match.id}>
                      <span className="match_selected_thumb" aria-hidden="true" />
                      <div className="match_selected_body">
                        <div className="match_selected_topline">
                          <strong>{match.title}</strong>
                          <em className={match.type === 'mercenary' ? 'is_mercenary' : ''}>{match.difficulty}</em>
                        </div>
                        <p>시간 {match.time} · 장소 {match.fieldName} ({match.region})</p>
                        <p>{match.difficulty} · {match.currentParticipants} / {match.maxParticipants}명</p>
                      </div>
                      <Link className="match_selected_button" to={`/match/${match.id}`}>{match.action}</Link>
                    </div>
                  ))}
                </div>
                <Link className="match_full_button match_dark_button" to="/match/list">이 날짜 전체 보기</Link>
              </>
            ) : (
              <div className="match_empty_inline">
                <strong>선택한 조건에 맞는 일정이 없어요.</strong>
                <p>다른 참가 방식이나 날짜를 선택하거나 전체 매치 목록에서 일정을 찾아보세요.</p>
                <Link className="match_full_button" to="/match/list">전체 매치 보기</Link>
              </div>
            )}
          </article>
        </div>
      </section>

      <section className="match_section" aria-labelledby="match-tournament-title">
        <article className="match_tournament_card">
          <span className="match_badge">Coming Soon</span>
          <h2 id="match-tournament-title">공식 토너먼트 준비 중</h2>
          <p>추후 하이라이트와 MVP 투표로 연결될 예정이에요.</p>
          <div className="match_tournament_actions">
            <button className="match_yellow_button" type="button" onClick={() => setNotifyTournament(true)}>
              {notifyTournament ? '알림 신청 완료' : '알림 받기'}
            </button>
            <Link className="match_ghost_button" to="/tournament/highlights">▷ 하이라이트</Link>
            <Link className="match_ghost_button" to="/tournament/mvp-vote">☆ MVP 투표</Link>
          </div>
        </article>
      </section>

      <section className="match_section" aria-labelledby="match-field-title">
        <h2 id="match-field-title" className="match_section_title">필드 정보</h2>
        <article className="match_field_card">
          <span className="match_field_icon" aria-hidden="true">⌖</span>
          <div>
            <h3>필드 탐색</h3>
            <p>매치 카드와 상세에서 연결되는 필드 정보를 한 번에 확인해요.</p>
          </div>
          <Link className="match_field_button" to="/match/fields">필드 정보 보기 <span aria-hidden="true">&gt;</span></Link>
        </article>
      </section>

      <div className="match_create_floating">
        <button
          className="match_create_fab"
          type="button"
          onClick={() => navigate('/match/create')}
        >
          만들기 +
        </button>
      </div>
    </div>
  )
}
