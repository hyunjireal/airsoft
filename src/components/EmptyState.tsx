interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = '아직 등록된 내용이 없습니다',
  description = '새로운 내용이 생기면 이 영역에 표시됩니다.',
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}
