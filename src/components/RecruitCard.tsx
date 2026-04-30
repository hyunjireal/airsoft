import { Link } from 'react-router-dom'
import type { RecruitPost } from '../types'
import { Badge } from './Badge'
import { Card } from './Card'

interface RecruitCardProps {
  recruit: RecruitPost
}

export function RecruitCard({ recruit }: RecruitCardProps) {
  return (
    <Card>
      <div className="card__topline">
        <Badge>{recruit.status}</Badge>
        <span>{recruit.region}</span>
      </div>
      <h3>{recruit.title}</h3>
      <p>
        {recruit.role} 역할로 {recruit.needed}명 모집 중입니다.
      </p>
      <Link to={recruit.matchId ? `/match/${recruit.matchId}` : '/match/join/guest'}>
        모집 흐름 보기
      </Link>
    </Card>
  )
}
