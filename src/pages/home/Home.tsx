import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CategoryTag from '../../components/CategoryTag'
import KeywordTag from '../../components/KeywordTag'
import { LoginButton } from '../../components/LoginButton'
import MainTag from '../../components/MainTag'
import More from '../../components/More'
import { PageHeader } from '../../components/PageHeader'
import arrowDownIcon from '../../asset/icons/arrow_down.svg'
import arrowR from '../../asset/icons/arrow_r.svg'
import arrowUpIcon from '../../asset/icons/arrow_up.svg'
import buddyAlertIcon from '../../asset/icons/match_alert.svg'
import buddyCalendarIcon from '../../asset/icons/match_calendar.svg'
import buddyInfoIcon from '../../asset/icons/buddy_info.svg'
import buddyPinIcon from '../../asset/icons/match_pin.svg'
import buddyUsersIcon from '../../asset/icons/com_user.svg'
import mainBuddyClockIcon from '../../asset/icons/main_buddy_clock.svg'
import mainProfileIcon from '../../asset/icons/main_profile01.svg'
import mainQuizRIcon from '../../asset/icons/main_quiz_r.svg'
import mainStarIcon from '../../asset/icons/main_star.svg'
import settingsIcon from '../../asset/icons/settings.svg'
import heroImg from '../../asset/images/main_img02.png'
import mainProfileTag01 from '../../asset/images/main_profile_tag01.png'
import mainProfileTag02 from '../../asset/images/main_profile_tag02.png'
import userAvatar from '../../asset/images/main_user01.png'
import mainAiBg from '../../asset/images/main_aiBG.png'
import mainAiImg from '../../asset/images/main_aiImg.png'
import mainBuddy01 from '../../asset/images/main_buddy01.png'
import mainBuddy02 from '../../asset/images/main_buddy02.png'
import mainBuddy03 from '../../asset/images/main_buddy03.png'
import mainBuddy04 from '../../asset/images/main_buddy04.png'
import mainQnaImg from '../../asset/images/main_qna01.png'
import mainQuizImg from '../../asset/images/main_quizImg01.png'
import badge03 from '../../asset/images/badge03.png'
import symbolBeginner from '../../asset/images/symbol_beginner.png'
import mainTeam01 from '../../asset/images/main_team01.png'
import mainTeam02 from '../../asset/images/main_team02.png'
import mainTeamImg01 from '../../asset/images/main_teamImg01.png'
import mainTeamImg02 from '../../asset/images/main_teamImg02.png'
import mainTeamImg03 from '../../asset/images/main_teamImg03.png'
import mainTeamImg04 from '../../asset/images/main_teamImg04.png'
import { getMyMatches, type MyMatchItem } from '../my/myMatchData'
import './Home.css'

