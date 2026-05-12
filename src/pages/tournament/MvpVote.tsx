import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginButton } from '../../components/LoginButton'
import MainTag from '../../components/MainTag'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import tournamentLockIcon from '../../asset/icons/tournament_lock.svg'
import tournamentMainImg from '../../asset/images/tournament_main01.png'
import './Tournament.css'

const matches = [
  {
    id: 'quarter-3',
    round: '8강 3경기',
    teams: [
      {
        id: 'bazooka',
        name: '바주카',
        candidates: [
          { id: 'bazooka-01', team: '바주카', name: '김루키', note: '결정적 돌파 성공', votes: 128 },
          { id: 'bazooka-07', team: '바주카', name: '이플레이', note: '연속 방어 성공', votes: 96 },
          { id: 'bazooka-23', team: '바주카', name: '빅에이스', note: '마지막 교전 승리', votes: 74 },
        ],
      },
      {
        id: 'blackwater',
        name: '블랙워터',
        candidates: [
          { id: 'blackwater-04', team: '블랙워터', name: '한스모크', note: '연막 진입 루트 확보', votes: 112 },
          { id: 'blackwater-11', team: '블랙워터', name: '오버워치', note: '후방 엄호 성공', votes: 89 },
          { id: 'blackwater-19', team: '블랙워터', name: '나이트샷', note: '막판 거점 방어', votes: 68 },
        ],
      },
    ],
  },
  {
    id: 'quarter-4',
    round: '8강 4경기',
    teams: [
      {
        id: 'smokeline',
        name: '스모크',
        candidates: [
          { id: 'smokeline-02', team: '스모크', name: '강브리치', note: '첫 교전 선제 제압', votes: 104 },
          { id: 'smokeline-08', team: '스모크', name: '민커버', note: '엄폐 전환 성공', votes: 91 },
          { id: 'smokeline-15', team: '스모크', name: '서패스', note: '측면 돌파 기여', votes: 63 },
        ],
      },
      {
        id: 'deltaforce',
        name: '델타포스',
        candidates: [
          { id: 'deltaforce-03', team: '델타포스', name: '윤스나이프', note: '장거리 견제 성공', votes: 118 },
          { id: 'deltaforce-10', team: '델타포스', name: '최리콘', note: '정찰 정보 공유', votes: 85 },
          { id: 'deltaforce-21', team: '델타포스', name: '도미네이터', note: '최종 라운드 세이브', votes: 72 },
        ],
      },
    ],
  },
]

