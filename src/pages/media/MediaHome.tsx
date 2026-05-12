import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import KeywordTag from '../../components/KeywordTag'
import arrowDownIcon from '../../asset/icons/arrow_down.svg'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import rankingCheckIcon from '../../asset/icons/ranking_check.svg'
import userIcon from '../../asset/icons/creator_profile.svg'
import mediaMainBg from '../../asset/images/media_main01.png'
import mediaRankingIcon from '../../asset/images/media_ranking.svg'
import mediaFrame1 from '../../asset/images/media_1.png'
import mediaFrame2 from '../../asset/images/media_2.png'
import mediaFrame3 from '../../asset/images/media_3.png'
import mediaUser1 from '../../asset/images/media_user1.png'
import mediaUser2 from '../../asset/images/media_user2.png'
import mediaUser3 from '../../asset/images/media_user3.png'
import './MediaHome.css'

const podiumCreators = [
  {
    rank: 2,
    name: '하나캠',
    subscribers: '98K',
    frame: mediaFrame2,
    user: mediaUser2,
    className: 'media_podium_second',
    profileId: 'creator-002',
  },
  {
    rank: 1,
    name: '레드닷존',
    subscribers: '150K',
    frame: mediaFrame1,
    user: mediaUser1,
    className: 'media_podium_first',
    profileId: 'creator-001',
  },
  {
    rank: 3,
    name: '꼬꼬댁',
    subscribers: '63K',
    frame: mediaFrame3,
    user: mediaUser3,
    className: 'media_podium_third',
    profileId: 'creator-003',
  },
]

const videoItems = [
  {
    id: 'media-video-1',
    creator: '레드닷존',
    title: '2024 가성비 전동건 TOP 5 리뷰',
    views: 56,
    daysAgo: 2,
  },
  {
    id: 'media-video-2',
    creator: '하나캠',
    title: '초보자를 위한 CQB 입문 세팅',
    views: 18,
    daysAgo: 4,
  },
  {
    id: 'media-video-3',
    creator: '꼬꼬댁',
    title: '필드에서 바로 쓰는 엄폐 이동 팁',
    views: 64,
    daysAgo: 7,
  },
  {
    id: 'media-video-4',
    creator: '베키사리',
    title: '야외전 필수 장비 체크리스트',
    views: 29,
    daysAgo: 14,
  },
  {
    id: 'media-video-5',
    creator: '알파튜브',
    title: '팀 매치에서 콜사인 제대로 쓰는 법',
    views: 41,
    daysAgo: 21,
  },
]

type ContentSort = 'latest' | 'popular'

function formatDaysAgo(daysAgo: number) {
  if (daysAgo < 7) return `${daysAgo}일 전`
  if (daysAgo % 7 === 0) return `${daysAgo / 7}주 전`
  return `${daysAgo}일 전`
}

const rankingItems = [
  { rank: 1, name: '레드닷존', score: 1500 },
  { rank: 2, name: '하나캠', score: 1225 },
  { rank: 3, name: '꼬꼬댁', score: 1080 },
  { rank: 4, name: '베키사리', score: 985 },
  { rank: 5, name: '나르마치고', score: 922 },
  { rank: 6, name: '알파튜브', score: 885 },
  { rank: 7, name: '빛나는꼬꼬', score: 823 },
  { rank: 8, name: '비온', score: 736 },
  { rank: 9, name: '깡나브리', score: 650 },
  { rank: 10, name: '육조준', score: 557 },
]

function PodiumProfile({ creator }: { creator: (typeof podiumCreators)[number] }) {
  return (
    <Link
      className={`media_podium_profile ${creator.className}`}
      to={`/media/${creator.profileId}`}
      aria-label={`${creator.name} 프로필 보기`}
    >
      <div className="media_podium_image" aria-hidden="true">
        <img className="media_podium_user" src={creator.user} alt="" />
        <img className="media_podium_frame" src={creator.frame} alt="" />
      </div>
      <strong className="media_podium_name">{creator.name}</strong>
      <p className="media_podium_subscribers">
        <img src={userIcon} alt="" aria-hidden="true" />
        <span>구독자 {creator.subscribers}</span>
      </p>
    </Link>
  )
}

