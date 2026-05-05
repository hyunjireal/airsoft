import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { matches } from '../../data/mockData'

const keywordFilters = ['초보 환영', '장비 대여 가능', '실내전', '숙련자 전용', '마감 임박']

export function MatchList() {
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const regionOptions = useMemo(() => ['전체', ...Array.from(new Set(matches.map((match) => match.region)))], [])
  const list = matches.filter((match) => {
    const matchesRegion = selectedRegion === '전체' || match.region === selectedRegion
    const matchesDate = !selectedDate || match.dateValue === selectedDate
    const matchesKeyword =
      selectedKeywords.length === 0 || selectedKeywords.every((keyword) => match.tags.includes(keyword))

    return matchesRegion && matchesDate && matchesKeyword
  })

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((keywords) =>
      keywords.includes(keyword) ? keywords.filter((item) => item !== keyword) : [...keywords, keyword],
    )
  }

  return (
    <div className="page">
      <h1 className="page_title">경기 목록</h1>
      <section className="section">
        <label className="field">
          지역
          <select className="select" value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)}>
            {regionOptions.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </select>
        </label>
        <label className="field">
          날짜 선택
          <input className="input" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
        </label>
        <div className="chip_row" aria-label="키워드 필터">
          {keywordFilters.map((keyword) => (
            <button
              className={`chip chip_button ${selectedKeywords.includes(keyword) ? 'active' : ''}`}
              type="button"
              key={keyword}
              onClick={() => toggleKeyword(keyword)}
            >
              {keyword}
            </button>
          ))}
        </div>
      </section>
      <section className="section">
        {list.map((match) => (
          <Link className="card" key={match.id} to={`/match/${match.id}`}>
            <h2>{match.title}</h2>
            <p>날짜 시간: {match.date} {match.time}</p>
            <p>장소: {match.fieldName} ({match.region})</p>
            <p>난이도: {match.difficulty}</p>
            <p>참가비: {match.fee}</p>
            <p>{match.currentParticipants} / {match.maxParticipants}명</p>
            <div className="chip_row">
              {match.tags.slice(0, 5).map((tag) => (
                <span className="chip" key={tag}>{tag}</span>
              ))}
            </div>
          </Link>
        ))}
        {list.length === 0 ? <p className="muted">선택한 조건에 맞는 경기가 없어요.</p> : null}
      </section>
    </div>
  )
}
