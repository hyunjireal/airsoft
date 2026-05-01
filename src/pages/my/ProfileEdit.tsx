export function ProfileEdit() {
  return (
    <div className="page">
      <h1 className="page-title">프로필 수정</h1>
      <section className="section">
        <label className="field">닉네임<input className="input" defaultValue={localStorage.getItem('nickname') ?? ''} /></label>
        <label className="field">활동 지역<input className="input" defaultValue={localStorage.getItem('region') ?? ''} /></label>
        <label className="field">수준<select className="select" defaultValue={localStorage.getItem('level') ?? '입문자'}><option>입문자</option><option>초보</option><option>경험자</option></select></label>
        <button className="button primary-button" type="button">저장하기</button>
      </section>
    </div>
  )
}
