import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyMatchGroups, type MyMatchItem } from './myMatchData'

type MatchStatus = '확정' | '신청 중' | '모집 중' | '완료'

const statusTabs: Array<'전체' | MatchStatus> = ['전체', '확정', '신청 중', '모집 중', '완료']

function getStatusLabel(match: MyMatchItem): MatchStatus {
  if (match.isMine) return '모집 중'
  if (match.status === 'confirmed') return '확정'
  if (match.status === 'past') return '완료'
  return '신청 중'
}

export function MyMatches() {
  const [selectedTab, setSelectedTab] = useState<'전체' | MatchStatus>('전체')
  const myMatchGroups = useMemo(() => getMyMatchGroups(), [])
  const myMatches = myMatchGroups.all
  const filteredMatches = selectedTab === '전체'
    ? myMatches
    : myMatches.filter((match) => getStatusLabel(match) === selectedTab)

  return (
    <div className="page">
      <h1 className="page_title">내 매치</h1>

      <section className="section">
        <div className="grid_two">
          <article className="card">
            <h2>이번 주 확정</h2>
            <p>{myMatchGroups.confirmed.length}건</p>
          </article>
          <article className="card">
            <h2>신청 대기</h2>
            <p>{myMatchGroups.applied.length}건</p>
          </article>
        </div>
        <article className="card">
          <h2>내가 만든 모집</h2>
          <p>{myMatchGroups.created.length}건</p>
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
          <Link className="card" key={match.id} to={match.to}>
            <span className="badge">{getStatusLabel(match)}</span>
            <h2>{match.title}</h2>
            <p>{match.time}</p>
            <p>{match.region} · {match.fieldName}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
