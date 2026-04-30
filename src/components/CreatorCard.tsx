import type { CreatorContent, MvpCandidate } from '../types'
import { useAppStore } from '../stores/useAppStore'
import { Badge } from './Badge'
import { Button } from './Button'
import { Card } from './Card'

interface CreatorCardProps {
  content?: CreatorContent
  candidate?: MvpCandidate
}

export function CreatorCard({ content, candidate }: CreatorCardProps) {
  const followedCreatorIds = useAppStore((state) => state.followedCreatorIds)
  const toggleCreatorFollow = useAppStore((state) => state.toggleCreatorFollow)

  if (candidate) {
    return (
      <Card>
        <div className="card__topline">
          <Badge tone="primary">MVP 후보</Badge>
          <span>{candidate.voteRate}%</span>
        </div>
        <h3>{candidate.name}</h3>
        <p>{candidate.team} / {candidate.highlight}</p>
        <Button to="/creator/mvp-vote" variant="secondary">투표하기</Button>
      </Card>
    )
  }

  if (!content) return null

  const isFollowed = followedCreatorIds.includes(content.id)

  return (
    <Card>
      <div className="card__topline">
        <Badge tone={content.status === '라이브 중' ? 'primary' : 'default'}>{content.status}</Badge>
        <span>{content.creator}</span>
      </div>
      <h3>{content.title}</h3>
      <p>{content.summary}</p>
      <button className="text-button" type="button" onClick={() => toggleCreatorFollow(content.id)}>
        {isFollowed ? '팔로우 중' : '팔로우'}
      </button>
    </Card>
  )
}
