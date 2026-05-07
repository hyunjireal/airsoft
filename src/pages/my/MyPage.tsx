import { useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import badge01 from '../../asset/images/badge01.png'
import iconUser from '../../asset/icons/com_user.svg'
import iconSettings from '../../asset/icons/settings.svg'
import iconMatch from '../../asset/icons/header_match.svg'
import iconWrite from '../../asset/icons/com_write.svg'
import iconQna from '../../asset/icons/com_qna.svg'
import iconBookmark from '../../asset/icons/com_bookmark.svg'
import { currentUser } from '../../data/mockData'
import './my.css'

type MatchTab = '다가오는 매치' | '지난 매치'

const upcomingMatches = [
  { id: 'u1', title: '초보 환영 야외전', date: '5/10 (토) 14:00', place: '택티컬 필드', dday: 'D-3', route: '/match/match-001' },
  { id: 'u2', title: '서울 CQB 입문 스크림', date: '5/11 (일) 12:00', place: '어반 CQB', dday: 'D-4', route: '/match/match-003' },
]

const pastMatches = [
  { id: 'p1', title: '지난 입문자 스크림', date: '5/4 (일) 10:00', place: '하남 실내 필드', route: '/my/schedule' },
]

const settingsItems: { label: string; to: string }[] = [
  { label: '계정 설정', to: '#' },
  { label: '알림 설정', to: '/my/notifications' },
  { label: '개인정보 및 보안', to: '#' },
  { label: '고객센터', to: '#' },
]

export function MyPage() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true')
  const [matchTab, setMatchTab] = useState<MatchTab>('다가오는 매치')

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

      {/* 헤더 */}
      <div className="my_header">
        <h1 className="my_page_title">마이페이지</h1>
        <Link to="/notifications" className="my_bell_btn" aria-label="알림">🔔</Link>
      </div>

      {/* 프로필 카드 */}
      <section className="card my_profile_card">
        <div className="my_profile_row">
          <div className="my_avatar">
            <span className="my_icon" style={{ '--my-icon': `url(${iconUser})` } as CSSProperties} />
          </div>
          <div className="my_profile_info">
            <div className="my_name_row">
              <span className="my_nickname">{currentUser.nickname}</span>
              <img className="my_badge_icon" src={badge01} alt="뱃지" />
            </div>
            <p className="muted my_region">활동지역 • 서울·마포구</p>
            <div className="chip_row">
              <span className="chip">#에어소프트</span>
              <span className="chip">#야외전</span>
              <span className="chip">#입문자</span>
            </div>
          </div>
          <Link className="my_edit_btn" to="/my/profile">수정</Link>
        </div>
      </section>

      {/* 빠른 메뉴 */}
      <section className="card my_quick_menu">
        <Link className="my_quick_item" to="/my/profile">
          <span className="my_icon" style={{ '--my-icon': `url(${iconUser})` } as CSSProperties} />
          <span className="my_quick_label">프로필 수정</span>
        </Link>
        <span className="my_vdivider" aria-hidden="true" />
        <Link className="my_quick_item" to="#">
          <span className="my_pin_icon" aria-hidden="true" />
          <span className="my_quick_label">활동지역</span>
        </Link>
        <span className="my_vdivider" aria-hidden="true" />
        <Link className="my_quick_item" to="/my/notifications">
          <span className="my_icon" style={{ '--my-icon': `url(${iconSettings})` } as CSSProperties} />
          <span className="my_quick_label">알림 설정</span>
        </Link>
      </section>

      {/* 통계 */}
      <section className="card my_stats_row">
        <div className="my_stat_item">
          <span className="my_stat_p">P</span>
          <span className="my_stat_label">포인트</span>
          <strong className="my_stat_value">2,450P</strong>
        </div>
        <span className="my_vdivider" aria-hidden="true" />
        <div className="my_stat_item">
          <img className="my_stat_badge_img" src={badge01} alt="" />
          <span className="my_stat_label">배지</span>
          <strong className="my_stat_value">12개</strong>
        </div>
        <span className="my_vdivider" aria-hidden="true" />
        <div className="my_stat_item">
          <span className="my_icon" style={{ '--my-icon': `url(${iconMatch})` } as CSSProperties} />
          <span className="my_stat_label">참여 매치</span>
          <strong className="my_stat_value">18회</strong>
        </div>
      </section>

      {/* 내 매치 */}
      <section className="my_match_section">
        <div className="my_match_tabs">
          {(['다가오는 매치', '지난 매치'] as MatchTab[]).map((tab) => (
            <button
              key={tab}
              className={`my_match_tab${matchTab === tab ? ' active' : ''}`}
              type="button"
              onClick={() => setMatchTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="my_match_list">
          {matchTab === '다가오는 매치'
            ? upcomingMatches.map((m) => (
                <Link className="my_match_card" key={m.id} to={m.route}>
                  <div className="my_match_thumb" aria-hidden="true" />
                  <div className="my_match_info">
                    <p className="my_match_title">{m.title}</p>
                    <p className="muted my_match_sub">{m.date}</p>
                    <p className="muted my_match_sub">{m.place}</p>
                  </div>
                  <div className="my_match_right">
                    <span className="my_dday">{m.dday}</span>
                    <span className="my_arrow">›</span>
                  </div>
                </Link>
              ))
            : pastMatches.map((m) => (
                <Link className="my_match_card" key={m.id} to={m.route}>
                  <div className="my_match_thumb" aria-hidden="true" />
                  <div className="my_match_info">
                    <span className="chip my_past_chip">지난 매치</span>
                    <p className="my_match_title">{m.title}</p>
                    <p className="muted my_match_sub">{m.date} · {m.place}</p>
                  </div>
                  <span className="my_arrow">›</span>
                </Link>
              ))}
        </div>
      </section>

      {/* 커뮤니티 활동 */}
      <section className="my_community_section">
        <div className="my_comm_header">
          <h2 className="section_title">커뮤니티 활동</h2>
          <Link className="text_button my_see_all" to="/my/posts">전체 보기 ›</Link>
        </div>
        <div className="my_community_grid">
          <Link className="card my_community_item" to="/my/posts">
            <span className="my_icon" style={{ '--my-icon': `url(${iconWrite})` } as CSSProperties} />
            <span className="muted my_comm_label">내가 쓴 글</span>
            <strong className="my_comm_count">7</strong>
          </Link>
          <Link className="card my_community_item" to="#">
            <span className="my_icon" style={{ '--my-icon': `url(${iconQna})` } as CSSProperties} />
            <span className="muted my_comm_label">내 질문</span>
            <strong className="my_comm_count">4</strong>
          </Link>
          <Link className="card my_community_item" to="#">
            <span className="my_icon" style={{ '--my-icon': `url(${iconBookmark})` } as CSSProperties} />
            <span className="muted my_comm_label">저장한 글</span>
            <strong className="my_comm_count">9</strong>
          </Link>
        </div>
      </section>

      {/* 설정 */}
      <section className="card my_settings_section">
        <h2 className="section_title">설정</h2>
        <div className="my_settings_list">
          {settingsItems.map(({ label, to }) => (
            <Link key={label} className="my_settings_item" to={to}>
              <span>{label}</span>
              <span className="my_arrow">›</span>
            </Link>
          ))}
          <button className="my_settings_item my_logout_btn" type="button" onClick={logout}>
            <span>로그아웃</span>
            <span className="my_arrow">›</span>
          </button>
        </div>
      </section>

    </div>
  )
}
