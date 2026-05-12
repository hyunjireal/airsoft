import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import MainTag from '../../components/MainTag'
import tournamentCheckImg from '../../asset/images/tournament_check.png'
import tournamentMainCompleteImg from '../../asset/images/tournament_main02.png'
import './Tournament.css'

type RankItem = { rank: number; name: string; votes: number; percent: number }

type CandidateInfo = {
  name: string
  team: string
  note: string
  round: string
  matchup: string
  ranking: RankItem[]
}

const candidateMap: Record<string, CandidateInfo> = {
  'bazooka-01': {
    name: '김루키', team: '바주카', note: '결정적 돌파 성공',
    round: '8강 3경기', matchup: '바주카 VS 블랙워터',
    ranking: [
      { rank: 1, name: '김루키', votes: 128, percent: 100 },
      { rank: 2, name: '이플레이', votes: 96, percent: 75 },
      { rank: 3, name: '박에이스', votes: 74, percent: 58 },
    ],
  },
  'bazooka-07': {
    name: '이플레이', team: '바주카', note: '연속 방어 성공',
    round: '8강 3경기', matchup: '바주카 VS 블랙워터',
    ranking: [
      { rank: 1, name: '김루키', votes: 128, percent: 100 },
      { rank: 2, name: '이플레이', votes: 96, percent: 75 },
      { rank: 3, name: '박에이스', votes: 74, percent: 58 },
    ],
  },
  'bazooka-23': {
    name: '박에이스', team: '바주카', note: '마지막 교전 승리',
    round: '8강 3경기', matchup: '바주카 VS 블랙워터',
    ranking: [
      { rank: 1, name: '김루키', votes: 128, percent: 100 },
      { rank: 2, name: '이플레이', votes: 96, percent: 75 },
      { rank: 3, name: '박에이스', votes: 74, percent: 58 },
    ],
  },
  'blackwater-04': {
    name: '한스모크', team: '블랙워터', note: '연막 진입 루트 확보',
    round: '8강 3경기', matchup: '바주카 VS 블랙워터',
    ranking: [
      { rank: 1, name: '한스모크', votes: 112, percent: 100 },
      { rank: 2, name: '오버워치', votes: 89, percent: 79 },
      { rank: 3, name: '나이트샷', votes: 68, percent: 61 },
    ],
  },
  'blackwater-11': {
    name: '오버워치', team: '블랙워터', note: '후방 엄호 성공',
    round: '8강 3경기', matchup: '바주카 VS 블랙워터',
    ranking: [
      { rank: 1, name: '한스모크', votes: 112, percent: 100 },
      { rank: 2, name: '오버워치', votes: 89, percent: 79 },
      { rank: 3, name: '나이트샷', votes: 68, percent: 61 },
    ],
  },
  'blackwater-19': {
    name: '나이트샷', team: '블랙워터', note: '막판 거점 방어',
    round: '8강 3경기', matchup: '바주카 VS 블랙워터',
    ranking: [
      { rank: 1, name: '한스모크', votes: 112, percent: 100 },
      { rank: 2, name: '오버워치', votes: 89, percent: 79 },
      { rank: 3, name: '나이트샷', votes: 68, percent: 61 },
    ],
  },
  'smokeline-02': {
    name: '강브리치', team: '스모크', note: '첫 교전 선제 제압',
    round: '8강 4경기', matchup: '스모크 VS 델타포스',
    ranking: [
      { rank: 1, name: '강브리치', votes: 104, percent: 100 },
      { rank: 2, name: '민커버', votes: 91, percent: 88 },
      { rank: 3, name: '서패스', votes: 63, percent: 61 },
    ],
  },
  'smokeline-08': {
    name: '민커버', team: '스모크', note: '엄폐 전환 성공',
    round: '8강 4경기', matchup: '스모크 VS 델타포스',
    ranking: [
      { rank: 1, name: '강브리치', votes: 104, percent: 100 },
      { rank: 2, name: '민커버', votes: 91, percent: 88 },
      { rank: 3, name: '서패스', votes: 63, percent: 61 },
    ],
  },
  'smokeline-15': {
    name: '서패스', team: '스모크', note: '측면 돌파 기여',
    round: '8강 4경기', matchup: '스모크 VS 델타포스',
    ranking: [
      { rank: 1, name: '강브리치', votes: 104, percent: 100 },
      { rank: 2, name: '민커버', votes: 91, percent: 88 },
      { rank: 3, name: '서패스', votes: 63, percent: 61 },
    ],
  },
  'deltaforce-03': {
    name: '윤스나이프', team: '델타포스', note: '장거리 견제 성공',
    round: '8강 4경기', matchup: '스모크 VS 델타포스',
    ranking: [
      { rank: 1, name: '윤스나이프', votes: 118, percent: 100 },
      { rank: 2, name: '최리콘', votes: 85, percent: 72 },
      { rank: 3, name: '도미네이터', votes: 72, percent: 61 },
    ],
  },
  'deltaforce-10': {
    name: '최리콘', team: '델타포스', note: '정찰 정보 공유',
    round: '8강 4경기', matchup: '스모크 VS 델타포스',
    ranking: [
      { rank: 1, name: '윤스나이프', votes: 118, percent: 100 },
      { rank: 2, name: '최리콘', votes: 85, percent: 72 },
      { rank: 3, name: '도미네이터', votes: 72, percent: 61 },
    ],
  },
  'deltaforce-21': {
    name: '도미네이터', team: '델타포스', note: '최종 라운드 세이브',
    round: '8강 4경기', matchup: '스모크 VS 델타포스',
    ranking: [
      { rank: 1, name: '윤스나이프', votes: 118, percent: 100 },
      { rank: 2, name: '최리콘', votes: 85, percent: 72 },
      { rank: 3, name: '도미네이터', votes: 72, percent: 61 },
    ],
  },
}

