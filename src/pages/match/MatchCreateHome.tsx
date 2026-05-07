import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './match.css'

type MatchKind = 'personal' | 'team' | 'guest'

const matchKinds: Array<{ label: string; value: MatchKind }> = [
  { label: '개인전', value: 'personal' },
  { label: '팀전', value: 'team' },
  { label: '게스트', value: 'guest' },
]

export function MatchCreateHome() {
  const navigate = useNavigate()
  const [matchKind, setMatchKind] = useState<MatchKind>('personal')

  return (
    <div className="match_create_page match_preference_page">
      <h1>선호 조건을<br />설정해 주세요</h1>

      <div className="match_create_tabs" aria-label="모집 유형">
        {matchKinds.map((kind) => (
          <button
            className={matchKind === kind.value ? 'is_active' : ''}
            type="button"
            key={kind.value}
            onClick={() => setMatchKind(kind.value)}
          >
            {kind.label}
          </button>
        ))}
      </div>

      <section className="match_preference_form" aria-label="모집 조건">
        <label>
          지역
          <select defaultValue="경기도">
            <option>경기도</option>
            <option>서울</option>
            <option>인천</option>
          </select>
        </label>
        <label>
          시간
          <select defaultValue="주말 오후">
            <option>주말 오후</option>
            <option>평일 저녁</option>
            <option>주말 오전</option>
          </select>
        </label>
        <label>
          게임 선택
          <select defaultValue="실내 OOO 구장">
            <option>실내 OOO 구장</option>
            <option>야외 포레스트 필드</option>
            <option>CQB 입문 스크림</option>
          </select>
        </label>
        <label>
          실력
          <select defaultValue="초급">
            <option>초급</option>
            <option>입문자</option>
            <option>경험자</option>
          </select>
        </label>
      </section>

      <button className="match_create_primary" type="button" onClick={() => navigate('/match')}>
        다음
      </button>
    </div>
  )
}
