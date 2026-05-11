import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MatchTypeSheet } from './MatchTypeSheet'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import KeywordTag from '../../components/KeywordTag'
import MainTag from '../../components/MainTag'
import More from '../../components/More'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import arrowRIcon from '../../asset/icons/arrow_r.svg'
import matchNolistImage from '../../asset/images/match_nolist01.png'
import matchList01 from '../../asset/images/match_list01.jpg'
import matchList02 from '../../asset/images/match_list02.jpg'
import matchList03 from '../../asset/images/match_list03.jpg'
import matchList04 from '../../asset/images/match_list04.jpg'
import matchList05 from '../../asset/images/match_list05.jpg'
import { LoginButton } from '../../components/LoginButton'
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
  body?: string
  date?: string
  imageSrc?: string
}

type MatchTypeFilter = 'all' | MatchType

const CREATED_MATCHES_KEY = 'airsoft:created-matches'
const CREATED_MATCH_FOCUS_DATE_KEY = 'airsoft:created-match-focus-date'

const typeFilters: Array<{ label: string; value: MatchTypeFilter }> = [
  { label: '전체', value: 'all' },
  { label: '개인', value: 'personal' },
  { label: '팀', value: 'team' },
  { label: '용병', value: 'mercenary' },
]

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
    imageSrc: matchList01,
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
    imageSrc: matchList02,
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
    imageSrc: matchList04,
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
      imageSrc: matchList03,
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
      imageSrc: matchList02,
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
      imageSrc: matchList05,
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
      imageSrc: matchList03,
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
      imageSrc: matchList04,
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
      imageSrc: matchList01,
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
      imageSrc: matchList02,
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
      imageSrc: matchList05,
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
      imageSrc: matchList03,
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
      imageSrc: matchList04,
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

function formatCalendarTitle(month: Date) {
  return `${month.getFullYear()}. ${String(month.getMonth() + 1).padStart(2, '0')}`
}

function getMatchTypeLabel(match: MatchSchedule) {
  if (match.type === 'personal') return '개인'
  if (match.type === 'team') return '팀'

  return match.difficulty
}

const matchTypeColor: Record<MatchType, string> = {
  team: '#1f2b45',
  personal: '#10425d',
  mercenary: '#676b5d',
}

function isMatchType(type: unknown): type is MatchType {
  return type === 'personal' || type === 'team' || type === 'mercenary'
}

function readCreatedMatches() {
  if (typeof window === 'undefined') {
    return []
  }

  const savedMatches = (() => {
    try {
      return JSON.parse(localStorage.getItem(CREATED_MATCHES_KEY) ?? '[]')
    } catch {
      return []
    }
  })()

  if (!Array.isArray(savedMatches)) {
    return []
  }

  return savedMatches
    .filter((match): match is MatchSchedule => {
      return (
        typeof match === 'object' &&
        match !== null &&
        'type' in match &&
        isMatchType(match.type)
      )
    })
    .map((match) => ({
      ...match,
      imageSrc: match.imageSrc ?? (match.type === 'team' ? matchList02 : match.type === 'mercenary' ? matchList04 : matchList01),
    }))
}

function readFocusedMatchDate() {
  const defaultDate = new Date(2026, 4, 18)

  if (typeof window === 'undefined') {
    return defaultDate
  }

  const savedDate = localStorage.getItem(CREATED_MATCH_FOCUS_DATE_KEY)

  if (!savedDate) {
    return defaultDate
  }

  const date = new Date(`${savedDate}T00:00:00`)
  return Number.isNaN(date.getTime()) ? defaultDate : date
}