const defaultCandidate = candidateMap['bazooka-01']

export function MvpVoteComplete() {
  const voted = useMemo<CandidateInfo>(() => {
    const id = localStorage.getItem('votedMvpId') ?? ''
    return candidateMap[id] ?? defaultCandidate
  }, [])

  return (
    <div className="tournament_page is_light">

      {/* 히어로 */}
      <section
        className="mvpc_hero"
        style={{ backgroundImage: `url(${tournamentMainCompleteImg})` }}
      >
        <div className="mvpc_hero_inner">
          <div className="mvpc_check_medal" aria-hidden="true">
            <img src={tournamentCheckImg} alt="" />
          </div>
          <h1 className="mvpc_hero_tit">투표 완료!</h1>
        </div>
      </section>

      {/* 포인트 카드 */}
      <section className="mvpc_point_section">
        <div className="mvpc_point_card">
          <p className="mvpc_point_label">포인트 적립 완료</p>
          <strong className="mvpc_point_amount">+50p</strong>
          <span className="mvpc_point_prev">1,240P → 1,290P</span>
          <a className="mvpc_point_link" href="/mypage/point">
            <span className="mvpc_point_icon" aria-hidden="true" />
            포인트 쓰러가기
          </a>
        </div>
      </section>

      {/* 내가 선택한 선수 */}
      <section className="mvpc_player_section">
        <h2 className="body_sb_24">내가 선택한 선수</h2>
        <div className="mvpc_player_card">
          <div className="mvpc_player_left">
            <span className="mvpc_player_photo" aria-hidden="true" />
            <strong className="mvpc_player_name body_b_16">{voted.name}</strong>
          </div>
          <dl className="mvpc_player_info">
            <dt className="body_m_14">경기</dt>
            <dd className="body_sb_14">{voted.round}</dd>
            <dt className="body_m_14">매치업</dt>
            <dd className="body_sb_14">{voted.matchup}</dd>
            <dt className="body_m_14">선택 분야</dt>
            <dd className="body_sb_14">{voted.team} MVP</dd>
            <dt className="body_m_14">주요 활약</dt>
            <dd className="body_sb_14">{voted.note}</dd>
          </dl>
        </div>
      </section>

      {/* 실시간 랭킹 */}
      <section className="mvpc_rank_section">
        <h2 className="body_sb_24">실시간 랭킹</h2>
        <div className="tournament_player_rank_list">
          {voted.ranking.map((player) => (
            <div className="tournament_player_rank_item" key={player.rank}>
              <div className="tournament_player_rank_name">
                <MainTag className={`tournament_rank_tag${player.rank === 1 ? ' is_first' : ''}`}>
                  <span className="body_m_14">{player.rank}위</span>
                </MainTag>
                <strong className="body_sb_16">{player.name}</strong>
              </div>
              <div className="tournament_player_rank_meter">
                <i aria-hidden="true">
                  <b style={{ width: `${player.percent}%` }} />
                </i>
                <em className="body_m_14">{player.votes}표</em>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mvpc_cta_section">
        <Link className="mvpc_btn_primary body_b_18" to="/tournament/mvp-vote">
          다른 경기 투표하기
        </Link>
        <Link className="mvpc_btn_secondary body_sb_16" to="/tournament/highlights">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7L14 10L8 13V7Z" fill="currentColor" />
          </svg>
          하이라이트 더 보기
        </Link>
        <Link className="mvpc_btn_secondary body_sb_16" to="/tournament">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 3h12v2c0 3-2 5-4 6 2 1 4 3 4 6v1H4v-1c0-3 2-5 4-6C6 10 4 8 4 5V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7 3H4M16 3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          토너먼트 돌아가기
        </Link>
        <p className="mvpc_result_notice body_m_14">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 7v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.75" fill="currentColor" />
          </svg>
          결과는 실시간으로 집계되어 반영됩니다.
        </p>
      </section>

    </div>
  )
}
