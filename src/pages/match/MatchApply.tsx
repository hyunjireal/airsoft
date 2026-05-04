import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const checks = [
  '안전수칙을 확인했어요',
  '현장 규정을 따를게요',
  '장비 대여 여부를 확인했어요',
  '취소 규정을 확인했어요',
]

export function MatchApply() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [checked, setChecked] = useState<string[]>([])

  const complete = () => {
    const stored = JSON.parse(localStorage.getItem('joinedMatchIds') || '[]') as string[]
    if (id && !stored.includes(id)) {
      localStorage.setItem('joinedMatchIds', JSON.stringify([...stored, id]))
    }
    navigate(`/match/${id}/complete`)
  }

  return (
    <div className="page">
      <h1 className="page_title">참가 신청</h1>
      <section className="section">
        {checks.map((check) => (
          <label className="card" key={check}>
            <input
              type="checkbox"
              checked={checked.includes(check)}
              onChange={() => setChecked((prev) => prev.includes(check) ? prev.filter((item) => item !== check) : [...prev, check])}
            />
            {check}
          </label>
        ))}
      </section>
      <button className="button primary_button" type="button" onClick={complete}>신청 완료하기</button>
    </div>
  )
}
