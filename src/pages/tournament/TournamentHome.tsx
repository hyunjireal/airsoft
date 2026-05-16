import { useEffect, useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import tournamentHighlightIcon from '../../asset/icons/tournament_highlight.svg'
import tournamentInfoIcon from '../../asset/icons/tournament_info.svg'
import tournamentTourIcon from '../../asset/icons/tournament_tour.svg'
import matchAlertIcon from '../../asset/icons/match_alert.svg'
import matchCalendarIcon from '../../asset/icons/match_calendar.svg'
import matchPinIcon from '../../asset/icons/match_pin.svg'
import userGroupIcon from '../../asset/icons/com_user.svg'
import matchList01 from '../../asset/images/match_list01.jpg'
import matchList02 from '../../asset/images/match_list02.jpg'
import matchList03 from '../../asset/images/match_list03.jpg'
import tournamentMainDarkImage from '../../asset/images/tournament_main_dark_figma.png'
import tournamentMainLightImage from '../../asset/images/tournament_main_light_figma.png'
import { useThemeMode } from '../../hooks/useThemeMode'
import './TournamentHome.css'

type BracketStage = 'quarterfinal' | 'semifinal' | 'final'

type QuarterfinalMatch = {
  id: string
  label: string
  winner: string
  winnerScore: number
  loser: string
  loserScore: number
  status: string
}

type KnockoutMatch = {
  id: string
  label: string
  matchup: string
  time: string
  status: string
}

const heroSummary = {
  season: '5월 루키 토너먼트',
  headline: '곧 시작되는 4강전',
  nextMatchTime: '오늘 18:00',
  venue: 'OO필드',
  matchup: '바주카 · 블랙워터',
}

const bracketTabs: Array<{ id: BracketStage; label: string }> = [
  { id: 'quarterfinal', label: '8강' },
  { id: 'semifinal', label: '4강' },
  { id: 'final', label: '결승' },
]

const bracketStageIndex: Record<BracketStage, number> = {
  quarterfinal: 0,
  semifinal: 1,
  final: 2,
}

const quarterfinalMatches: QuarterfinalMatch[] = [
  { id: 'qf-1', label: '1경기', winner: '바주카', winnerScore: 2, loser: 'E팀', loserScore: 0, status: '완료' },
  { id: 'qf-2', label: '2경기', winner: '블랙워터', winnerScore: 2, loser: 'F팀', loserScore: 0, status: '완료' },
  { id: 'qf-3', label: '3경기', winner: 'C팀', winnerScore: 2, loser: 'G팀', loserScore: 1, status: '완료' },
  { id: 'qf-4', label: '4경기', winner: 'D팀', winnerScore: 2, loser: 'H팀', loserScore: 0, status: '완료' },
]

const semifinalMatches: KnockoutMatch[] = [
  { id: 'sf-1', label: '1경기', matchup: '바주카 vs 블랙워터', time: '오늘 18:00', status: '진행 중' },
  { id: 'sf-2', label: '2경기', matchup: 'C팀 vs D팀', time: '오늘 20:30', status: '진행 중' },
]

const highlightVideos = [
  { id: 'high-001', title: '8강 하이라이트', imageSrc: matchList01 },
  { id: 'high-002', title: '블랙워터 베스트 플레이', imageSrc: matchList02 },
  { id: 'high-003', title: '루키 토너먼트 스케치', imageSrc: matchList03 },
]

const infoCards = [
  {
    id: 'schedule',
    icon: matchCalendarIcon,
    title: '일정',
    lines: ['5월 24일 (토)', '13:00 ~ 결승 종료까지'],
  },
  {
    id: 'location',
    icon: matchPinIcon,
    title: '장소',
    lines: ['OO 에어소프트 필드', '경기도 OO시 OO로 123'],
  },
  {
    id: 'entry',
    icon: userGroupIcon,
    title: '입장 안내',
    lines: ['자유 관람(입장 무료)', '운영팀 안내에 따라 안전하게 관람해주세요.'],
  },
  {
    id: 'notice',
    icon: matchAlertIcon,
    title: '주의사항',
    lines: ['안전 수칙 준수 필수', '보호안경 착용', '지정 구역 출입 금지'],
  },
]

export function TournamentHome() {
  const navigate = useNavigate()
  const themeMode = useThemeMode()
  const [activeStage, setActiveStage] = useState<BracketStage>('semifinal')
  const [bracketDirection, setBracketDirection] = useState<'next' | 'prev'>('next')
  const [isIntroAnimating, setIsIntroAnimating] = useState(true)
  const isDark = themeMode === 'dark'
  const heroImage = isDark ? tournamentMainDarkImage : tournamentMainLightImage

  useEffect(() => {
    const timer = window.setTimeout(() => setIsIntroAnimating(false), 1250)

    return () => window.clearTimeout(timer)
  }, [])

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/home')
  }

  const changeStage = (nextStage: BracketStage) => {
    if (nextStage === activeStage) return

    setBracketDirection(bracketStageIndex[nextStage] > bracketStageIndex[activeStage] ? 'next' : 'prev')
    setActiveStage(nextStage)
  }

  const moveToSemifinal = () => {
    changeStage('semifinal')
    document.getElementById('tournament-bracket')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={`tournament_main_page is_${themeMode}${isIntroAnimating ? ' is_intro' : ''}`}>
      <section
        className="tournament_main_hero"
        style={{ '--tournament-hero-image': `url(${heroImage})` } as CSSProperties}
      >
        <PageHeader
          className="tournament_main_header"
          title="토너먼트"
          onBack={goBack}
          layout="standard"
          variant={isDark ? 'overlay' : 'transparent'}
        />

        <div className="tournament_main_hero_inner">
          <article className="tournament_main_banner">
            <div className="tournament_main_banner_top">
              <div className="tournament_main_banner_copy">
                <p className="tournament_main_banner_eyebrow">{heroSummary.season}</p>
                <h2 className="tournament_main_banner_title">{heroSummary.headline}</h2>
              </div>

              <div className="tournament_main_banner_status">
                <div className="tournament_main_banner_status_tab is_active">
                  <span>진행 중</span>
                </div>
                <button
                  className="tournament_main_banner_status_tab"
                  type="button"
                  onClick={moveToSemifinal}
                >
                  <span>4강</span>
                </button>
              </div>

              <div className="tournament_main_banner_meta">
                <div className="tournament_main_banner_meta_item">
                  <span className="tournament_main_banner_meta_label">다음 경기</span>
                  <strong className="tournament_main_banner_meta_value">{heroSummary.nextMatchTime}</strong>
                </div>
                <div className="tournament_main_banner_meta_item">
                  <span className="tournament_main_banner_meta_label">장소</span>
                  <strong className="tournament_main_banner_meta_value">{heroSummary.venue}</strong>
                </div>
                <div className="tournament_main_banner_meta_item">
                  <span className="tournament_main_banner_meta_label">대진</span>
                  <strong className="tournament_main_banner_meta_value">{heroSummary.matchup}</strong>
                </div>
              </div>
            </div>

            <div className="tournament_main_banner_actions">
              <span className="tournament_main_cta is_disabled">
                <img src={tournamentHighlightIcon} alt="" aria-hidden="true" />
                <span>하이라이트 보기</span>
              </span>
              <Link className="tournament_main_cta is_primary" to="/tournament/mvp-vote">
                <img src={tournamentTourIcon} alt="" aria-hidden="true" />
                <span>MVP 투표</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section id="tournament-bracket" className="tournament_main_section tournament_main_bracket_section">
        <div className="tournament_main_section_header">
          <h2>대진표</h2>
        </div>

        <div className="tournament_main_stage_tabs" role="tablist" aria-label="토너먼트 대진 단계">
          <span className="tournament_main_stage_indicator" aria-hidden="true" />
          {bracketTabs.map((tab) => (
            <button
              key={tab.id}
              className={`tournament_main_stage_tab${activeStage === tab.id ? ' is_active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeStage === tab.id}
              onClick={() => changeStage(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeStage === 'quarterfinal' ? (
          <div key="quarterfinal" className={`tournament_main_bracket_list is_${bracketDirection}`}>
            {quarterfinalMatches.map((match) => (
              <article key={match.id} className="tournament_main_bracket_card is_quarterfinal">
                <span className="tournament_main_bracket_label">{match.label}</span>
                <div className="tournament_main_bracket_scorebox">
                  <div className="tournament_main_bracket_score_row is_winner">
                    <strong>{match.winner}</strong>
                    <span>{match.winnerScore}</span>
                  </div>
                  <div className="tournament_main_bracket_score_row">
                    <strong>{match.loser}</strong>
                    <span>{match.loserScore}</span>
                  </div>
                </div>
                <span className="tournament_main_bracket_pill">{match.status}</span>
              </article>
            ))}
          </div>
        ) : null}

        {activeStage === 'semifinal' ? (
          <div key="semifinal" className={`tournament_main_bracket_list is_${bracketDirection}`}>
            {semifinalMatches.map((match) => (
              <article key={match.id} className="tournament_main_bracket_card is_knockout">
                <span className="tournament_main_bracket_label">{match.label}</span>
                <div className="tournament_main_bracket_matchbox">
                  <strong>{match.matchup}</strong>
                  <span>{match.time}</span>
                </div>
                <span className="tournament_main_bracket_pill is_live">{match.status}</span>
              </article>
            ))}
          </div>
        ) : null}

        {activeStage === 'final' ? (
          <div key="final" className={`tournament_main_bracket_list is_${bracketDirection}`}>
            <article className="tournament_main_bracket_card is_final is_coming_soon">
              <span className="tournament_main_bracket_label is_highlight">FINAL</span>
              <div className="tournament_main_coming_soon">
                <span>COMING SOON</span>
                <strong>FINAL MATCHUP</strong>
                <p>Locked after the semifinals</p>
              </div>
              <span className="tournament_main_bracket_pill">TBA</span>
            </article>
          </div>
        ) : null}
      </section>

      <section className="tournament_main_section">
        <div className="tournament_main_section_header">
          <h2>관련 영상</h2>
        </div>

        <div className="tournament_main_video_row">
          {highlightVideos.map((video) => (
            <a
              key={video.id}
              className="tournament_main_video_card"
              href="https://youtu.be/bnjqWY4uULA?si=YNIvFmm_o-TZ5RLw"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="tournament_main_video_thumb">
                <img src={video.imageSrc} alt="" aria-hidden="true" />
                <span className="tournament_main_video_play" aria-hidden="true" />
              </div>
              <strong>{video.title}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="tournament_main_section tournament_main_info_section">
        <div className="tournament_main_section_header">
          <h2>경기 안내</h2>
        </div>

        <div className="tournament_main_info_grid">
          {infoCards.map((card) => (
            <article
              key={card.id}
              className={`tournament_main_info_card${card.id === 'notice' ? ' is_notice' : ''}`}
            >
              <img className="tournament_main_info_icon" src={card.icon} alt="" aria-hidden="true" />
              <div className="tournament_main_info_copy">
                <strong>{card.title}</strong>
                {card.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="tournament_main_notice">
          <img src={tournamentInfoIcon} alt="" aria-hidden="true" />
          <span>경기 일정 및 내용은 현장 상황에 따라 변경될 수 있습니다.</span>
        </p>
      </section>
    </div>
  )
}
