import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { matches } from '../../data/mockData'
import './match.css'

const dateFilters = ['오늘', '이번 주', '이번 달', '다음 달', '날짜 선택']
const participationFilters = ['전체', '개인', '팀', '용병']
const weekDays = ['월', '화', '수', '목', '금', '토', '일']

const fallbackMatches = [
  {
    id: 'match-001',
    title: '초보 환영 야외전',
    date: '오늘',
    time: '14:00',
    region: '경기 남부',
    fieldName: '택티쿨 필드',
    difficulty: '입문자',
    currentParticipants: 18,
    maxParticipants: 24,
  },
  {
    id: 'match-002',
    title: '주말 포레스트 매치',
    date: '이번 주 토요일',
    time: '10:30',
    region: '경기 북부',
    fieldName: '포레스트 아레나',
    difficulty: '초보',
    currentParticipants: 22,
    maxParticipants: 30,
  },
  {
    id: 'match-003',
    title: '서울 CQB 입문 스크림',
    date: '이번 주 일요일',
    time: '12:00',
    region: '서울',
    fieldName: '어반 CQB',
    difficulty: '초보',
    currentParticipants: 14,
    maxParticipants: 16,
  },
]

const calendarDays = [
  { label: '27', muted: true },
  { label: '28', muted: true },
  { label: '29', muted: true },
  { label: '30', muted: true },
  { label: '1' },
  { label: '2', dots: ['personal', 'team'] },
  { label: '3', dots: ['mercenary'] },
  { label: '4' },
  { label: '5' },
  { label: '6' },
  { label: '7' },
  { label: '8' },
  { label: '9', dots: ['personal'] },
  { label: '10', dots: ['team'] },
  { label: '11' },
  { label: '12', dots: ['personal'] },
  { label: '13' },
  { label: '14' },
  { label: '15', dots: ['mercenary'] },
  { label: '16', dots: ['team'] },
  { label: '17', dots: ['personal'] },
  { label: '18', selected: true, dots: ['personal', 'team', 'mercenary'] },
  { label: '19' },
  { label: '20' },
  { label: '21', dots: ['team'] },
  { label: '22' },
  { label: '23', dots: ['personal', 'team'] },
  { label: '24', dots: ['mercenary'] },
  { label: '25' },
  { label: '26', dots: ['team'] },
  { label: '27' },
  { label: '28' },
  { label: '29' },
  { label: '30', dots: ['personal', 'team', 'mercenary'] },
  { label: '31', dots: ['team'] },
]

const selectedDateMatches = [
  {
    id: 'match-003',
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
    title: '주말 포레스트 매치',
    time: '15:30',
    region: '경기 북부',
    fieldName: '포레스트 아레나',
    difficulty: '초보',
    currentParticipants: 22,
    maxParticipants: 30,
    action: '상세 보기',
  },
  {
    id: 'match-001',
    title: '용병 조인 야외전',
    time: '17:00',
    region: '경기 남부',
    fieldName: '택티쿨 필드',
    difficulty: '용병',
    currentParticipants: 8,
    maxParticipants: 10,
    action: '참가 신청',
  },
]