type HomeMatchCard = {
  id: string | number
  dday: string
  notice: string
  place: string
  datetime: string
  img: string
  sortTime?: number
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const teamCards = [
  { id: 1, name: '무적해병', region: '경기도 파주시', tags: ['초보자팀', '주말팀'], logo: mainTeamImg01 },
  { id: 2, name: '무적해병', region: '경기도 파주시', tags: ['초보자팀', '평일팀'], logo: mainTeamImg02 },
  { id: 3, name: '무적해병', region: '경기도 파주시', tags: ['초보자팀', '주말팀'], logo: mainTeamImg03 },
  { id: 4, name: '무적해병', region: '경기도 파주시', tags: ['초보자팀', '평일팀'], logo: mainTeamImg04 },
  { id: 5, name: '택티컬 블랙', region: '서울 CQB', tags: ['숙련자팀', '주말팀'], logo: mainTeamImg01 },
  { id: 6, name: '알파라인', region: '경기 북부권', tags: ['숙련자팀', '평일팀'], logo: mainTeamImg02 },
  { id: 7, name: '초심자 연합', region: '경기 용인권', tags: ['초보자팀', '주말팀'], logo: mainTeamImg03 },
  { id: 8, name: '프렌들리 팀', region: '서울 수도권', tags: ['초보자팀', '평일팀'], logo: mainTeamImg04 },
  { id: 9, name: '그린존 루키즈', region: '경기 고양권', tags: ['초보자팀', '주말팀'], logo: mainTeamImg01 },
  { id: 10, name: '세이프티 크루', region: '서울 노원권', tags: ['초보자팀', '평일팀'], logo: mainTeamImg02 },
  { id: 11, name: '브라보 입문반', region: '인천 서구권', tags: ['초보자팀', '주말팀'], logo: mainTeamImg03 },
  { id: 12, name: '느긋한 전우회', region: '경기 수원권', tags: ['초보자팀', '평일팀'], logo: mainTeamImg04 },
  { id: 13, name: '주말 사격회', region: '서울 마포권', tags: ['주말팀'], logo: mainTeamImg01 },
  { id: 14, name: '필드메이트', region: '경기 성남권', tags: ['평일팀'], logo: mainTeamImg02 },
  { id: 15, name: '스모크 라인', region: '경기 안양권', tags: ['숙련자팀'], logo: mainTeamImg03 },
  { id: 16, name: 'CQB 베테랑즈', region: '서울 영등포권', tags: ['숙련자팀'], logo: mainTeamImg04 },
  { id: 17, name: '델타 포지션', region: '인천 송도권', tags: ['주말팀'], logo: mainTeamImg01 },
  { id: 18, name: '밸런스 스쿼드', region: '경기 광명권', tags: ['평일팀'], logo: mainTeamImg02 },
]
const tournamentCards = [
  { id: 1, name: '팀 바주카', region: '서울 · 수도권', logo: mainTeam01, stats: { atk: 8, def: 7, tac: 8 } },
  { id: 2, name: '팀 블랙워터', region: '부산 · 경남권', logo: mainTeam02, stats: { atk: 7, def: 9, tac: 9 } },
]

const buddyItems = [
  {
    id: 1,
    image: mainBuddy02,
    title: '장비 체크',
  },
  {
    id: 2,
    image: mainBuddy03,
    title: '룰 안내',
  },
  {
    id: 3,
    image: mainBuddy04,
    title: '첫 라운드 동행',
  },
]

const buddyProcessSteps = [
  {
    id: 1,
    icon: buddyCalendarIcon,
    title: '일정 선택',
    description: '다가올 게임 선택',
  },
  {
    id: 2,
    icon: buddyPinIcon,
    title: '버디 필요 체크',
    description: '도움 필요 여부 입력',
  },
  {
    id: 3,
    icon: buddyAlertIcon,
    title: '참여자 추천',
    description: '같은 게임에 참여하는 사람 중 버디를 추천받아요.',
  },
  {
    id: 4,
    icon: buddyUsersIcon,
    title: '요청 후 확인',
    description: '상대가 수락하면 내 매칭 현황에서 확인하고 채팅할 수 있어요.',
  },
]

const HOME_PROFILE_IMAGE_KEY = 'airsoft:home-profile-image'
const BUDDY_SHEET_CLOSE_DURATION = 280

function normalizeDateValue(value?: string) {
  const matchedDate = value?.trim().replaceAll('.', '-').match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (!matchedDate) return null

  const [, year, month, day] = matchedDate
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function normalizeTimeValue(value?: string) {
  const matchedTime = value?.match(/(\d{1,2}):(\d{2})/)
  if (!matchedTime) return '00:00'

  const [, hour, minute] = matchedTime
  return `${hour.padStart(2, '0')}:${minute}`
}

function getScheduleDate(match: MyMatchItem) {
  const dateValue = normalizeDateValue(match.dateValue ?? match.time)
  if (!dateValue) return null

  const timeValue = normalizeTimeValue(match.time)
  const date = new Date(`${dateValue}T${timeValue}:00`)

  return Number.isNaN(date.getTime()) ? null : date
}

function getDaysUntil(date: Date) {
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

  return Math.ceil((targetStart - todayStart) / ONE_DAY_MS)
}

function formatDday(daysUntil: number) {
  if (daysUntil === 0) return '오늘 경기'
  return `경기 ${daysUntil}일 전`
}

function formatKoreanTime(timeValue?: string) {
  const [hourString, minuteString] = normalizeTimeValue(timeValue).split(':')
  const hour = Number(hourString)
  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour % 12 || 12

  return `${period} ${String(displayHour).padStart(2, '0')}:${minuteString}`
}

function formatScheduleDateTime(date: Date, timeValue?: string) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day} ${formatKoreanTime(timeValue)}`
}

function createHomeScheduleCards() {
  return getMyMatches()
    .filter((match) => match.status !== 'past')
    .map((match): HomeMatchCard | null => {
      const date = getScheduleDate(match)
      if (!date) return null

      const daysUntil = getDaysUntil(date)
      if (daysUntil < 0) return null

      const place = [match.region, match.fieldName].filter(Boolean).join(' · ') || '장소 미정'

      return {
        id: match.id,
        dday: formatDday(daysUntil),
        notice: match.title,
        place,
        datetime: formatScheduleDateTime(date, match.time),
        img: match.imageSrc,
        sortTime: date.getTime(),
      }
    })
    .filter((card): card is HomeMatchCard => Boolean(card))
    .sort((a, b) => (a.sortTime ?? 0) - (b.sortTime ?? 0))
    .slice(0, 5)
}

const homeAchievementTagStyle: CSSProperties = {
  border: 0,
  fontFamily: 'var(--font-pretendard)',
  fontSize: 'var(--font-size-14)',
  fontWeight: 'var(--font-weight-medium)',
  lineHeight: 'var(--line-height-130)',
  letterSpacing: 'var(--letter-spacing-tight)',
}

const visibleAchievementBadges = [
  {
    label: '첫 AI 질문 완료',
    icon: mainProfileTag02,
    background: '#E0E5EF',
    color: 'var(--color-navy)',
  },
  {
    label: '친환경 바이오탄 지식인',
    icon: mainProfileTag01,
    background: '#EDF4E5',
    color: '#637A45',
  },
]

const hiddenAchievementBadges = [
  {
    label: '첫 경기 예약 완료',
    icon: mainProfileTag02,
    background: '#F2E8DB',
    color: '#7A5935',
  },
  {
    label: '안전수칙 퀴즈 통과',
    icon: mainProfileTag01,
    background: '#E8F1F4',
    color: '#416E7A',
  },
  {
    label: '필드 버디 신청',
    icon: mainProfileTag02,
    background: '#F1E8F5',
    color: '#70507A',
  },
  {
    label: '장비 체크 완료',
    icon: mainProfileTag01,
    background: '#F4EFE5',
    color: '#74633F',
  },
  {
    label: '커뮤니티 첫 댓글',
    icon: mainProfileTag02,
    background: '#E8F0EA',
    color: '#4F7359',
  },
]

function useDragScroll() {
  const dragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  })

  const stopDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDown) return

    dragState.current.isDown = false
    event.currentTarget.classList.remove('is_dragging')
  }

  return {
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return

      dragState.current = {
        isDown: true,
        startX: event.clientX,
        scrollLeft: event.currentTarget.scrollLeft,
      }
      event.currentTarget.classList.add('is_dragging')
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      if (!dragState.current.isDown) return

      const distance = event.clientX - dragState.current.startX
      event.currentTarget.scrollLeft = dragState.current.scrollLeft - distance
      event.preventDefault()
    },
    onPointerUp: stopDrag,
    onPointerCancel: stopDrag,
    onPointerLeave: stopDrag,
  }
}

export function Home() {
  const navigate = useNavigate()
  const teamScrollRef = useRef<HTMLDivElement>(null)
  const isTeamAutoPausedRef = useRef(false)
  const teamAutoResumeTimerRef = useRef<number | null>(null)
  const matchDragScroll = useDragScroll()
  const teamDragScroll = useDragScroll()
  const bannerDragScroll = useDragScroll()
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const albumInputRef = useRef<HTMLInputElement>(null)
  const cameraVideoRef = useRef<HTMLVideoElement>(null)
  const [isAchievementExpanded, setIsAchievementExpanded] = useState(false)
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isBuddySheetOpen, setIsBuddySheetOpen] = useState(false)
  const [isBuddySheetClosing, setIsBuddySheetClosing] = useState(false)
  const [profilePreview, setProfilePreview] = useState(() => localStorage.getItem(HOME_PROFILE_IMAGE_KEY) || userAvatar)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState('')
  const [scheduleRevision, setScheduleRevision] = useState(0)
  const savedProfileBadge = localStorage.getItem('homeProfileBadge')
  const savedProfileTitle = localStorage.getItem('homeProfileTitle')
  const savedLevel = localStorage.getItem('level')
  const savedSkillAlias = localStorage.getItem('skillAlias')
  const savedNickname = localStorage.getItem('nickname')
  const isVeteranProfile =
    savedProfileBadge === 'badge03' || savedLevel === '숙련자' || savedSkillAlias === '베테랑'
  const homeProfileBadge = isVeteranProfile ? badge03 : symbolBeginner
  const homeProfileTitle = savedProfileTitle || (isVeteranProfile ? '베테랑 숙련자' : '안전제일 뉴비')
  const homeScheduleCards = useMemo(() => {
    return createHomeScheduleCards()
  }, [scheduleRevision])

  useEffect(() => {
    const videoElement = cameraVideoRef.current
    if (!videoElement || !cameraStream) return undefined

    videoElement.srcObject = cameraStream
    void videoElement.play()

    return () => {
      videoElement.srcObject = null
    }
  }, [cameraStream])

  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((track) => track.stop())
    }
  }, [cameraStream])

  useEffect(() => {
    const refreshSchedules = () => {
      setScheduleRevision((revision) => revision + 1)
    }

    window.addEventListener('focus', refreshSchedules)
    window.addEventListener('storage', refreshSchedules)
    window.addEventListener('pageshow', refreshSchedules)

    return () => {
      window.removeEventListener('focus', refreshSchedules)
      window.removeEventListener('storage', refreshSchedules)
      window.removeEventListener('pageshow', refreshSchedules)
    }
  }, [])

  useEffect(() => {
    const scrollElement = teamScrollRef.current
    if (!scrollElement) return undefined

    let frameId = 0
    let previousTime = performance.now()
    let virtualScrollLeft = scrollElement.scrollLeft
    const speed = 14

    const animate = (time: number) => {
      const deltaSeconds = (time - previousTime) / 1000
      previousTime = time

      const loopWidth = scrollElement.scrollWidth / 2

      if (!isTeamAutoPausedRef.current && loopWidth > 0) {
        virtualScrollLeft += speed * deltaSeconds

        if (virtualScrollLeft >= loopWidth) {
          virtualScrollLeft -= loopWidth
        }

        scrollElement.scrollLeft = virtualScrollLeft
      } else {
        virtualScrollLeft = scrollElement.scrollLeft
      }

      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameId)

      if (teamAutoResumeTimerRef.current) {
        window.clearTimeout(teamAutoResumeTimerRef.current)
      }
    }
  }, [])

  const pauseTeamAutoScroll = () => {
    isTeamAutoPausedRef.current = true

    if (teamAutoResumeTimerRef.current) {
      window.clearTimeout(teamAutoResumeTimerRef.current)
      teamAutoResumeTimerRef.current = null
    }
  }

  const resumeTeamAutoScrollSoon = () => {
    if (teamAutoResumeTimerRef.current) {
      window.clearTimeout(teamAutoResumeTimerRef.current)
    }

    teamAutoResumeTimerRef.current = window.setTimeout(() => {
      isTeamAutoPausedRef.current = false
      teamAutoResumeTimerRef.current = null
    }, 900)
  }

  const updateProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return

      setProfilePreview(reader.result)
      try {
        localStorage.setItem(HOME_PROFILE_IMAGE_KEY, reader.result)
      } catch {
        localStorage.removeItem(HOME_PROFILE_IMAGE_KEY)
      }
      setIsProfileSheetOpen(false)
      setCameraError('')
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const closeProfileCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop())
    setCameraStream(null)
    setIsCameraOpen(false)
  }

  const openProfileCamera = async () => {
    setCameraError('')

    if (!navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click()
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      })
      setCameraStream(stream)
      setIsProfileSheetOpen(false)
      setIsCameraOpen(true)
    } catch {
      setCameraError('카메라 권한을 확인해주세요.')
      cameraInputRef.current?.click()
    }
  }

  const captureProfilePhoto = () => {
    const video = cameraVideoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError('카메라 화면을 불러오는 중이에요.')
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) return

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const nextPreview = canvas.toDataURL('image/jpeg', 0.9)
    setProfilePreview(nextPreview)
    try {
      localStorage.setItem(HOME_PROFILE_IMAGE_KEY, nextPreview)
    } catch {
      localStorage.removeItem(HOME_PROFILE_IMAGE_KEY)
    }
    closeProfileCamera()
  }

  const openBuddyProcessSheet = () => {
    setIsBuddySheetClosing(false)
    setIsBuddySheetOpen(true)
  }

  const closeBuddyProcessSheet = () => {
    if (isBuddySheetClosing) return

    setIsBuddySheetClosing(true)
    window.setTimeout(() => {
      setIsBuddySheetOpen(false)
      setIsBuddySheetClosing(false)
    }, BUDDY_SHEET_CLOSE_DURATION)
  }

  return (
    <div className="home_page">
      <PageHeader className="home_page_header" layout="standard" hideLeft />
      <section className="home_main">
        {/* ① 히어로 섹션 */}
        <section className="home_hero" style={{ backgroundImage: `url(${heroImg})` }}>
          <div className="home_hero_inner">
            <div className="home_hero_tit">
              <div className="home_hero_tag_row">
                <MainTag className="home_hero_tag">MVP 투표중</MainTag>
              </div>
              <div className="home_hero_txt">
                <p className="home_hero_title">승부를 바꾼 플레이,<br />당신의 선택은?</p>
                <span className="home_hero_pagination">1 / 4</span>
              </div>
            </div>
          </div>
        </section>

        {/* ② 사용자 정보 + 경기 일정 */}
        <div className="home_userinfo_bg">
          <section className="home_userinfo">
            <div className="home_userinfo_summary">
              <div className="home_userinfo_profile">
                <div className="home_userinfo_pic_wrap">
                  <img src={profilePreview} alt="프로필" className="home_userinfo_pic" />
                  <button
                    className="home_userinfo_pic_badge"
                    type="button"
                    aria-label="프로필 사진 변경"
                    onClick={() => setIsProfileSheetOpen(true)}
                  >
                    <img src={mainProfileIcon} alt="" className="home_userinfo_pic_badge_icon" />
                  </button>
                </div>
                <div className="home_userinfo_tit">
                  <div className="home_userinfo_icons">
                    <div className="home_userinfo_user_icon">
                      <img src={homeProfileBadge} alt="" className="home_userinfo_symbol" />
                      <span className="body_m_14">{homeProfileTitle}</span>
                    </div>
                    <button
                      className="home_userinfo_settings"
                      type="button"
                      aria-label="마이페이지로 이동"
                      onClick={() => navigate('/my')}
                    >
                      <img src={settingsIcon} alt="" className="home_userinfo_settings_icon" />
                    </button>
                  </div>
                  <p className="home_userinfo_name">
                    <span className="home_userinfo_name_user">{savedNickname || '삼삼오오'}</span>
                    <span className="home_userinfo_name_suffix">님</span>
                    <br />
                    <span className="home_userinfo_greeting body_m_16">오늘도 안전한 슈팅 하세요!</span>
                  </p>
                </div>
              </div>

              <div className="home_userinfo_badge">
                <div className="home_userinfo_badge_top">
                  <img src={mainStarIcon} alt="" className="home_userinfo_badge_icon" />
                  <p className="home_userinfo_badge_title body_sb_16">보유 뱃지</p>
                </div>
                <div className="home_userinfo_tag_row">
                  <div className="home_userinfo_category_group">
                    <div className="home_userinfo_category_tags">
                      {visibleAchievementBadges.map((badge) => (
                        <CategoryTag
                          key={badge.label}
                          className="home_userinfo_category_tag body_m_14"
                          style={{
                            ...homeAchievementTagStyle,
                            background: badge.background,
                            color: badge.color,
                          }}
                        >
                          <img src={badge.icon} alt="" className="home_userinfo_category_icon" />
                          <span>{badge.label}</span>
                        </CategoryTag>
                      ))}
                    </div>
                    <div className={`home_userinfo_hidden_badges${isAchievementExpanded ? ' is_expanded' : ''}`}>
                      <div className="home_userinfo_hidden_badges_inner">
                        {hiddenAchievementBadges.map((badge, index) => (
                          <CategoryTag
                            key={badge.label}
                            className="home_userinfo_category_tag body_m_14"
                            style={{
                              ...homeAchievementTagStyle,
                              background: badge.background,
                              color: badge.color,
                              '--home-badge-index': index,
                            } as CSSProperties}
                          >
                            <img src={badge.icon} alt="" className="home_userinfo_category_icon" />
                            <span>{badge.label}</span>
                          </CategoryTag>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    className={`home_userinfo_category_more body_m_14${isAchievementExpanded ? ' is_expanded' : ''}`}
                    type="button"
                    onClick={() => setIsAchievementExpanded((current) => !current)}
                    aria-label={isAchievementExpanded ? '보유 뱃지 접기' : '숨겨진 보유 뱃지 5개 더 보기'}
                    aria-expanded={isAchievementExpanded}
                  >
                    <img
                      src={isAchievementExpanded ? arrowUpIcon : arrowDownIcon}
                      alt=""
                      className="home_userinfo_category_more_icon"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <Link
                to="/match"
                state={{ scrollTo: 'ai-recommend' }}
                className="home_ai_recommend_card"
                style={
                  {
                    '--home-ai-bg': `url(${mainAiBg})`,
                  } as CSSProperties
                }
                aria-label="AI 추천 매치 보러가기"
              >
                <img src={mainAiImg} alt="" className="home_ai_recommend_image" aria-hidden="true" />
                <div className="home_ai_recommend_textbox">
                  <span className="home_ai_recommend_tag">AI 추천</span>
                  <p className="home_ai_recommend_title">
                    하남시 몬드필드
                    <br />
                    주말 정기전
                  </p>
                </div>
                <div className="home_ai_recommend_match_rate" aria-label="매칭률 87%">
                  <span className="home_ai_recommend_match_label">매칭률</span>
                  <strong>87%</strong>
                </div>
              </Link>
            </div>

            <div className="home_userinfo_match">
              <div className="home_userinfo_match_header">
                <h2 className="home_userinfo_match_title">내 경기 일정</h2>
                <Link className="home_more_link" to="/my/schedule" state={{ from: '/home' }} aria-label="내 경기 일정 더보기">
                  <More />
                </Link>
              </div>
              <div className="home_match_scroll" {...matchDragScroll}>
                {homeScheduleCards.map((card) => (
                  <article key={card.id} className="home_match_card" style={{ backgroundImage: `url(${card.img})` }}>
                    <div className="home_match_card_top">
                      <MainTag className="home_match_dday_tag">{card.dday}</MainTag>
                      <p className="home_match_card_notice">{card.notice}</p>
                    </div>
                    <div className="home_match_card_txt">
                      <p className="home_match_card_place">{card.place}</p>
                      <p className="home_match_card_datetime">{card.datetime}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="banner">
        <div className="buddy">
          <div className="buddy_top">
            <div className="buddy_visual" aria-hidden="true">
              <img src={mainBuddy01} alt="" className="buddy_main_img" />
            </div>
            <div className="buddy_text">
              <div className="buddy_tit">
                <p className="buddy_title body_sb_14">나의 필드 버디</p>
                <KeywordTag className="buddy_status_tag" style={{ padding: '2px 5px' }}>
                  <img src={mainBuddyClockIcon} alt="" className="buddy_status_icon" />
                  <span>매칭 전</span>
                </KeywordTag>
              </div>
              <div className="buddy_info">
                <p className="buddy_info_title">
                  첫 게임이 걱정된다면
                  <br />
                  함께할 버디를 연결해드려요
                </p>
                <p className="buddy_info_desc">
                  예약 시 버디 필요를 체크하면
                  <br />
                  함께할 버디를 연결해드려요
                </p>
              </div>
            </div>
          </div>

          <div className="buddy_bottom">
            <div className="buddy_con">
              {buddyItems.map((item) => (
                <div key={item.id} className="buddy_item">
                  <img src={item.image} alt="" className="buddy_item_img" />
                  <div className="buddy_item_text">
                    <p className="buddy_item_title body_sb_14">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="buddy_cta">
              <LoginButton
                className="buddy_button"
                style={{
                  background: 'var(--color-khaki)',
                  backgroundColor: 'var(--color-khaki)',
                  color: '#fff',
                  WebkitTextFillColor: '#fff',
                }}
                onClick={() => navigate('/buddy')}
              >
                <span className="body_b_18">버디 찾기</span>
              </LoginButton>
              <button className="buddy_process" type="button" onClick={openBuddyProcessSheet}>
                <span className="body_sb_14">어떻게 진행되나요?</span>
                <img src={arrowR} alt="" className="buddy_process_icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="banner_bottom">
          <Link className="left safety_tutorial_card" to="/guide/quiz" aria-label="에어소프트 건 안전 튜토리얼 시작하기">
            <div className="bottom_text_group">
              <p className="bottom_label">에어소프트 건 안전 튜토리얼</p>
              <p className="bottom_title">
                <span className="bottom_title_semibold">안전한 슈팅의</span> 첫 걸음
              </p>
            </div>
            <KeywordTag className="bottom_quiz_tag" style={{ padding: '5px 8px' }}>
              <span>퀴즈 풀기</span>
              <img src={mainQuizRIcon} alt="" className="bottom_quiz_tag_icon" aria-hidden="true" />
            </KeywordTag>
            <img src={mainQuizImg} alt="" className="bottom_quiz_img" aria-hidden="true" />
          </Link>
          <div className="right">
            <div className="right_title_group">
              <p className="right_brand">GUNIT</p>
              <p className="right_title">인기 질문&amp;팁</p>
            </div>
            <div className="right_tag_group">
              <p>#뉴비필독</p>
              <p>#AI가_답변완료</p>
            </div>
            <img src={mainQnaImg} alt="" className="right_img" aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="bottom">
        {/* ⑤ 팀 추천 섹션 */}
        <section className="home_team">
          <div className="home_team_content_box">
            <div className="home_team_header">
              <h2 className="home_team_title">
                <span className="home_team_title_user sub_kr">AI 맞춤 추천 팀</span>
              </h2>
            </div>
            <div className="home_team_con">
              <div
                className="home_team_scroll"
                ref={teamScrollRef}
                {...teamDragScroll}
                onPointerDown={(event) => {
                  pauseTeamAutoScroll()
                  teamDragScroll.onPointerDown(event)
                }}
                onPointerUp={(event) => {
                  teamDragScroll.onPointerUp(event)
                  resumeTeamAutoScrollSoon()
                }}
                onPointerCancel={(event) => {
                  teamDragScroll.onPointerCancel(event)
                  resumeTeamAutoScrollSoon()
                }}
                onPointerLeave={(event) => {
                  teamDragScroll.onPointerLeave(event)
                  resumeTeamAutoScrollSoon()
                }}
              >
                {[...teamCards, ...teamCards].map((team, index) => (
                  <article key={`${team.id}-${index}`} className="home_team_card" aria-hidden={index >= teamCards.length}>
                    <div className="home_team_card_logo">
                      <img src={team.logo} alt="" className="home_team_card_logo_img" draggable={false} />
                    </div>
                    <p className="home_team_card_name">{team.name}</p>
                    <p className="home_team_card_region">{team.region}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ⑥ 오바워치 배너 */}
        <section className="home_banner" {...bannerDragScroll}>
          <Link className="home_banner_inner" to="/guide/quiz">
            <div className="home_banner_txt">
              <p className="home_banner_label">건잇 x 오버워치</p>
              <h3 className="home_banner_title">초보자 퀴즈 풀고<br /><span className="home_banner_title_accent">오버워치 스킨</span> 받자!</h3>
            </div>
            <p className="home_banner_pg_nav">1&nbsp;&nbsp;/&nbsp;&nbsp;2</p>
          </Link>
          <Link className="home_banner_inner home_banner_inner_second" to="/guide/quiz">
            <div className="home_banner_txt">
              <p className="home_banner_label">건잇 x 오버워치</p>
              <h3 className="home_banner_title">초보자 퀴즈 풀고<br /><span className="home_banner_title_accent">오버워치 스킨</span> 받자!</h3>
            </div>
            <p className="home_banner_pg_nav">2&nbsp;&nbsp;/&nbsp;&nbsp;2</p>
          </Link>
        </section>

        {/* ⑦ 토너먼트 섹션 */}
        <section className="home_tournament">
          <h2 className="home_tournament_title">NEXT<br />TOURNAMENT</h2>
          <div className="home_tournament_team_info">
            {tournamentCards.map((tc) => (
              <Link key={tc.id} to="/tournament" className="home_tournament_team">
                <div className="home_tournament_left">
                  <div className="home_tournament_team_logo">
                    <img src={tc.logo} alt="" className="home_tournament_team_logo_img" />
                  </div>
                  <div className="home_tournament_team_text">
                    <p className="home_tournament_team_name">{tc.name}</p>
                    <p className="home_tournament_team_region">{tc.region}</p>
                  </div>
                </div>
                <div className="home_tournament_state">
                  <div className="home_tournament_stat">
                    <span className="home_tournament_stat_label">ATK</span>
                    <span className="home_tournament_stat_value">{tc.stats.atk}</span>
                  </div>
                  <div className="home_tournament_stat">
                    <span className="home_tournament_stat_label">DEF</span>
                    <span className="home_tournament_stat_value">{tc.stats.def}</span>
                  </div>
                  <div className="home_tournament_stat">
                    <span className="home_tournament_stat_label">TAC</span>
                    <span className="home_tournament_stat_value">{tc.stats.tac}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="home_tournament_join_button_wrap">
            <LoginButton
              className="home_tournament_join_button"
              onClick={() => navigate('/tournament')}
            >
              <span className="body_m_16">토너먼트 입장</span>
            </LoginButton>
          </div>
        </section>
      </div>
      <input
        ref={cameraInputRef}
        className="home_profile_file_input"
        type="file"
        accept="image/*"
        capture="user"
        onChange={updateProfileImage}
      />
      <input
        ref={albumInputRef}
        className="home_profile_file_input"
        type="file"
        accept="image/*"
        onChange={updateProfileImage}
      />
      {isProfileSheetOpen ? (
        <div className="home_profile_sheet_layer" role="presentation">
          <button
            className="home_profile_sheet_backdrop"
            type="button"
            aria-label="프로필 사진 변경 닫기"
            onClick={() => setIsProfileSheetOpen(false)}
          />
          <section className="home_profile_sheet" role="dialog" aria-modal="true" aria-labelledby="home_profile_sheet_title">
            <div className="home_profile_sheet_handle" aria-hidden="true" />
            <h2 id="home_profile_sheet_title">프로필 사진 변경</h2>
            <div className="home_profile_sheet_actions">
              <button
                className="home_profile_sheet_action"
                type="button"
                onClick={openProfileCamera}
              >
                카메라로 촬영
              </button>
              <button
                className="home_profile_sheet_action"
                type="button"
                onClick={() => albumInputRef.current?.click()}
              >
                앨범에서 선택
              </button>
            </div>
            <button
              className="home_profile_sheet_cancel"
              type="button"
              onClick={() => setIsProfileSheetOpen(false)}
            >
              취소
            </button>
          </section>
        </div>
      ) : null}
      {isCameraOpen ? (
        <div className="home_camera_layer" role="presentation">
          <div className="home_camera_backdrop" aria-hidden="true" />
          <section className="home_camera_sheet" role="dialog" aria-modal="true" aria-label="프로필 사진 촬영">
            <div className="home_camera_preview">
              <video
                ref={cameraVideoRef}
                className="home_camera_video"
                autoPlay
                muted
                playsInline
              />
            </div>
            {cameraError ? <p className="home_camera_error">{cameraError}</p> : null}
            <div className="home_camera_actions">
              <button className="home_camera_button home_camera_button--capture" type="button" onClick={captureProfilePhoto}>
                촬영
              </button>
              <button className="home_camera_button" type="button" onClick={closeProfileCamera}>
                취소
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {isBuddySheetOpen ? (
        <div
          className={`buddy_process_sheet_layer${isBuddySheetClosing ? ' is_closing' : ''}`}
          role="presentation"
        >
          <button
            className="buddy_process_sheet_backdrop"
            type="button"
            aria-label="버디 진행 안내 닫기"
            onClick={closeBuddyProcessSheet}
          />
          <section
            className="buddy_process_sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="buddy_process_sheet_title"
          >
            <div className="buddy_process_sheet_handle" aria-hidden="true" />
            <div className="buddy_process_sheet_titlebox">
              <h2 id="buddy_process_sheet_title">버디찾기, 이렇게 진행돼요</h2>
              <p>
                다가올 일정에서 버디 필요를 체크하면,
                <br />
                같은 게임 참여자 중 함께할 버디를 연결해드려요.
              </p>
            </div>
            <div className="buddy_process_sheet_grid">
              {buddyProcessSteps.map((step) => (
                <article key={step.id} className="buddy_process_step_card">
                  <img src={step.icon} alt="" className="buddy_process_step_icon" />
                  <div className="buddy_process_step_text">
                    <p className="buddy_process_step_title">
                      <span>{String(step.id).padStart(2, '0')}</span>
                      <span>{step.title}</span>
                    </p>
                    <p className="buddy_process_step_desc">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="buddy_process_sheet_notice">
              <img src={buddyInfoIcon} alt="" />
              <span>버디는 같은 게임 참여자끼리만 연결돼요.</span>
            </p>
            <LoginButton className="buddy_process_sheet_start" onClick={() => navigate('/buddy')}>
              버디 찾기
            </LoginButton>
          </section>
        </div>
      ) : null}
    </div>
  )
}
