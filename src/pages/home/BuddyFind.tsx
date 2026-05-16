import { useEffect, useState } from 'react'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import arrowLeftIcon from '../../asset/icons/arrow_l.svg'
import buddyCalendarIcon from '../../asset/icons/buddy_cal.png'
import buddyHeroDark from '../../asset/images/buddy_bg_d.png'
import buddyHeroLight from '../../asset/images/buddy_bg_l.png'
import buddyLoadingFigmaBg from '../../asset/images/buddy_loading_figma_bg.png'
import buddyLoadingFigmaBgLight from '../../asset/images/buddy_loading_figma_bg_light.png'
import buddyProfileOne from '../../asset/images/buddy_profile_img01.png'
import buddyProfileTwo from '../../asset/images/buddy_profile_img02.png'
import buddyProfileThree from '../../asset/images/buddy_profile_img03.png'
import buddyProfileFour from '../../asset/images/buddy_profile_img04.png'
import buddyProfileFive from '../../asset/images/buddy_profile_img05.png'
import { PageHeader } from '../../components/PageHeader'
import { useThemeMode } from '../../hooks/useThemeMode'
import {
  buddyButtonHover,
  buddyButtonTap,
  buddyCardVariants,
  buddyChipVariants,
  buddyInViewViewport,
  buddySectionVariants,
  buddyStaggerContainerVariants,
  buddySurfaceVariants,
} from './buddyFindMotion'
import './BuddyFind.css'

type ScheduleItem = {
  id: number
  date: string
  place: string
  memberCount: string
  summaryLabel?: string
}

type FilterOption = {
  id: string
  label: string
}

type BuddyRecommendation = {
  id: string
  name: string
  region: string
  experience: string
  manner: string
  rating: string
  image: string
}

type BuddyReview = {
  id: string
  author: string
  tag: string
  body: string
  date: string
}

const MOCK_SCHEDULES: ScheduleItem[] = [
  {
    id: 1,
    date: '5/23 (토) 13:00',
    place: '서울 CQB 아레나',
    memberCount: '8 / 12명',
    summaryLabel: '5/23 (토) 13:30 서울 CQB 아레나',
  },
  {
    id: 2,
    date: '5/24 (일) 15:00',
    place: '인천 필드 전장',
    memberCount: '5 / 10명',
  },
  {
    id: 3,
    date: '5/26 (화) 18:30',
    place: '송파 택티컬존',
    memberCount: '10 / 14명',
  },
  {
    id: 4,
    date: '5/27 (수) 14:00',
    place: '수원 밀심 필드',
    memberCount: '4 / 8명',
  },
]

const HELP_OPTIONS: FilterOption[] = [
  { id: 'equipment', label: '장비' },
  { id: 'rules', label: '룰·안전' },
  { id: 'adaptation', label: '적응 도움' },
  { id: 'position', label: '포지션 추천' },
  { id: 'teamplay', label: '팀플레이' },
  { id: 'solo', label: '개인전' },
]

const EXP_OPTIONS: FilterOption[] = [
  { id: 'first', label: '처음 참여' },
  { id: 'one-two', label: '1~2회 참여' },
  { id: 'three-plus', label: '3회 이상' },
]

const BUDDY_RECOMMENDATIONS: BuddyRecommendation[] = [
  {
    id: 'buddy-buddy',
    name: '버디버디',
    region: '경기도',
    experience: '안내 9회',
    manner: '우수',
    rating: '4.8',
    image: buddyProfileOne,
  },
  {
    id: 'tacti-bear',
    name: '택티곰',
    region: '서울',
    experience: '안내 2회',
    manner: '우수',
    rating: '4.9',
    image: buddyProfileTwo,
  },
  {
    id: 'lime-shot',
    name: '라임샷',
    region: '경기도',
    experience: '안내 9회',
    manner: '우수',
    rating: '4.7',
    image: buddyProfileThree,
  },
  {
    id: 'magnum',
    name: '매그넘',
    region: '경기도',
    experience: '안내 6회',
    manner: '우수',
    rating: '4.2',
    image: buddyProfileFour,
  },
  {
    id: 'kill-shopping',
    name: '킬샷핑',
    region: '경기도',
    experience: '안내 7회',
    manner: '우수',
    rating: '4.0',
    image: buddyProfileFive,
  },
]

