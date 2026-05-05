import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { matches } from '../../data/mockData'

const dateFilters = ['오늘', '이번 주', '이번 달', '다음 달', '날짜 선택']
const participationFilters = ['전체', '개인', '팀', '용병']

export function MatchHome() {
  const [dateFilter, setDateFilter] = useState('오늘')
  const [participationFilter, setParticipationFilter] = useState('전체')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [notifyTournament, setNotifyTournament] = useState(false)
  const [createMenuOpen, setCreateMenuOpen] = useState(false)

  const schedulePreview = useMemo(() => matches.slice(0, 3), [])

  return (
    <div className="page">
      <h1 className="page_title">매치</h1>

      <section className="section">
        <h2 className="section_title">내 매치 현황</h2>
        <div className="grid_two">
          <Link className="card" to="/my/applications">
            <h2>신청 중</h2>
            <p>참가 신청한 매치를 확인해요.</p>
          </Link>
          <Link className="card" to="/my/schedule">
            <h2>확정 일정</h2>
            <p>확정된 경기 일정을 확인해요.</p>
          </Link>
        </div>
        <Link className="button" to="/match/manage">일정 관리</Link>
      </section>

      <section className="section">
        <div>
          <h2 className="section_title">매치 일정 둘러보기</h2>
          <p className="page_description">조건을 고르고 개인, 팀, 용병 매치를 살펴보세요.</p>
        </div>

        <div className="chip_row" aria-label="날짜 필터">
          {dateFilters.map((filter) => (
            <button
              className={`chip chip_button ${dateFilter === filter ? 'active' : ''}`}
              type="button"
              key={filter}
              onClick={() => setDateFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {dateFilter === '날짜 선택' ? (
          <label className="field">
            날짜 선택
            <input className="input" type="date" />
          </label>
        ) : null}

        <div className="chip_row" aria-label="참가 방식 필터">
          {participationFilters.map((filter) => (
            <button
              className={`chip chip_button ${participationFilter === filter ? 'active' : ''}`}
              type="button"
              key={filter}
              onClick={() => setParticipationFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid_two" aria-label="보기 전환">
          <button
            className={`button ${viewMode === 'list' ? 'primary_button' : ''}`}
            type="button"
            onClick={() => setViewMode('list')}
          >
            리스트
          </button>
          <button
            className={`button ${viewMode === 'calendar' ? 'primary_button' : ''}`}
            type="button"
            onClick={() => setViewMode('calendar')}
          >
            달력
          </button>
        </div>

        {viewMode === 'list' ? (
          <div className="list">
            {schedulePreview.map((match) => (
              <Link className="card" key={match.id} to={`/match/${match.id}`}>
                <h2>{match.title}</h2>
                <p>{match.date} {match.time}</p>
                <p>{match.fieldName} ({match.region})</p>
                <p>난이도 {match.difficulty} / {match.currentParticipants} / {match.maxParticipants}명</p>
                <p className="muted">필드 정보는 상세에서 확인할 수 있어요.</p>
              </Link>
            ))}
          </div>
        ) : (
          <article className="card">
            <h2>달력 보기</h2>
            <p>{dateFilter} 기준 매치 일정을 달력 형태로 확인하는 영역입니다.</p>
            <Link className="button" to="/match/list">전체 일정 보기</Link>
          </article>
        )}

        <Link className="button primary_button" to="/match/list">매치 목록 전체 보기</Link>
      </section>

      <section className="section">
        <h2 className="section_title">공식 토너먼트</h2>
        <article className="card">
          <span className="badge">Coming Soon</span>
          <h2>공식 토너먼트 준비 중</h2>
          <p>추후 하이라이트와 MVP 투표로 연결될 예정이에요.</p>
          <button className="button" type="button" onClick={() => setNotifyTournament(true)}>
            {notifyTournament ? '알림 신청 완료' : '알림 받기'}
          </button>
          <div className="grid_two">
            <Link className="button" to="/tournament/highlights">하이라이트</Link>
            <Link className="button" to="/tournament/mvp-vote">MVP 투표</Link>
          </div>
        </article>
      </section>

      <section className="section">
        <h2 className="section_title">필드 정보</h2>
        <article className="card">
          <h2>필드 탐색</h2>
          <p>매치 카드와 상세에서 연결되는 필드 정보를 한 번에 확인해요.</p>
          <Link className="button" to="/match/fields">필드 정보 보기</Link>
        </article>
      </section>

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
