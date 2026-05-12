import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import KeywordTag from '../../components/KeywordTag'
import More from '../../components/More'
import arrowLeftIcon from '../../asset/icons/arrow_l.svg'
import arrowRightIcon from '../../asset/icons/arrow_r.svg'
import matchPencilIcon from '../../asset/icons/match_pencil.svg'
import quickBookmarkIcon from '../../asset/icons/my_quick_bookmark.svg'
import quickHandIcon from '../../asset/icons/my_quick_hand.svg'
import quickTeamIcon from '../../asset/icons/my_quick_team.svg'
import quickWriteIcon from '../../asset/icons/my_quick_write.svg'
import myMatchThumbImage from '../../asset/images/my_match_img01.png'
import profileImage from '../../asset/images/main_user01.png'
import symbolBeginner from '../../asset/images/symbol_beginner.png'
import './my.css'

type MatchTab = 'waiting' | 'confirmed' | 'past'
type QuickMenuIconKind = 'team' | 'buddy' | 'posts' | 'saved'

type MatchCard = {
  id: string
  title: string
  detail: string
  tagLabel: string
  to: string
}

type QuickMenuItem = {
  label: string
  to: string
  icon: QuickMenuIconKind
}

type MenuItem = {
  label: string
  to: string
}

const matchTabs: Array<{ key: MatchTab; label: string }> = [
  { key: 'waiting', label: '대기 중' },
  { key: 'confirmed', label: '확정' },
  { key: 'past', label: '지난 매치' },
]

const matchCardsByTab: Record<MatchTab, MatchCard[]> = {
  waiting: [
    {
      id: 'waiting-1',
      title: '초보 환영 야외전',
      detail: '5/23 (토) 13:00 I 택티컬 필드',
      tagLabel: 'D-14',
      to: '/match/match-001',
    },
    {
      id: 'waiting-2',
      title: '서울 CQB 입문 경기',
      detail: '5/31 (일) 12:00 I 어반 CQB',
      tagLabel: 'D-22',
      to: '/match/match-003',
    },
  ],
  confirmed: [
    {
      id: 'confirmed-1',
      title: '초보 환영 야외전',
      detail: '5/23 (토) 13:00 I 택티컬 필드',
      tagLabel: 'D-14',
      to: '/match/match-001',
    },
  ],
  past: [
    {
      id: 'past-1',
      title: '2026 5월 입문자 경기',
      detail: '5/2 (토) 10:00 I 하남 실내 필드',
      tagLabel: '종료',
      to: '/my/schedule',
    },
  ],
}

const quickMenuItems: QuickMenuItem[] = [
  { label: '내 소속 팀', to: '/team/team-001', icon: 'team' },
  { label: '버디 매칭', to: '/home', icon: 'buddy' },
  { label: '내가 쓴 글', to: '/my/posts', icon: 'posts' },
  { label: '저장한 글', to: '/community/free', icon: 'saved' },
]

const quickIconMap: Record<QuickMenuIconKind, { src: string; className: string }> = {
  team: { src: quickTeamIcon, className: 'my_quick_icon my_quick_icon_team' },
  buddy: { src: quickHandIcon, className: 'my_quick_icon my_quick_icon_buddy' },
  posts: { src: quickWriteIcon, className: 'my_quick_icon my_quick_icon_write' },
  saved: { src: quickBookmarkIcon, className: 'my_quick_icon my_quick_icon_bookmark' },
}

const teamManagementItems: MenuItem[] = [
  { label: '내 소속 팀', to: '/team/team-001' },
  { label: '내가 생성한 팀', to: '/team/create' },
  { label: '버디 매칭', to: '/home' },
]

const communityItems: MenuItem[] = [
  { label: '내가 쓴 글', to: '/my/posts' },
  { label: '내가 남긴 질문', to: '/community/beginner/recent' },
  { label: '저장한 글', to: '/community/free' },
]

const settingsItems: MenuItem[] = [
  { label: '알림 설정', to: '/my/notifications' },
  { label: '개인정보 및 보안', to: '/my/profile' },
  { label: '고객센터', to: '/chat' },
]

const profileStats = [
  { label: '활동배지', value: '12개' },
  { label: '받은 후기', value: '38개' },
  { label: '작성한 글', value: '56개' },
]

const moreActionStyle = {
  gap: 4,
  color: '#9f9f9f',
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '130%',
  letterSpacing: '-0.02em',
} as const

function resolveProfileName(savedNickname: string | null) {
  const trimmedNickname = savedNickname?.trim()

  if (!trimmedNickname || trimmedNickname === '에어소프트 루키' || trimmedNickname === '삼삼오오 유저') {
    return '삼삼오오'
  }

  return trimmedNickname
}

