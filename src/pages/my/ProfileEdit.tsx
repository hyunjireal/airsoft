import { useState } from 'react'

export function ProfileEdit() {
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') ?? '')
  const [region, setRegion] = useState(localStorage.getItem('region') ?? '')
  const [level, setLevel] = useState(localStorage.getItem('level') ?? '입문자')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    const trimmed = nickname.trim()
    if (trimmed) {
      localStorage.setItem('nickname', trimmed)
    }
    localStorage.setItem('region', region.trim())
    localStorage.setItem('level', level)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page">
      <h1 className="page_title">프로필 수정</h1>
      <section className="section">
        <label className="field">
          닉네임
          <input
            className="input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>
        <label className="field">
          활동 지역
          <input
            className="input"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </label>
        <label className="field">
          수준
          <select
            className="select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option>입문자</option>
            <option>초보</option>
            <option>경험자</option>
          </select>
        </label>
        <button className="button primary_button" type="button" onClick={handleSave}>
          {saved ? '저장됨' : '저장하기'}
        </button>
      </section>
    </div>
  )
}