export function MediaHome() {
  const navigate = useNavigate()
  const [rankingOpen, setRankingOpen] = useState(false)
  const [activeRankIndex, setActiveRankIndex] = useState(0)
  const [contentSort, setContentSort] = useState<ContentSort>('latest')
  const activeRanking = rankingItems[activeRankIndex % rankingItems.length]
  const sortedVideoItems = [...videoItems].sort((a, b) => {
    if (contentSort === 'popular') {
      return b.views - a.views
    }

    return a.daysAgo - b.daysAgo
  })

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveRankIndex((current) => (current + 1) % rankingItems.length)
    }, 1800)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="media_page">
      <section
        className="media_hero"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.46), rgba(0, 0, 0, 0.5)), url(${mediaMainBg})` }}
      >
        <header className="media_home_top">
          <div className="media_home_title">
            <button className="media_home_back" type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>
              <img src={arrowLIcon} alt="" aria-hidden="true" />
            </button>
            <h1 className="body_b_24">크리에이터 랭킹</h1>
          </div>
        </header>

        <div className="media_podium_row" aria-label="크리에이터 단상">
          {podiumCreators.map((creator) => (
            <PodiumProfile creator={creator} key={creator.rank} />
          ))}
        </div>
      </section>

      <section className="media_ranking_section" aria-labelledby="media-ranking-title">
        <div className="media_section_title" id="media-ranking-title">
          <img src={mediaRankingIcon} alt="" aria-hidden="true" />
          <h2 className="body_sb_16">실시간 크리에이터 랭킹 TOP 10</h2>
        </div>

        <div className={`media_ranking_box ${rankingOpen ? 'is_open' : ''}`}>
          <button
            className="media_ranking_toggle"
            type="button"
            aria-expanded={rankingOpen}
            aria-label="실시간 크리에이터 랭킹 펼치기"
            onClick={() => setRankingOpen((open) => !open)}
          >
            <span className="media_ranking_left">
              <span className="media_ranking_ticker" key={activeRanking.rank}>
                <span className="media_ranking_number body_b_16">{activeRanking.rank}</span>
                <strong className="body_sb_16">{activeRanking.name}</strong>
              </span>
            </span>
            <img src={arrowDownIcon} alt="" aria-hidden="true" />
          </button>

          {rankingOpen ? (
            <ol className="media_ranking_list" aria-label="실시간 크리에이터 랭킹 1위부터 10위">
              {rankingItems.map((item) => (
                <li className={`media_ranking_item ${item.rank === activeRanking.rank ? 'is_active' : ''}`} key={item.rank}>
                  <span className="media_ranking_item_left">
                    <span className={`media_ranking_item_rank body_b_14 ${item.rank <= 3 ? 'is_top' : ''}`}>{item.rank}</span>
                    <strong className="body_b_14">{item.name}</strong>
                  </span>
                  <span className="media_ranking_item_score body_sb_14">{item.score}</span>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </section>

      <section className="media_contents_section" aria-labelledby="media-contents-title">
        <div className="media_contents_head">
          <h2 id="media-contents-title" className="body_b_20">크리에이터 컨텐츠</h2>
          <div className="media_content_filters" aria-label="컨텐츠 정렬">
            <button className="media_content_filter_button" type="button" onClick={() => setContentSort('latest')}>
              <KeywordTag className={`media_content_filter ${contentSort === 'latest' ? 'is_active' : ''}`}>최신순</KeywordTag>
            </button>
            <button className="media_content_filter_button" type="button" onClick={() => setContentSort('popular')}>
              <KeywordTag className={`media_content_filter ${contentSort === 'popular' ? 'is_active' : ''}`}>인기순</KeywordTag>
            </button>
          </div>
        </div>

        <div className="media_video_list">
          {sortedVideoItems.map((item) => (
            <article className="media_video_item" key={item.id}>
              <div className="media_video_thumb" aria-hidden="true" />
              <div className="media_video_info">
                <div className="media_video_top">
                  <span className="body_m_14">{item.creator}</span>
                  <img src={rankingCheckIcon} alt="" aria-hidden="true" />
                </div>
                <strong className="media_video_title body_sb_16">{item.title}</strong>
                <p className="media_video_meta body_m_14">조회수 {item.views}K · {formatDaysAgo(item.daysAgo)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