export function MatchHome() {
  const [dateFilter, setDateFilter] = useState('오늘')
  const [participationFilter, setParticipationFilter] = useState('전체')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [notifyTournament, setNotifyTournament] = useState(false)
  const [createMenuOpen, setCreateMenuOpen] = useState(false)

  const schedulePreview = useMemo(() => {
    return fallbackMatches.map((fallback, index) => {
      const source = matches[index]

      return {
        id: source?.id ?? fallback.id,
        title: source?.title && !source.title.includes('?') ? source.title : fallback.title,
        date: source?.date && !source.date.includes('?') ? source.date : fallback.date,
        time: source?.time ?? fallback.time,
        region: source?.region && !source.region.includes('?') ? source.region : fallback.region,
        fieldName: source?.fieldName && !source.fieldName.includes('?') ? source.fieldName : fallback.fieldName,
        difficulty: source?.difficulty && !source.difficulty.includes('?') ? source.difficulty : fallback.difficulty,
        currentParticipants: source?.currentParticipants ?? fallback.currentParticipants,
        maxParticipants: source?.maxParticipants ?? fallback.maxParticipants,
      }
    })
  }, [])

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
          <p className="match_section_description">조건을 고르고 개인, 팀, 용병 매치를 살펴보세요.</p>
        </div>

        <div className="match_chip_row" aria-label="날짜 필터">
          {dateFilters.map((filter) => (
            <button
              className={`match_chip ${dateFilter === filter ? 'is_active' : ''}`}
              type="button"
              key={filter}
              onClick={() => setDateFilter(filter)}
            >
              {filter === '날짜 선택' ? <span aria-hidden="true">□</span> : null}
              {filter}
            </button>
          ))}
        </div>

        {dateFilter === '날짜 선택' ? (
          <label className="match_date_field">
            날짜 선택
            <input type="date" />
          </label>
        ) : null}

        <div className="match_chip_row" aria-label="참가 방식 필터">
          {participationFilters.map((filter) => (
            <button
              className={`match_chip ${participationFilter === filter ? 'is_active' : ''}`}
              type="button"
              key={filter}
              onClick={() => setParticipationFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="match_view_switch" aria-label="보기 전환">
          <button
            className={viewMode === 'list' ? 'is_active' : ''}
            type="button"
            onClick={() => setViewMode('list')}
          >
            <span aria-hidden="true">☰</span>
            리스트
          </button>
          <button
            className={viewMode === 'calendar' ? 'is_active' : ''}
            type="button"
            onClick={() => setViewMode('calendar')}
          >
            <span aria-hidden="true">□</span>
            달력
          </button>
        </div>

        {viewMode === 'list' ? (
          <div className="match_card_list">
            {schedulePreview.map((match) => (
              <article className="match_event_card" key={match.id}>
                <Link className="match_event_link" to={`/match/${match.id}`}>
                  <span className="match_event_thumb" aria-hidden="true" />
                  <span className="match_event_body">
                    <span className="match_event_topline">
                      <strong>{match.title}</strong>
                      <em>{match.difficulty}</em>
                    </span>
                    <span className="match_event_meta">시간 {match.date} {match.time}</span>
                    <span className="match_event_meta">장소 {match.fieldName} ({match.region})</span>
                    <span className="match_event_meta">난이도 {match.difficulty} · {match.currentParticipants} / {match.maxParticipants}명</span>
                    <span className="match_event_note">필드 정보는 상세에서 확인할 수 있어요.</span>
                  </span>
                </Link>
                <Link className="match_detail_button" to={`/match/${match.id}`}>상세 보기</Link>
              </article>
            ))}
          </div>
        ) : (
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
                {calendarDays.map((day, index) => (
                  <button
                    className={`match_day_cell ${day.muted ? 'is_muted' : ''} ${day.selected ? 'is_selected' : ''}`}
                    type="button"
                    key={`${day.label}-${index}`}
                    aria-label={`${day.label}일`}
                  >
                    <span>{day.label}</span>
                    {day.dots ? (
                      <i aria-hidden="true">
                        {day.dots.map((dot) => (
                          <b className={`match_dot_${dot}`} key={dot} />
                        ))}
                      </i>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="match_calendar_legend">
                <span><b className="match_dot_personal" />개인</span>
                <span><b className="match_dot_team" />팀</span>
                <span><b className="match_dot_mercenary" />용병</span>
                <p>날짜를 선택하면 해당 일정이 아래에 보여요.</p>
              </div>
            </article>

            <article className="match_selected_schedule">
              <h3>5월 18일 일정 3건</h3>
              <div className="match_selected_list">
                {selectedDateMatches.map((match) => (
                  <div className="match_selected_item" key={match.id}>
                    <span className="match_selected_thumb" aria-hidden="true" />
                    <div className="match_selected_body">
                      <div className="match_selected_topline">
                        <strong>{match.title}</strong>
                        <em className={match.difficulty === '용병' ? 'is_mercenary' : ''}>{match.difficulty}</em>
                      </div>
                      <p>시간 {match.time} · 장소 {match.fieldName} ({match.region})</p>
                      <p>{match.difficulty} · {match.currentParticipants} / {match.maxParticipants}명</p>
                    </div>
                    <Link className="match_selected_button" to={`/match/${match.id}`}>{match.action}</Link>
                  </div>
                ))}
              </div>
              <Link className="match_full_button match_dark_button" to="/match/list">이 날짜 전체 보기</Link>
            </article>

            <article className="match_empty_tip">
              <span aria-hidden="true">□</span>
              <div>
                <h3>일정이 없나요?</h3>
                <p>다른 날짜를 보거나 AI가 추천하는 맞춤 일정을 찾아보세요.</p>
              </div>
              <Link to="/match/list">다른 날짜 보기 &gt;</Link>
              <button type="button">AI에게 추천 받기 ✦</button>
            </article>
          </div>
        )}
      </section>

      {viewMode === 'list' ? (
        <>
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
        </>
      ) : null}

      <div className="match_create_floating">
        {createMenuOpen ? (
          <div className="match_create_menu" aria-label="모집 만들기 유형 선택">
            <Link to="/match/create/game">개인</Link>
            <Link to="/team/create">팀</Link>
            <Link to="/mercenary/create">용병</Link>
          </div>
        ) : null}
        <button
          className="match_create_fab"
          type="button"
          aria-label="모집 만들기"
          aria-expanded={createMenuOpen}
          onClick={() => setCreateMenuOpen((open) => !open)}
        >
          +
        </button>
      </div>
    </div>
  )
}
