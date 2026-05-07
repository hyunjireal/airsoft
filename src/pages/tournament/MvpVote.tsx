import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Tournament.css'

const candidates = [
  { id: 'a01', name: 'A-01 김루키', note: '결정적 돌파 성공', votes: 128, percent: 76 },
  { id: 'a07', name: 'A-07 이플레이', note: '연속 방어 성공', votes: 96, percent: 62 },
  { id: 'a23', name: 'A-23 박에이스', note: '마지막 교전 승리', votes: 74, percent: 48 },
]

export function MvpVote() {
  const navigate = useNavigate()
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0].id)
  const selected = candidates.find((candidate) => candidate.id === selectedCandidate) ?? candidates[0]

  const submitVote = () => {
    localStorage.setItem('votedMvpId', selectedCandidate)
    navigate('/tournament/mvp-complete')
  }

  return (
    <div className="tournament_page">
      <header className="tournament_header">
        <h1>게임별 MVP 투표</h1>
        <button type="button" aria-label="알림">♧</button>
      </header>

      <section className="tournament_intro_card">
        <span aria-hidden="true">🏆</span>
        <div>
          <h2>각 경기에서 가장 인상 깊었던 선수를 선택해주세요.</h2>
          <p>최종 MVP가 아닌, 경기별 MVP 투표입니다.</p>
        </div>
      </section>

      <section className="tournament_block">
        <h2>3. 경기 선택</h2>
        <div className="tournament_match_grid">
          <button className="tournament_match_card is_active" type="button">
            <span>8강 3경기</span>
            <strong>A팀 VS B팀</strong>
            <small>투표 진행중</small>
          </button>
          <button className="tournament_match_card" type="button">
            <span>8강 4경기</span>
            <strong>C팀 VS D팀</strong>
            <small>투표 진행중</small>
          </button>
          <button className="tournament_match_card is_locked" type="button" disabled>
            <span>4강 1경기</span>
            <strong>경기 후 오픈</strong>
          </button>
        </div>
      </section>

      <section className="tournament_block">
        <h2>4. 선택한 경기</h2>
        <div className="tournament_selected_game">
          <span>선택한 경기</span>
          <strong>A팀 VS B팀</strong>
        </div>
        <div className="tournament_team_grid">
          <button className="is_selected" type="button">A팀 MVP</button>
          <button type="button">B팀 MVP</button>
        </div>
      </section>

      <section className="tournament_block">
        <h2>5. A팀 주요 장면</h2>
        <article className="tournament_highlight_card">
          <div className="tournament_video_mock"><span>▷</span><b>03:15</b></div>
          <div>
            <h3>A팀 주요 장면</h3>
            <Link to="/tournament/highlights">영상 보기</Link>
          </div>
        </article>
      </section>

      <section className="tournament_block">
        <h2>6. MVP 후보 선택 (A팀)</h2>
        <div className="tournament_vote_candidate_grid">
          {candidates.map((candidate) => (
            <button
              className={selectedCandidate === candidate.id ? 'is_selected' : ''}
              key={candidate.id}
              type="button"
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              <span aria-hidden="true">◉</span>
              <strong>{candidate.name}</strong>
              <p>{candidate.note}</p>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="tournament_block">
        <h2>7. 실시간 랭킹 (A팀)</h2>
        <div className="tournament_vote_rank_box">
          {candidates.map((candidate, index) => (
            <div className="tournament_vote_rank_row" key={candidate.id}>
              <span>{index + 1}위</span>
              <strong>{candidate.name.replace(/^A-\d+\s/, '')}</strong>
              <i><b style={{ width: `${candidate.percent}%` }} /></i>
              <em>{candidate.votes}표</em>
            </div>
          ))}
        </div>
      </section>

      <button className="tournament_fixed_vote" type="button" onClick={submitVote}>
        {selected.name}에게 투표하기
      </button>
      <p className="tournament_lock_notice">▣ 투표 후 변경할 수 없습니다.</p>
    </div>
  )
}
