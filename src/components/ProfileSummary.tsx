import type { Badge as UserBadge, Team, User } from '../types'
import { Badge } from './Badge'
import { Card } from './Card'

interface ProfileSummaryProps {
  user: User
  team?: Team
  badges: UserBadge[]
}

export function ProfileSummary({ user, team, badges }: ProfileSummaryProps) {
  return (
    <Card className="profile-summary">
      <div>
        <h3>{user.nickname}</h3>
        <p>{user.level} / {user.region} / {user.playStyle}</p>
      </div>
      <div className="chip-row">
        {badges.map((badge) => (
          <Badge key={badge.id}>{badge.label}</Badge>
        ))}
      </div>
      <p>소속 팀: {team?.name ?? '가입한 팀 없음'}</p>
    </Card>
  )
}
