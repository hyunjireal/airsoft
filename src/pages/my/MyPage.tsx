import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import KeywordTag from '../../components/KeywordTag'
import iconArrowLeft from '../../asset/icons/arrow_l.svg'
import iconArrowRight from '../../asset/icons/arrow_r.svg'
import badge03 from '../../asset/images/badge03.png'
import profileImage from '../../asset/images/main_user01.png'
import './my.css'

type MatchTab = '다가오는 매치' | '지난 매치'

type MatchCard = {
  id: string
  title: string
  detail: string
  tagLabel: string
  to: string
}

const upcomingMatches: MatchCard[] = [
  {
    id: 'upcoming-1',
    title: '초보 환영 야외전',
    detail: '5/23 (토) 13:00 택티컬 필드',
    tagLabel: 'D-14',
    to: '/match/match-001',
  },
  {
    id: 'upcoming-2',
    title: '서울 CQB 입문 경기',
    detail: '5/31 (일) 12:00 어반 CQB',
    tagLabel: 'D-22',
    to: '/match/match-003',
  },
]

const pastMatches: MatchCard[] = [
  {
    id: 'past-1',
    title: '2026 5월 입문자 경기',
    detail: '5/2 (일) 10:00 하남 실내 필드',
    tagLabel: '지난 매치',
    to: '/my/schedule',
  },
]

const teamMenuItems = [
  { label: '나의 소속 팀', to: '/team/team-001' },
  { label: '내가 생성한 팀', to: '/team/create' },
  { label: '버디 매칭', to: '/home' },
]

const communityMenuItems = [
  { label: '내가 쓴 글', to: '/my/posts' },
  { label: '내 질문', to: '/community/beginner/recent' },
  { label: '내가 저장한 글', to: '/community/free' },
]

const settingsItems = [
  { label: '계정 설정', to: '/my/profile' },
  { label: '알림 설정', to: '/my/notifications' },
  { label: '개인정보 및 보안', to: '/my/profile' },
  { label: '고객센터', to: '/chat' },
]

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

function CameraIcon() {
  return (
    <svg aria-hidden="true" className="my_camera_icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.3 6.8h1.8l.9-1.4c.3-.5.9-.8 1.5-.8h1c.6 0 1.2.3 1.5.8l.9 1.4h1.8c1.3 0 2.3 1 2.3 2.3v6.8c0 1.3-1 2.3-2.3 2.3H7.3C6 18.2 5 17.2 5 15.9V9.1c0-1.3 1-2.3 2.3-2.3Zm4.7 8.1a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

type MenuSectionProps = {
  title: string
  items: Array<{ label: string; to: string }>
}

function MenuSection({ title, items }: MenuSectionProps) {
  return (
    <section className="my_menu_section">
      <h2 className="my_section_title">{title}</h2>
      <div className="my_section_rule" aria-hidden="true" />
      <div className="my_menu_list">
        {items.map((item) => (
          <Link className="my_menu_item" key={item.label} to={item.to}>
            <span>{item.label}</span>
            <img alt="" aria-hidden="true" className="my_menu_arrow" src={iconArrowRight} />
          </Link>
        ))}
      </div>
    </section>
  )
}

export function MyPage() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true')
  const [matchTab, setMatchTab] = useState<MatchTab>('다가오는 매치')
  const savedNickname = localStorage.getItem('nickname')
  const profileName = !savedNickname || savedNickname === '에어소프트 루키' ? '삼삼오오' : savedNickname
  const visibleMatches = matchTab === '다가오는 매치' ? upcomingMatches : pastMatches

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/home')
  }

  const logout = () => {
    localStorage.removeItem('isLoggedIn')
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return (
      <div className="page">
        <section className="card">
          <h1>로그인이 필요한 메뉴예요</h1>
          <button className="button primary_button" type="button" onClick={() => navigate('/login')}>
            로그인하기
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="page my_page">
      <header className="my_header">
        <div className="my_header_left">
          <button className="my_header_button" type="button" aria-label="뒤로가기" onClick={goBack}>
            <img alt="" aria-hidden="true" className="my_back_icon" src={iconArrowLeft} />
          </button>
          <h1 className="my_page_title">마이페이지</h1>
        </div>
        <Link className="my_header_button my_bell_button" to="/notifications" aria-label="알림">
          <BellIcon />
        </Link>
      </header>

      <section className="my_profile_section">
        <div className="my_profile_card">
          <div className="my_profile_top">
            <div className="my_profile_avatar_wrap">
              <img className="my_profile_avatar" src={profileImage} alt={`${profileName} 프로필`} />
              <button className="my_profile_camera" type="button" aria-label="프로필 이미지 변경">
                <CameraIcon />
              </button>
            </div>
            <p className="my_profile_name">
              <span>{profileName}</span>
              <span className="my_profile_suffix">님</span>
            </p>
          </div>
          <div className="my_profile_divider" aria-hidden="true" />
          <div className="my_profile_stats">
            <div className="my_stat_card">
              <p className="my_stat_value">2,450</p>
              <p className="my_stat_label">포인트</p>
            </div>
            <div className="my_stat_card">
              <p className="my_stat_value">12개</p>
              <p className="my_stat_label">활동 배지</p>
            </div>
          </div>
        </div>
      </section>

      <section className="my_matches_section">
        <div className="my_match_tabs" role="tablist" aria-label="매치 탭">
          {(['다가오는 매치', '지난 매치'] as MatchTab[]).map((tab) => (
            <button
              key={tab}
              className={`my_match_tab${matchTab === tab ? ' active' : ''}`}
              type="button"
              role="tab"
              aria-selected={matchTab === tab}
              onClick={() => setMatchTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="my_match_cards">
          {visibleMatches.map((match) => (
            <Link className="my_match_card" key={match.id} to={match.to}>
              <div className="my_match_thumb" aria-hidden="true">
                <img className="my_match_thumb_image" src={badge03} alt="" />
              </div>
              <div className="my_match_info">
                <KeywordTag className="my_match_tag">{match.tagLabel}</KeywordTag>
                <p className="my_match_title">{match.title}</p>
                <p className="my_match_meta">{match.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <MenuSection title="나의 팀" items={teamMenuItems} />
      <MenuSection title="커뮤니티 활동" items={communityMenuItems} />

      <section className="my_menu_section my_settings_section">
        <h2 className="my_section_title">설정</h2>
        <div className="my_section_rule" aria-hidden="true" />
        <div className="my_menu_list">
          {settingsItems.map((item) => (
            <Link className="my_menu_item" key={item.label} to={item.to}>
              <span>{item.label}</span>
              <img alt="" aria-hidden="true" className="my_menu_arrow" src={iconArrowRight} />
            </Link>
          ))}
          <button className="my_logout_button" type="button" onClick={logout}>
            로그아웃
          </button>
        </div>
      </section>
    </div>
  )
}
