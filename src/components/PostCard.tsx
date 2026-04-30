import type { CommunityPost } from '../types'
import { Card } from './Card'
import { Chip } from './Chip'

interface PostCardProps {
  post: CommunityPost
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <div className="card__topline">
        <span>{post.author}</span>
        <span>{post.createdAt}</span>
      </div>
      <h3>{post.title}</h3>
      <p>댓글 {post.commentCount}개</p>
      <div className="chip-row">
        {post.tags.map((tag) => (
          <Chip key={tag}>{tag}</Chip>
        ))}
      </div>
    </Card>
  )
}
