import { Link, useSearchParams } from 'react-router-dom'
import { matches } from '../../data/mockData'

const filters = ['전체', '오늘', '이번 주', '초보 환영', '장비 대여 가능', '마감 임박']

export function MatchList() {
  const [params] = useSearchParams()
  const beginnerOnly = params.get('beginner') === 'true'
  const list = beginnerOnly ? matches.filter((match) => match.beginnerFriendly) : matches

  return (
    <div className="page">
      <h1 className="page-title">경기 목록</h1>
      <div className="chip-row">{filters.map((filter) => <span className="chip" key={filter}>{filter}</span>)}</div>
      <section className="section">
        {list.map((match) => (
          <Link className="card" key={match.id} to={`/match/${match.id}`}>
            <span className="badge">{match.beginnerFriendly ? '초보 환영' : match.difficulty}</span>
            <h2>{match.title}</h2>
            <p>{match.date} / {match.time}</p>
            <p>{match.region} / {match.fieldName}</p>
            <p>난이도: {match.difficulty}</p>
            <p>{match.currentParticipants} / {match.maxParticipants}명</p>
            <p>참가비: {match.fee}</p>
            <div className="chip-row">{match.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
          </Link>
        ))}
      </section>
    </div>
  )
}
