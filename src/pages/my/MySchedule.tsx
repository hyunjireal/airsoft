import { Link } from 'react-router-dom'
import { matches } from '../../data/mockData'

export function MySchedule() {
  const joined = JSON.parse(localStorage.getItem('joinedMatchIds') || '[]') as string[]
  const list = matches.filter((match) => joined.includes(match.id))

  return (
    <div className="page">
      <h1 className="page-title">내 경기 일정</h1>
      <section className="section">
        {list.length ? list.map((match) => (
          <Link className="card" key={match.id} to={`/match/${match.id}`}>
            <h2>{match.title}</h2>
            <p>{match.date} / {match.time}</p>
          </Link>
        )) : <article className="card">신청한 경기가 아직 없어요.</article>}
      </section>
    </div>
  )
}
