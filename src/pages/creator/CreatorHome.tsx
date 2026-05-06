import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './CreatorHome.css'
import grade01 from '../../asset/images/creator_grade01.png'
import grade02 from '../../asset/images/creator_grade02.png'
import grade03 from '../../asset/images/creator_grade03.png'
import list01 from '../../asset/images/creator_list01.png'
import list02 from '../../asset/images/creator_list02.png'
import list03 from '../../asset/images/creator_list03.png'

const podiumData = [
  { rank: 2, name: '나르마치고', score: '1225', avatar: grade02, profileId: 'creator-002' },
  { rank: 1, name: '레드닷존', score: '1500', avatar: grade01, profileId: 'creator-001' },
  { rank: 3, name: '꼬꼬댁', score: '1080', avatar: grade03, profileId: 'creator-003' },
]

const liveRanking = [
  { rank: 1, name: '레드닷존', score: 1500 },
  { rank: 2, name: '나르마치고', score: 1225 },
  { rank: 3, name: '꼬꼬댁', score: 1080 },
  { rank: 4, name: '베키사리', score: 985 },
  { rank: 5, name: '하나캠', score: 922 },
  { rank: 6, name: '알파튜브', score: 885 },
  { rank: 7, name: '빛나는꼬꼬', score: 823 },
  { rank: 8, name: '비온', score: 736 },
  { rank: 9, name: '깡나브리', score: 650 },
  { rank: 10, name: '육조준', score: 557 },
]

const updates = [
  {
    title: '간지난는 에어소프트건',
    meta: '조회수 238만회 · 7일 전',
    creator: '레드닷존',
    description: '공지 이 영상은 오락 목적의 콘텐츠입니다. 과한 몰입은 시청에 방해를 줍니다.',
    image: list01,
  },
  {
    title: '에어소프트 과대평가 총??',
    meta: '조회수 238만회 · 3주 전',
    creator: '레드닷존',
    description: '공지 이 영상은 오락 목적의 콘텐츠입니다. 과한 몰입은 시청에 방해를 줍니다.',
    image: list02,
  },
  {
    title: 'Play the Gun Game',
    meta: '조회수 238만회 · 1개월 전',
    creator: '레드닷존',
    description: '공지 이 영상은 오락 목적의 콘텐츠입니다. 과한 몰입은 시청에 방해를 줍니다.',
    image: list03,
  },
]

const TrophyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 21h8M12 17v4M7 4h10M5 4H3v3a4 4 0 0 0 4 4M19 4h2v3a4 4 0 0 1-4 4M17 4v7a5 5 0 0 1-10 0V4" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export function CreatorHome() {
  const [rankingOpen, setRankingOpen] = useState(false)
  const [activeRankIndex, setActiveRankIndex] = useState(0)
  const activeRanking = liveRanking[activeRankIndex]

  useEffect(() => {
    if (rankingOpen) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveRankIndex((current) => (current + 1) % liveRanking.length)
    }, 2200)

    return () => window.clearInterval(timer)
  }, [rankingOpen])

  return (
    <div className="creator_page">
      <section className="creator_rank_hero" aria-label="크리에이터 랭킹">
        <div className="podium_section">
          {podiumData.map((item) => (
            <article className={`podium_item podium_${item.rank}`} key={item.rank}>
              <Link className="podium_profile_link" to={`/creator/${item.profileId}`} aria-label={`${item.name} 프로필 보기`}>
                <img src={item.avatar} alt={item.name} className="podium_avatar" />
                <strong className="podium_name">{item.name}</strong>
              </Link>
              <div className="podium_base">
                <span className="podium_medal" aria-hidden="true" />
                <span className="podium_score">{item.score}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="creator_rank_summary" aria-label="실시간 크리에이터 순위">
        <p>실시간 1~10위 크리에이터 순위를 확인하세요.</p>
        <div className={`creator_rank_dropdown ${rankingOpen ? 'is_open' : ''}`}>
          <button
            className="creator_rank_select"
            type="button"
            aria-expanded={rankingOpen}
            onClick={() => setRankingOpen((open) => !open)}
          >
            <span><TrophyIcon /> {activeRanking.rank} {activeRanking.name}</span>
            <ChevronIcon />
          </button>
          {rankingOpen ? (
            <ol className="creator_rank_list" aria-label="1위부터 10위 크리에이터 순위">
              {liveRanking.map((item) => (
                <li className={item.rank === activeRanking.rank ? 'is_active' : ''} key={item.rank}>
                  <span>{item.rank}</span>
                  <strong>{item.name}</strong>
                  <em>{item.score}</em>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
        <Link className="creator_more_button" to="/creator/list">
          더보기 <span aria-hidden="true">&gt;</span>
        </Link>
      </section>

      <section className="creator_updates_section" aria-labelledby="creator-updates-title">
        <h2 id="creator-updates-title">레드닷존 유튜브 업데이트</h2>
        <div className="creator_update_list">
          {updates.map((item) => (
            <article className="creator_update_card" key={item.title}>
              <img src={item.image} alt="" />
              <div className="creator_update_content">
                <h3>{item.title}</h3>
                <p className="creator_update_meta">{item.meta}</p>
                <p className="creator_update_name"><span aria-hidden="true" /> {item.creator}</p>
                <p className="creator_update_description">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
