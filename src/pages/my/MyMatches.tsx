import { useState } from 'react'
import { Link } from 'react-router-dom'

type MatchStatus = '확정' | '신청 중' | '모집 중' | '완료'

const statusTabs: Array<'전체' | MatchStatus> = ['전체', '확정', '신청 중', '모집 중', '완료']

const myMatches: Array<{
  id: string
  title: string
  date: string
  place: string
  status: MatchStatus
  route: string
}> = [
  {
    id: 'my-match-1',
    title: '초보 환영 야외전',
    date: '이번 주 토요일 14:00',
    place: '택티컬 필드',
    status: '확정',
    route: '/match/detail/match-001',
  },
  {
    id: 'my-match-2',
    title: '서울 CQB 입문 스크림',
    date: '이번 주 일요일 12:00',
    place: '어반 CQB',
    status: '신청 중',
    route: '/match/detail/match-003',
  },
  {
    id: 'my-match-3',
    title: '주말 포레스트 매치',
    date: '이번 주 토요일 10:30',
    place: '포레스트 아레나',
    status: '신청 중',
    route: '/match/detail/match-002',
  },
  {
    id: 'my-match-4',
    title: '초보 게스트 2명 모집',
    date: '다음 주 토요일',
    place: '경기 남부',
    status: '모집 중',
    route: '/mercenary',
  },
  {
    id: 'my-match-5',
    title: '지난 입문자 스크림',
    date: '지난주 일요일',
    place: '하남 실내 필드',
    status: '완료',
    route: '/my/schedule',
  },
]

export function MyMatches() {
  const [selectedTab, setSelectedTab] = useState<'전체' | MatchStatus>('전체')
  const filteredMatches = selectedTab === '전체' ? myMatches : myMatches.filter((match) => match.status === selectedTab)

  return (
    <div className="page">
      <h1 className="page_title">내 매치</h1>

      <section className="section">
        <div className="grid_two">
          <article className="card">
            <h2>이번 주 확정</h2>
            <p>1건</p>
          </article>
          <article className="card">
            <h2>신청 대기</h2>
            <p>2건</p>
          </article>
        </div>
        <article className="card">
          <h2>내가 만든 모집</h2>
          <p>1건</p>
        </article>
      </section>

      <section className="section">
        <div className="chip_row" aria-label="내 매치 상태 필터">
          {statusTabs.map((tab) => (
            <button
              className={`chip chip_button ${selectedTab === tab ? 'active' : ''}`}
              type="button"
              key={tab}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        {filteredMatches.map((match) => (
          <Link className="card" key={match.id} to={match.route}>
            <span className="badge">{match.status}</span>
            <h2>{match.title}</h2>
            <p>{match.date}</p>
            <p>{match.place}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
