export function NotificationSettings() {
  return (
    <div className="page">
      <h1 className="page_title">알림 설정</h1>
      <section className="section">
        {['경기 일정 알림', '댓글 알림', 'MVP 투표 알림'].map((label) => (
          <label className="card" key={label}><input type="checkbox" defaultChecked /> {label}</label>
        ))}
      </section>
    </div>
  )
}
