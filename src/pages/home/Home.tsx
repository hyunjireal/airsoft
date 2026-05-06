import { useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import CategoryTag from '../../components/CategoryTag'
import KeywordTag from '../../components/KeywordTag'
import MainTag from '../../components/MainTag'
import More from '../../components/More'
import settingsIcon from '../../asset/icons/settings.svg'
import mainImg from '../../asset/images/main_img01.png'
import heroImg from '../../asset/images/main_img02.png'
import matchImg01 from '../../asset/images/main_img03.jpg'
import matchImg02 from '../../asset/images/main_img04.jpg'
import matchImg03 from '../../asset/images/main_img05.jpg'
import matchImg04 from '../../asset/images/main_img06.jpg'
import userAvatar from '../../asset/images/main_user01.png'
import bannerChar from '../../asset/images/banner_char01.png'
import symbol04 from '../../asset/images/symbol_05.png'
import symbolBeginner from '../../asset/images/symbol_beginner.png'
import mainTeam01 from '../../asset/images/main_team01.png'
import mainTeam02 from '../../asset/images/main_team02.png'
import mainTeamImg01 from '../../asset/images/main_teamImg01.png'
import mainTeamImg02 from '../../asset/images/main_teamImg02.png'
import mainTeamImg03 from '../../asset/images/main_teamImg03.png'
import mainTeamImg04 from '../../asset/images/main_teamImg04.png'
import './Home.css'

const matchCards = [
  {
    id: 1,
    dday: '경기 25일 전',
    notice: '초보자 브리핑과 장비 점검이 함께 진행돼요',
    place: '경기도 하남시 밀리터리 필드',
    datetime: '2026.08.08 오후 06:30',
    img: matchImg01,
  },{
    id: 2,
    dday: '경기 18일 전',
    notice: '친환경 바이오 BB탄 필수 사용 구역',
    place: '경기도 파주시 CQB 아레나',
    datetime: '2026.08.15 오전 10:00',
    img: matchImg02,
  },{
    id: 3,
    dday: '경기 12일 전',
    notice: '팀 밸런스 매칭 후 라운드가 배정돼요',
    place: '서울 강서 실내 필드',
    datetime: '2026.08.21 오후 02:00',
    img: matchImg03,
  },{
    id: 4,
    dday: '경기 5일 전',
    notice: '야간전 참여 전 라이트 규정을 확인해주세요',
    place: '인천 서구 야외 필드',
    datetime: '2026.08.28 오후 07:30',
    img: matchImg04,
  },
  
]

const teamFilters = ['스타터팀', '입문자 환영', '즐겁고 가볍게', '숙련자위주'] as const
type TeamFilter = (typeof teamFilters)[number]

const teamCards = [
  { id: 1, name: '스타터 소대', region: '경기 · 파주권', tags: ['스타터팀', '입문자 환영'], logo: mainTeamImg01 },
  { id: 2, name: '루키 아레나', region: '서울 · 강서권', tags: ['스타터팀', '즐겁고 가볍게'], logo: mainTeamImg02 },
  { id: 3, name: '라이트 스쿼드', region: '경기 · 하남권', tags: ['입문자 환영', '즐겁고 가볍게'], logo: mainTeamImg03 },
  { id: 4, name: '위켄드 크루', region: '인천 · 부평권', tags: ['즐겁고 가볍게'], logo: mainTeamImg04 },
  { id: 5, name: '택티컬 블랙', region: '서울 · CQB', tags: ['숙련자위주'], logo: mainTeamImg01 },
  { id: 6, name: '알파라인', region: '경기 · 북부권', tags: ['숙련자위주'], logo: mainTeamImg02 },
  { id: 7, name: '초심자 연합', region: '경기 · 용인권', tags: ['스타터팀', '입문자 환영'], logo: mainTeamImg03 },
  { id: 8, name: '프렌들리 팀', region: '서울 · 수도권', tags: ['입문자 환영', '즐겁고 가볍게'], logo: mainTeamImg04 },
]
const tournamentCards = [
  { id: 1, name: '팀 바주카', region: '서울 · 수도권', logo: mainTeam01, stats: { atk: 8, def: 7, tac: 8 } },
  { id: 2, name: '팀 블랙워터', region: '부산 · 경남권', logo: mainTeam02, stats: { atk: 7, def: 9, tac: 9 } },
]

const youtubeCards = [
  { id: 1, title: '유튜브 제목~~...', uploader: '김유튜버', ago: '2일 전', img: mainImg },
  { id: 2, title: '유튜브 제목~~...', uploader: '김유튜버', ago: '2일 전', img: mainImg },
]

const sortedMatchCards = [...matchCards].sort((a, b) => {
  const aDay = Number(a.dday.match(/\d+/)?.[0] ?? 0)
  const bDay = Number(b.dday.match(/\d+/)?.[0] ?? 0)

  return aDay - bDay
})

function useDragScroll() {
  const dragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  })

  const stopDrag = (event: PointerEvent<HTMLDivElement>) => {
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
  const [activeTeamFilter, setActiveTeamFilter] = useState<TeamFilter>('스타터팀')
  const matchDragScroll = useDragScroll()
  const bannerDragScroll = useDragScroll()
  const filteredTeams = teamCards.filter((team) => team.tags.includes(activeTeamFilter))

  return (
    <div className="home_page">
      {/* ① 히어로 섹션 */}
      <section className="home_hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="home_hero_inner">
          <div className="home_hero_tit">
            <div className="home_hero_tag_row">
              <MainTag className="home_hero_tag">MVP 투표중</MainTag>
            </div>
            <div className="home_hero_txt">
              <p className="home_hero_title">총알이 눈보다 빠르다<br />뭔가 멋잇는 말</p>
              <span className="home_hero_pagination">1 / 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* ② 사용자 정보 + 경기 일정 */}
      <section className="home_userinfo">
        <div className="home_userinfo_profile">
          <div className="home_userinfo_pic_wrap">
            <img src={userAvatar} alt="프로필" className="home_userinfo_pic" />
          </div>
          <div className="home_userinfo_tit">
            <div className="home_userinfo_icons">
              <div className="home_userinfo_user_icon">
                <img src={symbolBeginner} alt="" className="home_userinfo_symbol" />
                <span>안전제일 뉴비</span>
              </div>
              <button className="home_userinfo_settings" type="button" aria-label="설정">
                <img src={settingsIcon} alt="" className="home_userinfo_settings_icon" />
              </button>
            </div>
            <p className="home_userinfo_name">삼삼오오님<br />오늘도 안전한 슈팅 하세요!</p>
            <div className="home_userinfo_tag_list">
              <CategoryTag>첫 AI 질문 완료</CategoryTag>
              <CategoryTag>친환경 바이오탄 지식인</CategoryTag>
            </div>
          </div>
        </div>

        <div className="home_userinfo_match">
          <div className="home_userinfo_match_header">
            <h2 className="home_userinfo_match_title">내 경기 일정</h2>
            <Link className="home_more_link" to="/my/matches" aria-label="내 경기 일정 더보기">
              <More />
            </Link>
          </div>
          <div className="home_match_scroll" {...matchDragScroll}>
            {sortedMatchCards.map((card) => (
              <article key={card.id} className="home_match_card" style={{ backgroundImage: `url(${card.img})` }}>
                <div className="home_match_card_top">
                  <KeywordTag>{card.dday}</KeywordTag>
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

      <section className="banner">
        <div className="buddy">
          <div className="txt">
            <p className="buddy_label">나의 밀착 가이드 멘토</p>
            <div className="name">
              <img src={symbol04} alt="" className="name_symbol" />
              <span>캡틴_서울</span>
            </div>
            <p className="buddy_desc">전동건(AEG) 렌탈 및 CQB 필드 가이드 전문입니다. 편하게 물어보세요!</p>
          </div>
          <img src={bannerChar} alt="" className="banner_char" />
        </div>

        <div className="bottom">
          <Link className="left safety_tutorial_card" to="/guide/quiz" aria-label="에어소프트 건 안전 튜토리얼 시작하기">
            <p className="bottom_label">에어소프트 건 안전 튜토리얼</p>
            <p className="bottom_title">안전한 슈팅의 첫 걸음</p>
            <p className="bottom_desc">필수 안전 수칙 퀴즈 풀고<br />첫 뱃지를 획득해보세요</p>
          </Link>
          <div className="right">#AI가_답변완료<br />#뉴비필독</div>
        </div>
      </section>

      {/* ⑤ 팀 추천 섹션 */}
      <section className="home_team">
        <div className="home_team_inner">
          <div className="home_team_header">
            <h2 className="home_kbl_title home_kbl_title_white">삼삼오오님과<br />딱 맞는 팀</h2>
          </div>
          <div className="home_team_con">
            <div className="home_team_tags">
              {teamFilters.map((filter) => (
                <button
                  className="home_team_filter_button"
                  type="button"
                  key={filter}
                  onClick={() => setActiveTeamFilter(filter)}
                  aria-pressed={activeTeamFilter === filter}
                >
                  <KeywordTag
                    style={{
                      background: activeTeamFilter === filter ? '#DFFB55' : 'rgba(255,255,255,0.12)',
                      border: activeTeamFilter === filter ? '1px solid transparent' : '1px solid rgba(255,255,255,0.12)',
                      color: activeTeamFilter === filter ? '#1A1A1A' : '#fff',
                    }}
                  >
                    {filter}
                  </KeywordTag>
                </button>
              ))}
            </div>
            <div className="home_team_scroll">
              {filteredTeams.map((team) => (
                <Link key={team.id} to="/team" className="home_team_card">
                  <div className="home_team_card_logo">
                    <img src={team.logo} alt="" className="home_team_card_logo_img" />
                  </div>
                  <p className="home_team_card_name">{team.name}</p>
                  <p className="home_team_card_region">{team.region}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ⑥ 오바워치 배너 */}
      <section className="home_banner" {...bannerDragScroll}>
        <div className="home_banner_inner">
          <div className="home_banner_txt">
            <p className="home_banner_label">건잇 x 오버워치</p>
            <h3 className="home_banner_title">초보자 퀴즈 풀고<br /><span className="home_banner_title_accent">오버워치 스킨</span> 받자!</h3>
          </div>
          <p className="home_banner_pg_nav">1&nbsp;&nbsp;/&nbsp;&nbsp;2</p>
        </div>
        <div className="home_banner_inner">
          <div className="home_banner_txt">
            <p className="home_banner_label">건잇 x 오버워치</p>
            <h3 className="home_banner_title">초보자 퀴즈 풀고<br /><span className="home_banner_title_accent">오버워치 스킨</span> 받자!</h3>
          </div>
          <p className="home_banner_pg_nav">2&nbsp;&nbsp;/&nbsp;&nbsp;2</p>
        </div>
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
          <button className="home_tournament_join_button" type="button" disabled>
            참여하기
          </button>
        </div>
      </section>

      {/* ⑧ 유튜브/크리에이터 하이라이트 */}
      <section className="home_youtube">
        <div className="home_youtube_header">
          <p className="home_youtube_label">크리에이터 하이라이트</p>
          <h2 className="home_kbl_title">이번주 최고의 버디는?</h2>
        </div>
        <div className="home_youtube_scroll">
          {youtubeCards.map((yt) => (
            <Link key={yt.id} to="/tournament/highlights" className="home_youtube_card">
              <div className="home_youtube_card_thumb" style={{ backgroundImage: `url(${yt.img})` }} />
              <div className="home_youtube_card_meta">
                <img src={userAvatar} alt={yt.uploader} className="home_youtube_card_avatar" />
                <div>
                  <p className="home_youtube_card_title">{yt.title}</p>
                  <p className="home_youtube_card_uploader">{yt.uploader} · {yt.ago}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

