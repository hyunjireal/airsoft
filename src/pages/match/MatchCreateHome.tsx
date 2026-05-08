import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './match.css'

type MatchKind = 'personal' | 'team' | 'guest'

const CREATED_MATCHES_KEY = 'airsoft:created-matches'
const CREATED_MATCH_FOCUS_DATE_KEY = 'airsoft:created-match-focus-date'

const matchKinds: Array<{ label: string; value: MatchKind }> = [
  { label: '개인전', value: 'personal' },
  { label: '팀전', value: 'team' },
  { label: '게스트', value: 'guest' },
]

const submitLabels: Record<MatchKind, string> = {
  personal: '개인 태그 추가',
  team: '팀 태그 추가',
  guest: '용병 태그 추가',
}

function resolveKind(raw: string | null): MatchKind {
  if (raw === 'team' || raw === 'guest') return raw
  return 'personal'
}

export function MatchCreateHome() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [matchKind, setMatchKind] = useState<MatchKind>(() => resolveKind(searchParams.get('kind')))
  const [region, setRegion] = useState('경기도')
  const [time, setTime] = useState('주말 오후')
  const [fieldName, setFieldName] = useState('실내 OOO 구장')
  const [difficulty, setDifficulty] = useState('초급')
  const [matchDate, setMatchDate] = useState('2026-05-18')
  const [maxParticipants, setMaxParticipants] = useState('16')
  const [title, setTitle] = useState('초보 환영 CQB 모집')
  const [body, setBody] = useState(
    '처음 오시는 분도 편하게 참여할 수 있는 분위기로 진행합니다. 안전 수칙을 지키면서 즐겁게 뛰실 분을 모집해요.',
  )

  const createMatch = () => {
    const savedMatches = JSON.parse(localStorage.getItem(CREATED_MATCHES_KEY) ?? '[]')
    const createdMatch = {
      id: `created-match-${Date.now()}`,
      type: matchKind === 'guest' ? 'mercenary' : matchKind,
      title: title.trim() || `${matchKind === 'team' ? '팀전' : '개인전'} 모집`,
      time: time === '평일 저녁' ? '19:00' : time === '주말 오전' ? '10:30' : '14:00',
      region,
      fieldName,
      difficulty: matchKind === 'team' ? '팀' : matchKind === 'guest' ? '용병' : difficulty,
      currentParticipants: 1,
      maxParticipants: Number(maxParticipants) || 16,
      action: '상세 보기',
      body,
      date: matchDate,
    }

    localStorage.setItem(CREATED_MATCHES_KEY, JSON.stringify([createdMatch, ...savedMatches]))
    localStorage.setItem(CREATED_MATCH_FOCUS_DATE_KEY, matchDate)
    navigate('/match')
  }

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
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            <option>경기도</option>
            <option>서울</option>
            <option>인천</option>
          </select>
        </label>
        <label>
          시간
          <select value={time} onChange={(event) => setTime(event.target.value)}>
            <option>주말 오후</option>
            <option>평일 저녁</option>
            <option>주말 오전</option>
          </select>
        </label>
        <label>
          게임 선택
          <select value={fieldName} onChange={(event) => setFieldName(event.target.value)}>
            <option>실내 OOO 구장</option>
            <option>야외 포레스트 필드</option>
            <option>CQB 입문 스크림</option>
          </select>
        </label>
        <label>
          실력
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option>초급</option>
            <option>입문자</option>
            <option>경험자</option>
          </select>
        </label>
        <label>
          일정
          <input type="date" value={matchDate} onChange={(event) => setMatchDate(event.target.value)} />
        </label>
        <label>
          모집 인원
          <input type="number" min="2" max="50" value={maxParticipants} onChange={(event) => setMaxParticipants(event.target.value)} />
        </label>
        <label>
          제목
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          모집 글 본문
          <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={6} />
        </label>
      </section>

      <button className="match_create_primary" type="button" onClick={createMatch}>
        {submitLabels[matchKind]}
      </button>
    </div>
  )
}
