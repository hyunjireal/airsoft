import { useRef, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import KeywordTag from '../../components/KeywordTag'
import MainTag from '../../components/MainTag'
import More from '../../components/More'
import arrowR from '../../asset/icons/arrow_r.svg'
import settingsIcon from '../../asset/icons/settings.svg'
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
  const matchDragScroll = useDragScroll()
  const teamDragScroll = useDragScroll()
  const bannerDragScroll = useDragScroll()

  return (
    <div className="home_page">
      <div className="top">
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
                  <span className="body_m_14">안전제일 뉴비</span>
                </div>
                <button className="home_userinfo_settings" type="button" aria-label="설정">
                  <img src={settingsIcon} alt="" className="home_userinfo_settings_icon" />
                </button>
              </div>
              <p className="home_userinfo_name">
                <span className="home_userinfo_name_user">삼삼오오</span>님
                <br />
                오늘도 안전한 슈팅 하세요!
              </p>
              <div className="home_userinfo_tag_list">
                <MainTag className="home_userinfo_tag">첫 AI 질문 완료</MainTag>
                <MainTag className="home_userinfo_tag">친환경 바이오탄 지식인</MainTag>
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

          <div className="banner_bottom">
            <Link className="left safety_tutorial_card" to="/guide/quiz" aria-label="에어소프트 건 안전 튜토리얼 시작하기">
              <div className="bottom_text_group">
                <p className="bottom_label">에어소프트 건 안전 튜토리얼</p>
                <p className="bottom_title">
                  <span className="bottom_title_semibold">안전한 슈팅의</span> 첫 걸음
                </p>
              </div>
              <KeywordTag className="bottom_quiz_tag">
                <span>퀴즈 풀기</span>
                <img src={arrowR} alt="" className="bottom_quiz_tag_icon" aria-hidden="true" />
              </KeywordTag>
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
            </div>
          </div>
        </section>
      </div>

      <div className="bottom">
        {/* ⑤ 팀 추천 섹션 */}
        <section className="home_team">
          <div className="home_team_content_box">
            <div className="home_team_header">
              <h2 className="home_team_title">
                <span className="home_team_title_user">AI 맞춤 추천 팀</span>
              </h2>
            </div>
            <div className="home_team_con">
              <div className="home_team_scroll" {...teamDragScroll}>
                {teamCards.map((team) => (
                  <article key={team.id} className="home_team_card">
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
          <button className="home_tournament_join_button" type="button" aria-disabled="true">
            투표하러 가기 
          </button>
        </section>
      </div>
    </div>
  )
}