export function MatchHome() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date>(() => readFocusedMatchDate())
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  )
  const [matchTypeFilter, setMatchTypeFilter] = useState<MatchTypeFilter>('all')
  const [createdMatches] = useState<MatchSchedule[]>(readCreatedMatches)
  const selectedDay = String(selectedDate.getDate())
  const isSelectedMatchMonth = selectedDate.getFullYear() === 2026 && selectedDate.getMonth() === 4
  const selectedDateKey = [
    selectedDate.getFullYear(),
    String(selectedDate.getMonth() + 1).padStart(2, '0'),
    String(selectedDate.getDate()).padStart(2, '0'),
  ].join('-')
  const selectedDayCreatedMatches = createdMatches.filter((match) => match.date === selectedDateKey)
  const selectedDayMatches = isSelectedMatchMonth
    ? [...(matchesByDay[selectedDay] ?? createMatchesForDay(selectedDay)), ...selectedDayCreatedMatches]
    : selectedDayCreatedMatches
  const selectedMatches = filterMatches(selectedDayMatches, matchTypeFilter)
  const filteredDefaultMatchDates = calendarDays
    .filter((day) => {
      if (day.muted) return false

      const dayMatches = matchesByDay[day.label] ?? createMatchesForDay(day.label)
      return filterMatches(dayMatches, matchTypeFilter).length > 0
    })
    .map((day) => new Date(2026, 4, Number(day.label)))
  const filteredCreatedMatchDates = createdMatches
    .filter((match) => filterMatches([match], matchTypeFilter).length > 0 && match.date)
    .map((match) => new Date(`${match.date}T00:00:00`))
    .filter((date) => !Number.isNaN(date.getTime()))
  const filteredMatchDates = [...filteredDefaultMatchDates, ...filteredCreatedMatchDates]
  const goPrevMonth = () => {
    setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))
  }
  const goNextMonth = () => {
    setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))
  }
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/home')
  }

  const [showTypeSheet, setShowTypeSheet] = useState(false)

  const handleTypeSelect = (kind: 'personal' | 'team' | 'guest', guestFlow?: 'wanted' | 'join') => {
    if (kind !== 'guest') {
      return
    }

    setShowTypeSheet(false)
    if (guestFlow === 'wanted') {
      navigate(`/match/create/guest-wanted?date=${selectedDateKey}`)
      return
    }

    if (guestFlow === 'join') {
      navigate(`/match/create/guest-join?date=${selectedDateKey}`)
      return
    }

    navigate(`/match/create?kind=${kind}&date=${selectedDateKey}`)
  }

  return (
    <div className="match_page">
      <header className="match_page_header">
        <button className="match_page_back_button" type="button" aria-label="뒤로가기" onClick={goBack}>
          <img src={arrowLIcon} alt="" aria-hidden="true" />
        </button>
        <h1 className="match_page_title">매치</h1>
      </header>

      <section className="match_section" aria-labelledby="match-status-title">
        <div className="match_section_heading">
          <h2 id="match-status-title" className="match_section_title">내 매치 현황</h2>
          <Link className="match_more_link" to="/my/matches" aria-label="내 매치 현황 더보기">
            <More />
          </Link>
        </div>
        <div className="match_status_grid">
          <Link className="match_status_card" to="/my/applications">
            <span className="match_status_content">
              <strong>신청 중인 일정</strong>
              <small>참가 신청한 매치를<br />확인하세요.</small>
            </span>
            <b>2건</b>
          </Link>
          <Link className="match_status_card" to="/my/schedule">
            <span className="match_status_content">
              <strong>확정 일정</strong>
              <small>확정된 경기 일정을<br />확인해요.</small>
            </span>
            <b>1건</b>
          </Link>
        </div>
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
              data-type={filter.value}
              onClick={() => setMatchTypeFilter(filter.value)}
            >
              <KeywordTag className="match_type_filter_tag">{filter.label}</KeywordTag>
            </button>
          ))}
        </div>

        <div className="match_calendar_view">
          <article className="match_month_card">
            <div className="match_month_header">
              <button type="button" aria-label="이전 달" onClick={goPrevMonth}>&lt;</button>
              <h3>{formatCalendarTitle(calendarMonth)}</h3>
              <button type="button" aria-label="다음 달" onClick={goNextMonth}>&gt;</button>
            </div>

            <DayPicker
              className="match_day_picker"
              mode="single"
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date)
                }
              }}
              locale={ko}
              weekStartsOn={0}
              showOutsideDays
              fixedWeeks
              hideNavigation
              modifiers={{ hasMatch: filteredMatchDates }}
              modifiersClassNames={{ hasMatch: 'hasMatch' }}
            />
            <p className="match_calendar_hint">점이 있는 날짜에는 선택한 조건에 맞는 일정이 있어요.</p>
          </article>

          <article className="match_selected_schedule">
            <h3>{selectedDate.getMonth() + 1}월 {selectedDay}일 일정 {selectedMatches.length}건</h3>
            {selectedMatches.length > 0 ? (
              <>
                <div className="match_selected_list">
                  {selectedMatches.map((match) => (
                    <div className="match_selected_item" key={match.id}>
                      <MainTag className="match_item_tag" style={{ backgroundColor: matchTypeColor[match.type], color: '#ffffff' }}>
                        {getMatchTypeLabel(match)}
                      </MainTag>
                      <div className="match_item_bottom">
                        <div className="match_item_media">
                          <img className="match_selected_thumb" src={match.imageSrc ?? matchList01} alt="" aria-hidden="true" />
                          <div className="match_selected_info">
                            <strong className="match_item_title">{match.title}</strong>
                            <div className="match_item_meta">
                              <p className="match_meta_row">
                                <span className="match_meta_label">시간</span>
                                <span className="match_meta_value">{match.time}</span>
                              </p>
                              <p className="match_meta_row">
                                <span className="match_meta_label">장소</span>
                                <span className="match_meta_value">{match.region} · {match.fieldName}</span>
                              </p>
                            </div>
                            <p className="match_meta_row">
                              <span className="match_meta_label">인원</span>
                              <span className="match_meta_value">{match.currentParticipants}/{match.maxParticipants}명</span>
                            </p>
                          </div>
                        </div>
                        <Link className="match_item_arrow_link" to={`/match/${match.id}`} aria-label={`${match.title} 상세 보기`}>
                          <img className="match_item_arrow" src={arrowRIcon} alt="" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="match_full_button match_dark_button" type="button">전체 보기</button>
              </>
            ) : (
              <article className="match_empty_recommend_card">
                <div className="match_empty_recommend_copy">
                  <h3>일정이 없나요?</h3>
                  <p>다른 날짜를 보거나<br />AI가 추천하는<br />맞춤 일정을 찾아보세요.</p>
                </div>
                <img className="match_empty_recommend_img" src={matchNolistImage} alt="" aria-hidden="true" />
                <div className="match_empty_recommend_actions">
                  <LoginButton
                    className="match_empty_login_btn"
                    style={{ background: 'rgba(0,0,0,0.55)', color: '#ffffff', fontSize: 16, fontWeight: 500 }}
                    onClick={() => setShowTypeSheet(true)}
                  >
                    일정 만들러 가기
                  </LoginButton>
                </div>
              </article>
            )}
          </article>
        </div>
      </section>

      <section className="match_section match_tournament_section" aria-labelledby="match-tournament-title">
        <article className="match_tournament_card">
          <MainTag className="match_tournament_tag" style={{ padding: '3px 8px', background: '#EE2106' }}>
            <span className="match_tournament_tag_dot" aria-hidden="true" />
            <span>토너먼트 진행중</span>
          </MainTag>

          <div className="match_tournament_textbox">
            <div className="match_tournament_titlebox">
              <h2 id="match-tournament-title" className="match_tournament_title">
                곧 시작되는 <span>4강전</span>
              </h2>
              <p className="match_tournament_desc">치열한 승부가 펼쳐집니다!</p>
            </div>
            <div className="match_tournament_info">
              <p className="match_tournament_time">오늘 18:00</p>
              <p className="match_tournament_matchup">바주카 VS 블랙워터</p>
            </div>
          </div>

          <LoginButton
            className="match_tournament_cta"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.18)',
              background: 'rgba(238, 33, 6, 0.15)',
              backgroundColor: 'rgba(238, 33, 6, 0.15)',
              backgroundImage:
                'linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 36%, rgba(255,255,255,0) 62%), linear-gradient(135deg, rgba(238,33,6,0.2), rgba(238,33,6,0.08))',
              color: '#fff',
              WebkitTextFillColor: '#fff',
              fontSize: 16,
              fontWeight: 500,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.36), inset 0 -1px 0 rgba(255,255,255,0.08), 0 10px 24px rgba(0,0,0,0.18)',
              backdropFilter: 'blur(11.8px) saturate(180%)',
              WebkitBackdropFilter: 'blur(11.8px) saturate(180%)',
            }}
            onClick={() => navigate('/tournament/mvp-vote')}
          >
            투표하기
          </LoginButton>
        </article>
      </section>

      <MatchTypeSheet
        open={showTypeSheet}
        onClose={() => setShowTypeSheet(false)}
        onSelect={handleTypeSelect}
      />
    </div>
  )
}