export function MvpVote() {
  const navigate = useNavigate()
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const selectedMatchData = matches.find((match) => match.id === selectedMatch)
  const selectedTeamData = selectedMatchData?.teams.find((team) => team.id === selectedTeam)
  const currentCandidates = selectedTeamData?.candidates ?? matches[0].teams[0].candidates
  const selected = currentCandidates.find((candidate) => candidate.id === selectedCandidate)
  const topVotes = Math.max(...currentCandidates.map((candidate) => candidate.votes))
  const liveRanking = [...currentCandidates]
    .sort((a, b) => b.votes - a.votes)
    .map((candidate, index) => ({
      rank: index + 1,
      name: candidate.name,
      votes: candidate.votes,
      percent: Math.round((candidate.votes / topVotes) * 100),
    }))
  const isTeamSelectOpen = selectedMatch !== null
  const isCandidateSelectOpen = selectedTeam !== null

  const submitVote = () => {
    if (!selectedCandidate) return

    localStorage.setItem('votedMvpId', selectedCandidate)
    navigate('/tournament/mvp-complete')
  }

  const selectMatch = (matchId: string) => {
    setSelectedMatch(matchId)
    setSelectedTeam(null)
    setSelectedCandidate(null)
  }

  const selectTeam = (teamId: string) => {
    setSelectedTeam(teamId)
    setSelectedCandidate(null)
  }

  return (
    <div className="tournament_page">
      <section
        className="tournament_intro_card"
        style={{ backgroundImage: `url(${tournamentMainImg})` }}
      >
        <div className="tournament_intro_tit">
          <div className="tournament_intro_top">
            <button type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>
              <img src={arrowLIcon} alt="" aria-hidden="true" />
            </button>
            <span className="body_b_28">MVP 투표</span>
          </div>
          <div className="tournament_intro_bottom">
            <p className="body_sb_16">
              각 경기에서 <em>가장 인상 깊었던</em><br />
              선수를 선택해주세요
            </p>
            <span>최종 MVP가 아닌 경기별 MVP 투표에요</span>
          </div>
        </div>
      </section>

      <section className="tournament_match_section">
        <h2>경기 선택</h2>
        <div className="tournament_match_list">
          <div className="tournament_match_list_top">
            <button
              className={`tournament_match_card${selectedMatch === 'quarter-3' ? ' is_selected' : ''}`}
              type="button"
              onClick={() => selectMatch('quarter-3')}
            >
              <div className="tournament_match_info">
                <strong className="body_b_14">{matches[0].round}</strong>
                <div className="tournament_match_teams">
                  <span className="body_m_16">{matches[0].teams[0].name}</span>
                  <b className="body_b_14">VS</b>
                  <span className="body_m_16">{matches[0].teams[1].name}</span>
                </div>
              </div>
              <em className="body_sb_14">투표 진행중</em>
            </button>
            <button
              className={`tournament_match_card${selectedMatch === 'quarter-4' ? ' is_selected' : ''}`}
              type="button"
              onClick={() => selectMatch('quarter-4')}
            >
              <div className="tournament_match_info">
                <strong className="body_b_14">{matches[1].round}</strong>
                <div className="tournament_match_teams">
                  <span className="body_m_16">{matches[1].teams[0].name}</span>
                  <b className="body_b_14">VS</b>
                  <span className="body_m_16">{matches[1].teams[1].name}</span>
                </div>
              </div>
              <em className="body_sb_14">투표 진행중</em>
            </button>
          </div>
          <button className="tournament_match_lock_card" type="button" disabled>
            <img src={tournamentLockIcon} alt="" aria-hidden="true" />
            <div>
              <strong className="body_b_14">4강 1경기</strong>
              <span className="body_sb_14">경기 후 오픈</span>
            </div>
          </button>
        </div>
      </section>

      <section className="tournament_team_select_section">
        <h2 className={!isTeamSelectOpen ? 'is_locked' : ''}>
          {!isTeamSelectOpen ? <img src={tournamentLockIcon} alt="" aria-hidden="true" /> : null}
          <span>MVP 팀 선택</span>
        </h2>
        {isTeamSelectOpen ? (
          <div className="tournament_team_select_box">
            <strong className="body_sb_16">{selectedMatchData?.round}</strong>
            <div className="tournament_team_select_cards">
              {selectedMatchData?.teams.map((team) => (
                <button
                  className={`${selectedTeam === team.id ? 'is_selected ' : ''}body_sb_16`}
                  key={team.id}
                  type="button"
                  onClick={() => selectTeam(team.id)}
                >
                  {team.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {isCandidateSelectOpen ? (
        <section className="tournament_team_media_section">
          <h2 className="body_sb_20">{selectedTeamData?.name} 주요 장면</h2>
          <div className="tournament_team_media_placeholder" aria-label="선택한 팀 주요 장면 영상 영역" />
        </section>
      ) : null}

      <section className="tournament_candidate_section">
        <h2 className={!isCandidateSelectOpen ? 'is_locked' : ''}>
          {!isCandidateSelectOpen ? <img src={tournamentLockIcon} alt="" aria-hidden="true" /> : null}
          <span>후보 선택</span>
        </h2>
        {isCandidateSelectOpen ? (
          <div className="tournament_candidate_card_list">
            {currentCandidates.map((candidate) => (
              <button
                className={`tournament_vote_candidate_card${selectedCandidate === candidate.id ? ' is_selected' : ''}`}
                key={candidate.id}
                type="button"
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <div className="tournament_candidate_player">
                  <span aria-hidden="true" />
                  <div>
                    <p className="body_m_14">{candidate.team}</p>
                    <strong className="body_b_16">{candidate.name}</strong>
                  </div>
                </div>
                <p className="tournament_candidate_desc body_m_14">{candidate.note}</p>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className={`tournament_live_rank_section${!isCandidateSelectOpen ? ' is_locked' : ''}`}>
        <h2>실시간 랭킹</h2>
        <div className="tournament_player_rank_list">
          {liveRanking.map((player) => (
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

      <section className="tournament_cta_section">
        <LoginButton
          className="tournament_fixed_vote"
          onClick={submitVote}
          disabled={!selectedCandidate}
          style={{
            background: 'var(--color-lime)',
            backgroundColor: 'var(--color-lime)',
            color: '#000000',
            WebkitTextFillColor: '#000000',
          }}
        >
          {selected ? selected.name : '후보'}에게 투표하기
        </LoginButton>
        <p className="tournament_lock_notice">
          <img src={tournamentLockIcon} alt="" aria-hidden="true" />
          <span className="body_m_14">투표 후 변경할 수 없습니다.</span>
        </p>
      </section>
    </div>
  )
}