function BellIcon() {
  return (
    <svg aria-hidden="true" className="my_bell_icon" viewBox="0 0 17 19" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.5 1.2a4.8 4.8 0 0 0-4.8 4.8v2.2c0 .8-.3 1.5-.8 2.1L1.7 12c-.5.6-.2 1.6.6 1.6h12.4c.8 0 1.1-1 .6-1.6L14 10.3a3.2 3.2 0 0 1-.8-2.1V6A4.8 4.8 0 0 0 8.5 1.2Zm0 16.3a2.3 2.3 0 0 0 2.1-1.4H6.4a2.3 2.3 0 0 0 2.1 1.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PointIcon() {
  return (
    <span aria-hidden="true" className="my_point_icon">
      P
    </span>
  )
}

function QuickMenuIcon({ kind }: { kind: QuickMenuIconKind }) {
  const { src, className } = quickIconMap[kind]
  return <img aria-hidden="true" className={className} src={src} alt="" />
}

function QuickMenuLink({ item }: { item: QuickMenuItem }) {
  return (
    <Link className="my_quick_link" to={item.to}>
      <span className="my_quick_link_left">
        <QuickMenuIcon kind={item.icon} />
        <span className="my_quick_link_label">{item.label}</span>
      </span>
      <img alt="" aria-hidden="true" className="my_quick_link_arrow" src={arrowRightIcon} />
    </Link>
  )
}

function ListSection({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <section className="my_list_section">
      <div className="my_list_section_heading">
        <h2 className="my_section_title">{title}</h2>
      </div>
      <div className="my_list_items">
        {items.map((item) => (
          <Link className="my_list_item" key={item.label} to={item.to}>
            <span className="my_list_item_label">{item.label}</span>
            <span className="my_list_item_arrow_wrap" aria-hidden="true">
              <img alt="" className="my_list_item_arrow" src={arrowRightIcon} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="my_profile_stat">
      <p className="my_profile_stat_label">{label}</p>
      <p className="my_profile_stat_value">{value}</p>
    </div>
  )
}

function MatchCardLink({ match }: { match: MatchCard }) {
  return (
    <Link className="my_match_card" to={match.to}>
      <div className="my_match_thumb" aria-hidden="true">
        <img className="my_match_thumb_image" src={myMatchThumbImage} alt="" />
      </div>
      <div className="my_match_info">
        <div className="my_match_title_row">
          <KeywordTag className="my_match_tag">{match.tagLabel}</KeywordTag>
          <p className="my_match_title">{match.title}</p>
        </div>
        <p className="my_match_meta">{match.detail}</p>
      </div>
    </Link>
  )
}

function LoginRequired({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="page">
      <section className="card">
        <h1>로그인이 필요한 메뉴예요</h1>
        <button className="button primary_button" type="button" onClick={onLogin}>
          로그인하기
        </button>
      </section>
    </div>
  )
}

function MyPageHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="my_header my_section_shell">
      <div className="my_header_left">
        <button className="my_header_button" type="button" aria-label="뒤로가기" onClick={onBack}>
          <img alt="" aria-hidden="true" className="my_back_icon" src={arrowLeftIcon} />
        </button>
        <h1 className="my_page_title">마이페이지</h1>
      </div>
      <Link className="my_header_button my_bell_button" to="/notifications" aria-label="알림">
        <BellIcon />
      </Link>
    </header>
  )
}

function LogoutModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="my_logout_modal_backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-logout-title"
      aria-describedby="my-logout-description"
      onClick={onCancel}
    >
      <div className="my_logout_modal" onClick={(event) => event.stopPropagation()}>
        <h2 id="my-logout-title">로그아웃 하시겠습니까?</h2>
        <p id="my-logout-description">
          현재 계정에서 로그아웃하고
          <br />
          온보딩 첫 화면으로 이동합니다
        </p>
        <div className="my_logout_modal_actions">
          <button
            className="my_logout_modal_button my_logout_modal_button_secondary"
            type="button"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="my_logout_modal_button my_logout_modal_button_primary"
            type="button"
            onClick={onConfirm}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileInfo({
  name,
  statusLabel,
  rightSlot,
  pointLinkTo,
}: {
  name: string
  statusLabel: string
  rightSlot: ReactNode
  pointLinkTo?: string
}) {
  const pointsSlot = pointLinkTo ? (
    <Link className="my_profile_points my_profile_points_link" to={pointLinkTo}>
      {rightSlot}
    </Link>
  ) : (
    <div className="my_profile_points">{rightSlot}</div>
  )

  return (
    <section className="my_profile_section my_section_shell">
      <div className="my_profile_card">
        <div className="my_profile_top">
          <div className="my_profile_identity">
            <div className="my_profile_avatar_wrap">
              <img className="my_profile_avatar" src={profileImage} alt={`${name} 프로필`} />
              <button className="my_profile_edit" type="button" aria-label="프로필 이미지 변경">
                <img className="my_profile_edit_icon" src={matchPencilIcon} alt="" aria-hidden="true" />
              </button>
            </div>

            <div className="my_profile_text">
              <div className="my_profile_status">
                <img className="my_profile_status_icon" src={symbolBeginner} alt="" aria-hidden="true" />
                <span>{statusLabel}</span>
              </div>
              <p className="my_profile_name">
                <span>{name}</span>
                <span className="my_profile_suffix">님</span>
              </p>
            </div>
          </div>

          {pointsSlot}
        </div>

        <div className="my_profile_stats">
          {profileStats.map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 && <div className="my_profile_stat_divider" aria-hidden="true" />}
              <ProfileStat label={stat.label} value={stat.value} />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export function MyPage() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true')
  const [matchTab, setMatchTab] = useState<MatchTab>('waiting')
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const savedNickname = localStorage.getItem('nickname')
  const profileName = resolveProfileName(savedNickname)
  const profileStatusLabel = localStorage.getItem('skillAlias')?.trim() || '안전제일 뉴비'
  const visibleMatches = matchCardsByTab[matchTab]

  useEffect(() => {
    if (!logoutModalOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLogoutModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [logoutModalOpen])

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/home')
  }

  const confirmLogout = () => {
    const keysToClear = [
      'nickname',
      'email',
      'region',
      'level',
      'skillAlias',
      'homePreset',
      'rememberLogin',
      'isLoggedIn',
    ]

    keysToClear.forEach((key) => localStorage.removeItem(key))
    setLoggedIn(false)
    setLogoutModalOpen(false)
    navigate('/onboarding', { replace: true })
  }

  if (!loggedIn) {
    return <LoginRequired onLogin={() => navigate('/login')} />
  }

  return (
    <div className="my_page">
      <MyPageHeader onBack={goBack} />

      <ProfileInfo
        name={profileName}
        statusLabel={profileStatusLabel}
        pointLinkTo="/my/point-shop"
        rightSlot={
          <>
            <PointIcon />
            <span className="my_profile_points_value">2,450P</span>
            <img alt="" aria-hidden="true" className="my_profile_points_arrow" src={arrowRightIcon} />
          </>
        }
      />

      <section className="my_matches_section my_section_shell">
        <div className="my_matches_heading">
          <h2 className="my_section_title">내 매치</h2>
          <More
            ariaLabel="내 매치 더보기"
            className="my_matches_more"
            style={moreActionStyle}
            to="/my/matches"
          />
        </div>

        <div className="my_match_tabs" role="tablist" aria-label="내 매치 상태 탭">
          {matchTabs.map((tab) => (
            <button
              key={tab.key}
              className={`my_match_tab${matchTab === tab.key ? ' is_active' : ''}`}
              type="button"
              role="tab"
              aria-selected={matchTab === tab.key}
              onClick={() => setMatchTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="my_match_cards">
          {visibleMatches.map((match) => (
            <MatchCardLink key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section className="my_quick_section my_section_shell">
        <h2 className="my_section_title">퀵 메뉴</h2>
        <div className="my_quick_grid">
          {quickMenuItems.map((item) => (
            <QuickMenuLink key={item.label} item={item} />
          ))}
        </div>
      </section>

      <div className="my_list_group my_section_shell">
        <ListSection title="팀 관리" items={teamManagementItems} />
      </div>
      <div className="my_list_divider" aria-hidden="true" />
      <div className="my_list_group my_section_shell">
        <ListSection title="커뮤니티 활동" items={communityItems} />
      </div>
      <div className="my_list_divider" aria-hidden="true" />
      <div className="my_list_group my_section_shell">
        <ListSection title="설정" items={settingsItems} />
      </div>

      <div className="my_logout_section my_section_shell">
        <button className="my_logout_button" type="button" onClick={() => setLogoutModalOpen(true)}>
          로그아웃
        </button>
      </div>

      {logoutModalOpen ? (
        <LogoutModal onCancel={() => setLogoutModalOpen(false)} onConfirm={confirmLogout} />
      ) : null}
    </div>
  )
}
