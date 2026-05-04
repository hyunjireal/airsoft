export function MyApplications() {
  return (
    <div className="page">
      <h1 className="page_title">신청 내역</h1>
      <section className="section">
        <article className="card"><h2>경기 신청</h2><p>localStorage의 joinedMatchIds 기준으로 저장돼요.</p></article>
        <article className="card"><h2>팀/용병 신청</h2><p>프로토타입에서는 신청 흐름만 확인합니다.</p></article>
      </section>
    </div>
  )
}
