import { Link } from 'react-router-dom'
import './Tournament.css'

const ranking = [
  { name: '김루키', selected: true, votes: 128, percent: 76 },
  { name: '이플레이', selected: false, votes: 96, percent: 58 },
  { name: '박에이스', selected: false, votes: 74, percent: 42 },
]

export function MvpVoteComplete() {
  return (
    <div className="tournament_page">
      <header className="tournament_header">
        <h1>게임별 MVP 투표</h1>
        <button type="button" aria-label="알림">♧</button>
      </header>

      <section className="tournament_done_hero">
        <span aria-hidden="true">✓</span>
        <div>
          <h2>투표 완료!</h2>
          <p>8강 3경기 A팀 MVP 투표가 완료되었습니다.</p>
          <strong>참여해주셔서 감사합니다.</strong>
        </div>
      </section>

      <section className="tournament_done_card">
        <h2>내가 선택한 선수</h2>
        <div className="tournament_done_player">
          <span aria-hidden="true">◉</span>
          <dl>
            <dt>경기</dt><dd>8강 3경기</dd>
            <dt>매치업</dt><dd>A팀 vs B팀</dd>
            <dt>선택 분야</dt><dd>A팀 MVP</dd>
            <dt>선택 선수</dt><dd>A-01 김루키</dd>
            <dt>주요 활약</dt><dd>결정적 돌파 성공</dd>
          </dl>
        </div>
      </section>

      <section className="tournament_done_card">
        <div className="tournament_done_title_row">
          <h2>실시간 랭킹 (A팀 MVP)</h2>
          <span>8강 3경기 기준</span>
        </div>
        <div className="tournament_done_rank">
          {ranking.map((item, index) => (
            <div key={item.name}>
              <span>{index + 1}위</span>
              <strong>{item.name}</strong>
              {item.selected ? <em>내 선택</em> : null}
              <i><b style={{ width: `${item.percent}%` }} /></i>
              <p>{item.votes}표</p>
            </div>
          ))}
        </div>
      </section>

      <p className="tournament_footer_notice">ⓘ 투표는 경기별 1회만 가능합니다. 투표 후 변경할 수 없습니다.</p>

      <div className="tournament_done_actions">
        <Link className="is_dark" to="/tournament/mvp-vote">다른 경기 투표하기</Link>
        <Link to="/tournament/highlights">▷ 하이라이트 더 보기</Link>
        <Link to="/tournament">🏆 토너먼트로 돌아가기</Link>
      </div>

      <p className="tournament_result_notice">◷ 결과는 실시간으로 집계되어 반영됩니다.</p>
    </div>
  )
}
