import { Link } from 'react-router-dom'
import type { Match, ScheduleItem } from '../types'
import { Badge } from './Badge'
import { Card } from './Card'

interface MatchCardProps {
  match?: Match
  schedule?: ScheduleItem
}

export function MatchCard({ match, schedule }: MatchCardProps) {
  const id = match?.id ?? schedule?.matchId

  return (
    <Card>
      <div className="card__topline">
        <Badge tone="primary">{match?.status ?? schedule?.status}</Badge>
        <span>{match?.region ?? schedule?.date}</span>
      </div>
      <h3>{match?.title ?? `${schedule?.date} ${schedule?.fieldName}`}</h3>
      <p>{match?.description ?? `${schedule?.time} / ${schedule?.fieldName}`}</p>
      <dl className="meta-list">
        <div>
          <dt>일정</dt>
          <dd>{match ? `${match.date} ${match.time}` : schedule?.time}</dd>
        </div>
        <div>
          <dt>장소</dt>
          <dd>{match?.fieldName ?? schedule?.fieldName}</dd>
        </div>
        {match ? (
          <div>
            <dt>정원</dt>
            <dd>{match.capacity}</dd>
          </div>
        ) : null}
      </dl>
      {id ? <Link to={`/match/${id}`}>경기상세 보기</Link> : null}
    </Card>
  )
}
