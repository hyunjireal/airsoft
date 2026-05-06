import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import './CreatorHome.css'
import list01 from '../../asset/images/creator_list01.png'
import list02 from '../../asset/images/creator_list02.png'
import list03 from '../../asset/images/creator_list03.png'
import list04 from '../../asset/images/creator_list04.png'
import list05 from '../../asset/images/creator_list05.png'
import list06 from '../../asset/images/creator_list06.png'

const profileMap = {
  'creator-001': {
    name: '레드닷존',
    hero: list02,
    tiles: ['어쩌고..', '저쩌고..'],
    bio: '크리에이터 레드닷존은 에어소프트건 경기 콘텐츠를 중심으로, 실제 플레이 기반의 분석과 전략 설명을 제공하는 크리에이터입니다. 경기 흐름을 세밀하게 짚어내는 해설과 직관적인 전달력으로 시청자들의 이해도를 높이며, 시청자들 사이에서 높은 평가를 받고 있는 크리에이터입니다.',
  },
  'creator-002': {
    name: '영스윙',
    hero: list01,
    tiles: ['장비 리뷰', '필드 노트'],
    bio: '크리에이터 영스윙은 입문자도 쉽게 따라올 수 있는 장비 리뷰와 필드 경험 콘텐츠를 만듭니다. 안전한 사용법과 실전에서 도움이 되는 팁을 차분하게 풀어내는 크리에이터입니다.',
  },
  'creator-003': {
    name: '바보링',
    hero: list03,
    tiles: ['게임 로그', '전술 기록'],
    bio: '크리에이터 바보링은 경기 장면을 감각적으로 편집하고 전술 포인트를 짧고 명확하게 전달합니다. 플레이의 재미와 분석을 함께 보여주는 크리에이터입니다.',
  },
  'creator-004': {
    name: '아쿠마',
    hero: list04,
    tiles: ['필드 리뷰', '초보 가이드'],
    bio: '크리에이터 아쿠마는 필드별 분위기와 규칙, 초보자가 놓치기 쉬운 매너를 정리합니다. 처음 방문하는 필드도 부담 없이 준비할 수 있도록 돕는 크리에이터입니다.',
  },
}

const yearFilters = ['2026', '2025', '2024', '2023', '2022']
const contentImages = [list01, list05, list06]

export function CreatorProfile() {
  const { creatorId } = useParams()
  const profile = useMemo(() => {
    return profileMap[creatorId as keyof typeof profileMap] ?? profileMap['creator-001']
  }, [creatorId])

  return (
    <div className="creator_profile_page">
      <section className="creator_profile_hero" style={{ backgroundImage: `url(${profile.hero})` }}>
        <div className="creator_profile_float_cards">
          {profile.tiles.map((tile) => (
            <div key={tile}>{tile}</div>
          ))}
        </div>
      </section>

      <main className="creator_profile_content">
        <section className="creator_profile_stats" aria-label="크리에이터 통계">
          <div>
            <strong>150k</strong>
            <span>구독자수</span>
          </div>
          <div>
            <strong>140</strong>
            <span>좋아요</span>
          </div>
          <div>
            <strong>140</strong>
            <span>동영상 수</span>
          </div>
        </section>

        <h1>{profile.name}</h1>
        <p className="creator_profile_bio">{profile.bio}</p>

        <div className="creator_profile_years" aria-label="콘텐츠 연도">
          {yearFilters.map((year, index) => (
            <button className={index === 0 ? 'is_active' : ''} type="button" key={year}>
              {year}
            </button>
          ))}
        </div>

        <section className="creator_profile_gallery" aria-label={`${profile.name} 콘텐츠`}>
          <img className="creator_profile_gallery_wide" src={contentImages[0]} alt="" />
          <img src={contentImages[1]} alt="" />
          <img src={contentImages[2]} alt="" />
        </section>
      </main>
    </div>
  )
}
