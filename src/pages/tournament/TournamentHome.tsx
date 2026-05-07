import { Link } from 'react-router-dom'
import './Tournament.css'

const ranking = [
  { name: '선수 A', votes: 128, percent: 72 },
  { name: '선수 B', votes: 96, percent: 58 },
  { name: '선수 C', votes: 74, percent: 44 },
]

export function TournamentHome() {
  return (
    <div className="tournament_page">
      <header className="tournament_header">
        <h1>토너먼트</h1>
        <button type="button" aria-label="알림">♧</button>
      </header>

      <section className="tournament_hero">
        <div className="tournament_hero_copy">
          <p>5월 루키 토너먼트</p>
          <h2>곧 시작되는 4강전</h2>
          <strong>결승 진출을 위한 마지막 한 판!</strong>
          <div className="tournament_status_row">
            <span>진행중</span>
            <span>4강</span>
          </div>
          <div className="tournament_next_card">
            <span>○ 다음 경기<br /><b>오늘 18:00</b></span>
            <span>⚔ 대전<br /><b>A팀 vs B팀</b></span>
            <span>⌖ 장소<br /><b>○○ 필드</b></span>
          </div>
        </div>
        <div className="tournament_trophy" aria-hidden="true">
          <span className="tournament_trophy_cup">☆</span>
        </div>
        <div className="tournament_hero_actions">
          <a href="#bracket">4강 매치업 보기</a>
          <a href="#videos">하이라이트 보기</a>
          <Link className="is_dark" to="/tournament/mvp-vote">게임별 MVP 투표</Link>
        </div>
      </section>

      <section id="bracket" className="tournament_block">
        <h2>1. 대진표</h2>
        <div className="tournament_bracket">
          <div className="tournament_bracket_column">
            {['A팀 2 / E팀 0', 'B팀 2 / F팀 0', 'C팀 2 / G팀 1', 'D팀 2 / H팀 0'].map((game) => (
              <article key={game}>✓ {game}</article>
            ))}
          </div>
          <div className="tournament_bracket_column">
            <article><b>1경기</b><strong>A팀 VS B팀</strong><span>오늘 18:00</span></article>
            <article><b>2경기</b><strong>C팀 VS D팀</strong><span>오늘 20:30</span></article>
          </div>
          <div className="tournament_bracket_column">
            <article><b>결승전</b><strong>TBD VS TBD</strong><span>추후 안내</span></article>
          </div>
        </div>
      </section>

      <section id="videos" className="tournament_block">
        <h2>2. 관련 영상</h2>
        <div className="tournament_video_grid">
          {['8강 하이라이트', '베스트 플레이', '팀별 명장면'].map((title, index) => (
            <article key={title}>
              <div className="tournament_video_mock"><span>▷</span><b>0{index + 3}:15</b></div>
              <strong>{title}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="tournament_block">
        <h2>3. 게임별 MVP 투표</h2>
        <div className="tournament_home_vote_grid">
          <article>
            <h3>8강 3경기<br />A팀 vs B팀</h3>
            <div className="tournament_video_mock"><span>▷</span><b>02:45</b></div>
            <p>● 투표 진행중</p>
            <Link to="/tournament/mvp-vote">투표하러 가기</Link>
          </article>
          <article>
            <h3>8강 4경기<br />C팀 vs D팀</h3>
            <div className="tournament_video_mock"><span>▷</span><b>02:38</b></div>
            <p>● 투표 진행중</p>
            <Link to="/tournament/mvp-vote">투표하러 가기</Link>
          </article>
          <article>
            <h3>집계중 랭킹</h3>
            {ranking.map((item, index) => (
              <div className="tournament_mini_rank" key={item.name}>
                <span>{index + 1}</span>
                <strong>{item.name}</strong>
                <i><b style={{ width: `${item.percent}%` }} /></i>
                <em>{item.votes}표</em>
              </div>
            ))}
            <Link to="/tournament/ranking">전체 랭킹 보기 ›</Link>
          </article>
        </div>
      </section>

      <section className="tournament_block">
        <h2>4. 관람 안내</h2>
        <div className="tournament_info_grid">
          <article>▦<strong>일정</strong><p>5월 24일 13:00 ~ 결승 종료까지</p></article>
          <article>⌖<strong>장소</strong><p>○○ 에어소프트 필드</p></article>
          <article>♙<strong>관람 안내</strong><p>자유 관람, 선수 안내에 따라 이동</p></article>
          <article>△<strong>주의 사항</strong><p>보호안경 착용, 지정 구역 출입 금지</p></article>
        </div>
      </section>

      <p className="tournament_footer_notice">ⓘ 경기 일정 및 내용은 현장 상황에 따라 변경될 수 있습니다.</p>
    </div>
  )
}