const BUDDY_DETAIL_REVIEWS: BuddyReview[] = [
  {
    id: 'review-01',
    author: '화가난빵아리',
    tag: 'CQB',
    body: '입문자인데 끝까지 잘 알려줬어요.\n덕분에 정말 재미있게 플레이했습니다!',
    date: '2026.05.11',
  },
  {
    id: 'review-02',
    author: '착한사람',
    tag: '팀플레이',
    body: '팀 분위기를 잘 이끌어줘서 편하게\n집중할 수 있었어요. 최고!',
    date: '2026.05.09',
  },
  {
    id: 'review-03',
    author: '에어소프트초보',
    tag: '필드적응',
    body: '처음 가는 필드였는데 지형이랑 전략까지\n세심하게 케어해줘서 든든했어요.',
    date: '2026.05.08',
  },
]

const BUDDY_DETAIL_TAGS = ['공격형', '팀플레이', 'CQB 전문', '입문자 친화', '커뮤니케이션 우수', '전략적 플레이']

export function BuddyFind() {
  const navigate = useNavigate()
  const themeMode = useThemeMode()
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(1)
  const [selectedHelpIds, setSelectedHelpIds] = useState<string[]>(['equipment', 'rules'])
  const [selectedExpId, setSelectedExpId] = useState<string>('first')

  const selectedSchedule =
    MOCK_SCHEDULES.find((schedule) => schedule.id === selectedScheduleId) ?? null
  const selectedHelpOptions = HELP_OPTIONS.filter((option) => selectedHelpIds.includes(option.id))
  const selectedExpOption = EXP_OPTIONS.find((option) => option.id === selectedExpId) ?? null
  const isReadyToStart =
    selectedSchedule !== null && selectedHelpOptions.length > 0 && selectedExpOption !== null

  const toggleHelpOption = (targetId: string) => {
    setSelectedHelpIds((currentIds) =>
      currentIds.includes(targetId)
        ? currentIds.filter((id) => id !== targetId)
        : [...currentIds, targetId],
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <article className="buddy_find_page">
        <PageHeader
          variant={themeMode === 'dark' ? 'dark' : 'default'}
          className="buddy_find_header"
          onBack={() => navigate(-1)}
          backLabel="뒤로 가기"
          title="버디 찾기"
        />

        <section className="buddy_find_hero" aria-label="버디 매칭 소개">
          <img
            className="buddy_find_hero__art"
            src={themeMode === 'dark' ? buddyHeroDark : buddyHeroLight}
            alt=""
            aria-hidden="true"
          />
          <div className="buddy_find_hero__info">
            <p className="buddy_find_hero__title">
              같은 게임 참가자와
              <br />
              버디 매칭을 시작해보세요
            </p>
          </div>
        </section>

        <m.section
          className="buddy_find_section"
          aria-labelledby="buddy_find_step_01"
          initial="hidden"
          whileInView="visible"
          viewport={buddyInViewViewport}
          variants={buddySectionVariants}
        >
          <div className="buddy_find_section__header">
            <span className="buddy_find_section__badge" aria-hidden="true">
              1
            </span>
            <h2 className="buddy_find_section__title" id="buddy_find_step_01">
              다가오는 매치 선택
            </h2>
          </div>
          <p className="buddy_find_section__desc">
            일정 예약 시 <span>버디 필요를 체크</span>하면 함께할 버디를 연결해드려요
          </p>

          <m.div
            className="buddy_find_schedule_list"
            aria-label="다가오는 매치 목록"
            variants={buddyStaggerContainerVariants}
          >
            {MOCK_SCHEDULES.map((schedule) => {
              const isSelected = schedule.id === selectedScheduleId

              return (
                <m.article
                  key={schedule.id}
                  className={[
                    'buddy_find_schedule_card',
                    'buddy_find_motion_surface',
                    isSelected ? 'buddy_find_schedule_card--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  variants={buddyCardVariants}
                >
                  <div className="buddy_find_schedule_card__content">
                    <div className="buddy_find_schedule_card__icon_wrap" aria-hidden="true">
                      <img src={buddyCalendarIcon} alt="" />
                    </div>
                    <div className="buddy_find_schedule_card__text">
                      <p className="buddy_find_schedule_card__date">{schedule.date}</p>
                      <p className="buddy_find_schedule_card__place">{schedule.place}</p>
                      <p className="buddy_find_schedule_card__count">{schedule.memberCount}</p>
                    </div>
                  </div>
                  <div className="buddy_find_schedule_card__divider" role="separator" />
                  <m.button
                    className="buddy_find_schedule_card__action buddy_find_motion_button"
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedScheduleId(schedule.id)}
                    whileHover={buddyButtonHover}
                    whileTap={buddyButtonTap}
                  >
                    일정 선택
                  </m.button>
                </m.article>
              )
            })}
          </m.div>
        </m.section>

        <m.div
          className="buddy_find_more"
          initial="hidden"
          whileInView="visible"
          viewport={buddyInViewViewport}
          variants={buddySurfaceVariants}
        >
          <m.button
            className="buddy_find_more__button buddy_find_motion_button"
            type="button"
            onClick={() => navigate('/match')}
            whileHover={buddyButtonHover}
            whileTap={buddyButtonTap}
          >
            <div className="buddy_find_more__left">
              <span className="buddy_find_more__icon_wrap" aria-hidden="true">
                <img src={buddyCalendarIcon} alt="" />
              </span>
              <span className="buddy_find_more__label">다른 날짜의 게임 찾기</span>
            </div>
            <img
              className="buddy_find_more__arrow"
              src={arrowLeftIcon}
              alt=""
              aria-hidden="true"
            />
          </m.button>
        </m.div>

        <m.section
          className="buddy_find_section buddy_find_section--filters"
          aria-labelledby="buddy_find_step_02"
          initial="hidden"
          whileInView="visible"
          viewport={buddyInViewViewport}
          variants={buddySectionVariants}
        >
          <div className="buddy_find_section__header">
            <span className="buddy_find_section__badge" aria-hidden="true">
              2
            </span>
            <h2 className="buddy_find_section__title" id="buddy_find_step_02">
              버디 매칭 설정
            </h2>
          </div>
          <p className="buddy_find_section__desc buddy_find_section__desc--stacked">
            도움이 필요한 항목과 경험 수준을 선택하면
            <br />
            더 잘 맞는 버디를 추천해드려요
          </p>

          <m.div
            className="buddy_find_filter_card buddy_find_motion_surface"
            variants={buddySurfaceVariants}
          >
            <div className="buddy_find_filter_group">
              <h3 className="buddy_find_filter_title">
                도움이 필요한 부분 <span>(복수 선택)</span>
              </h3>
              <div className="buddy_find_filter_grid">
                {HELP_OPTIONS.map((option) => (
                  <m.button
                    key={option.id}
                    type="button"
                    className={[
                      'buddy_find_filter_button',
                      'buddy_find_motion_button',
                      selectedHelpIds.includes(option.id) ? 'buddy_find_filter_button--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-pressed={selectedHelpIds.includes(option.id)}
                    onClick={() => toggleHelpOption(option.id)}
                    whileHover={buddyButtonHover}
                    whileTap={buddyButtonTap}
                  >
                    {option.label}
                  </m.button>
                ))}
              </div>
            </div>
          </m.div>

          <m.div
            className="buddy_find_filter_card buddy_find_motion_surface"
            variants={buddySurfaceVariants}
          >
            <div className="buddy_find_filter_group">
              <h3 className="buddy_find_filter_title">플레이 경험 수준</h3>
              <div className="buddy_find_filter_grid">
                {EXP_OPTIONS.map((option) => (
                  <m.button
                    key={option.id}
                    type="button"
                    className={[
                      'buddy_find_filter_button',
                      'buddy_find_motion_button',
                      selectedExpId === option.id ? 'buddy_find_filter_button--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-pressed={selectedExpId === option.id}
                    onClick={() => setSelectedExpId(option.id)}
                    whileHover={buddyButtonHover}
                    whileTap={buddyButtonTap}
                  >
                    {option.label}
                  </m.button>
                ))}
              </div>
            </div>
          </m.div>
        </m.section>

        <m.section
          className="buddy_find_section buddy_find_section--summary"
          aria-labelledby="buddy_find_step_03"
          initial="hidden"
          whileInView="visible"
          viewport={buddyInViewViewport}
          variants={buddySectionVariants}
        >
          <div className="buddy_find_section__header">
            <span className="buddy_find_section__badge" aria-hidden="true">
              3
            </span>
            <h2 className="buddy_find_section__title" id="buddy_find_step_03">
              선택 요약
            </h2>
          </div>

          <m.div
            className="buddy_find_summary_card buddy_find_motion_surface"
            variants={buddySurfaceVariants}
          >
            {selectedSchedule ? (
              <m.button
                className="buddy_find_summary_chip buddy_find_summary_chip--schedule buddy_find_motion_button"
                type="button"
                onClick={() => setSelectedScheduleId(null)}
                variants={buddyChipVariants}
                whileHover={buddyButtonHover}
                whileTap={buddyButtonTap}
              >
                <span className="buddy_find_summary_chip__left">
                  <img src={buddyCalendarIcon} alt="" aria-hidden="true" />
                  <span>
                    {selectedSchedule.summaryLabel ??
                      `${selectedSchedule.date} ${selectedSchedule.place}`}
                  </span>
                </span>
                <span className="buddy_find_summary_chip__close" aria-hidden="true">
                  ×
                </span>
              </m.button>
            ) : null}

            <m.div className="buddy_find_summary_row" variants={buddyStaggerContainerVariants}>
              {selectedHelpOptions.map((option) => (
                <m.button
                  key={option.id}
                  className="buddy_find_summary_chip buddy_find_motion_button"
                  type="button"
                  variants={buddyChipVariants}
                  onClick={() =>
                    setSelectedHelpIds((currentIds) =>
                      currentIds.filter((id) => id !== option.id),
                    )
                  }
                  whileHover={buddyButtonHover}
                  whileTap={buddyButtonTap}
                >
                  <span>{option.label}</span>
                  <span className="buddy_find_summary_chip__close" aria-hidden="true">
                    ×
                  </span>
                </m.button>
              ))}

              {selectedExpOption ? (
                <m.button
                  key={selectedExpOption.id}
                  className="buddy_find_summary_chip buddy_find_motion_button"
                  type="button"
                  variants={buddyChipVariants}
                  onClick={() => setSelectedExpId('')}
                  whileHover={buddyButtonHover}
                  whileTap={buddyButtonTap}
                >
                  <span>{selectedExpOption.label}</span>
                  <span className="buddy_find_summary_chip__close" aria-hidden="true">
                    ×
                  </span>
                </m.button>
              ) : null}
            </m.div>
          </m.div>
        </m.section>

        <m.div
          className="buddy_find_footer"
          initial="hidden"
          whileInView="visible"
          viewport={buddyInViewViewport}
          variants={buddySurfaceVariants}
        >
          <m.button
            className="buddy_find_start_button buddy_find_motion_button"
            type="button"
            disabled={!isReadyToStart}
            onClick={() => navigate('/buddy/loading')}
            whileHover={isReadyToStart ? buddyButtonHover : undefined}
            whileTap={isReadyToStart ? buddyButtonTap : undefined}
          >
            버디 추천 시작
          </m.button>
        </m.div>
      </article>
    </LazyMotion>
  )
}

export function BuddyLoading() {
  const navigate = useNavigate()
  const themeMode = useThemeMode()
  const isLightMode = themeMode === 'light'

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      navigate('/buddy/recommend')
    }, 2600)

    return () => window.clearTimeout(timerId)
  }, [navigate])

  return (
    <article
      className={`buddy_loading_page${isLightMode ? ' buddy_loading_page--light' : ''}`}
      aria-live="polite"
      aria-busy="true"
    >
      <img
        className="buddy_loading_bg"
        src={isLightMode ? buddyLoadingFigmaBgLight : buddyLoadingFigmaBg}
        alt=""
        aria-hidden="true"
      />

      <PageHeader
        variant={isLightMode ? 'transparent' : 'overlay'}
        className="buddy_loading_header"
        onBack={() => navigate('/buddy')}
        backLabel="버디 찾기로 돌아가기"
        hideRight
      />

      <div className="buddy_loading_statusbar" aria-hidden="true">
        <span className="buddy_loading_statusbar__time">15:00</span>
        <span className="buddy_loading_statusbar__icons">
          <span className="buddy_loading_signal">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="buddy_loading_wifi" />
          <span className="buddy_loading_battery" />
        </span>
      </div>

      <section className="buddy_loading_text">
        <h1>버디 찾는 중</h1>
        <p>
          당신에게 맞는 버디를 찾고있어요{isLightMode ? '.' : ''}
          <br />
          잠시만 기다려주세요{isLightMode ? '!' : ''}
        </p>
      </section>

    </article>
  )
}

export function BuddyRecommend() {
  const navigate = useNavigate()
  const themeMode = useThemeMode()
  const isLightMode = themeMode === 'light'

  return (
    <article className={`buddy_recommend_page${isLightMode ? ' buddy_recommend_page--light' : ''}`}>
      <PageHeader
        variant={isLightMode ? 'default' : 'dark'}
        className="buddy_recommend_header"
        onBack={() => navigate('/buddy')}
        backLabel="버디 찾기로 돌아가기"
        title="추천 버디"
      />

      <section className="buddy_recommend_intro">
        <p>가장 적합한 순서대로 안내해 드릴게요</p>
      </section>

      <section className="buddy_recommend_list_section" aria-label="추천 버디 목록">
        <div className="buddy_recommend_list">
          {BUDDY_RECOMMENDATIONS.map((buddy) => (
            <button
              className="buddy_recommend_card"
              type="button"
              key={buddy.id}
              onClick={() => navigate(`/buddy/recommend/${buddy.id}`)}
            >
              <span className="buddy_recommend_card__main">
                <img className="buddy_recommend_card__avatar" src={buddy.image} alt="" />
                <span className="buddy_recommend_card__info">
                  <strong className="buddy_recommend_card__name">{buddy.name}</strong>
                  <span className="buddy_recommend_card__meta">
                    <span>
                      <b>지역</b>
                      <span>{buddy.region}</span>
                    </span>
                    <span>
                      <b>경험</b>
                      <span>{buddy.experience}</span>
                    </span>
                    <span>
                      <b>매너</b>
                      <span>{buddy.manner}</span>
                    </span>
                  </span>
                  <span className="buddy_recommend_card__rating">
                    <span aria-hidden="true">★</span>
                    {buddy.rating}
                  </span>
                </span>
              </span>
              <span className="buddy_recommend_card__arrow" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </article>
  )
}

export function BuddyDetail() {
  const navigate = useNavigate()
  const { buddyId } = useParams()
  const themeMode = useThemeMode()
  const isLightMode = themeMode === 'light'
  const buddy =
    BUDDY_RECOMMENDATIONS.find((recommendation) => recommendation.id === buddyId) ??
    BUDDY_RECOMMENDATIONS[0]

  return (
    <article className={`buddy_detail_page${isLightMode ? ' buddy_detail_page--light' : ''}`}>
      <PageHeader
        variant={isLightMode ? 'default' : 'dark'}
        className="buddy_detail_header"
        onBack={() => navigate('/buddy/recommend')}
        backLabel="추천 버디로 돌아가기"
        title="버디 상세"
      />

      <main className="buddy_detail_content">
        <section className="buddy_detail_profile" aria-label={`${buddy.name} 프로필`}>
          <div className="buddy_detail_avatar_wrap">
            <img className="buddy_detail_avatar" src={buddy.image} alt="" />
          </div>

          <div className="buddy_detail_identity">
            <h1>{buddy.name}</h1>
            <p className="buddy_detail_rating">
              <span aria-hidden="true">★</span>
              {buddy.rating}
            </p>
          </div>
        </section>

        <section className="buddy_detail_styles" aria-labelledby="buddy_detail_styles_title">
          <h2 id="buddy_detail_styles_title">버디의 플레이 스타일</h2>
          <div className="buddy_detail_tag_list">
            {BUDDY_DETAIL_TAGS.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>

        <section className="buddy_detail_quote">
          <span aria-hidden="true">“</span>
          <p>
            저와 함께 다니면
            <br />
            모든 분들이 행복하고 즐거워합니다.
          </p>
          <span aria-hidden="true">”</span>
        </section>

        <section className="buddy_detail_stats" aria-label="버디 활동 정보">
          <div>
            <p>안내 완료</p>
            <strong>9회</strong>
          </div>
          <div>
            <p>선호 플레이</p>
            <strong>CQB</strong>
          </div>
          <div>
            <p>매너도</p>
            <strong>우수</strong>
          </div>
          <div>
            <p>응답 속도</p>
            <strong>빠름</strong>
          </div>
        </section>

        <section className="buddy_detail_reviews" aria-labelledby="buddy_detail_reviews_title">
          <div className="buddy_detail_section_header">
            <h2 id="buddy_detail_reviews_title">최근 플레이 후기</h2>
          </div>
          <div className="buddy_detail_review_list">
            {BUDDY_DETAIL_REVIEWS.map((review) => (
              <article className="buddy_detail_review_card" key={review.id}>
                <div className="buddy_detail_review_top">
                  <div className="buddy_detail_reviewer">
                    <span aria-hidden="true" />
                    <strong>{review.author}</strong>
                  </div>
                  <span className="buddy_detail_review_stars" aria-label="별점 5점">
                    ★★★★★
                  </span>
                </div>
                <span className="buddy_detail_review_tag">{review.tag}</span>
                <p>
                  {review.body.split('\n').map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                <time>{review.date}</time>
              </article>
            ))}
          </div>
        </section>

        <button className="buddy_detail_request" type="button">
          버디 요청하기
        </button>
      </main>
    </article>
  )
}
