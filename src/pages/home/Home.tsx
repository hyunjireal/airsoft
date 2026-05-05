import { Link } from 'react-router-dom'
import CategoryTag from '../../components/CategoryTag'
import KeywordTag from '../../components/KeywordTag'
import MainTag from '../../components/MainTag'
import More from '../../components/More'
import settingsIcon from '../../asset/icons/settings.svg'
import mainImg from '../../asset/images/main_img01.png'
import heroImg from '../../asset/images/main_img02.png'
import userAvatar from '../../asset/images/main_user01.png'
import bannerChar from '../../asset/images/banner_char01.png'
import symbol04 from '../../asset/images/symbol_05.png'
import symbolBeginner from '../../asset/images/symbol_beginner.png'
import mainTeam01 from '../../asset/images/main_team01.png'
import mainTeam02 from '../../asset/images/main_team02.png'
import './Home.css'

const matchCards = [
  {
    id: 1,
    dday: '경기 25일 전',
    notice: '친환경 바이오 BB탄 필수 사용 구역',
    place: '경기도 하남시 OO필드',
    datetime: '2026.08.08 오후 06:30',
    img: mainImg,
  },{
    id: 2,
    dday: '경기 25일 전',
    notice: '친환경 바이오 BB탄 필수 사용 구역',
    place: '경기도 하남시 OO필드',
    datetime: '2026.08.08 오후 06:30',
    img: mainImg,
  },{
    id: 3,
    dday: '경기 25일 전',
    notice: '친환경 바이오 BB탄 필수 사용 구역',
    place: '경기도 하남시 OO필드',
    datetime: '2026.08.08 오후 06:30',
    img: mainImg,
  },{
    id: 4,
    dday: '경기 25일 전',
    notice: '친환경 바이오 BB탄 필수 사용 구역',
    place: '경기도 하남시 OO필드',
    datetime: '2026.08.08 오후 06:30',
    img: mainImg,
  },
  
]

const teamCards = [
  { id: 1, name: '무적해병', region: '경기도 파주시' },
  { id: 2, name: '무적해병', region: '경기도 파주시' },
  { id: 3, name: '무적해병', region: '경기도 파주시' },
  { id: 4, name: '무적해병', region: '경기도 파주시' },
  { id: 5, name: '무적해병', region: '경기도 파주시' },
  { id: 6, name: '무적해병', region: '경기도 파주시' },
  { id: 7, name: '무적해병', region: '경기도 파주시' },
  { id: 8, name: '무적해병', region: '경기도 파주시' },
]

const tournamentCards = [
  { id: 1, name: '팀 바주카', region: '서울 · 수도권', logo: mainTeam01, stats: { atk: 8, def: 7, tac: 8 } },
  { id: 2, name: '팀 블랙워터', region: '부산 · 경남권', logo: mainTeam02, stats: { atk: 7, def: 9, tac: 9 } },
]

const youtubeCards = [
  { id: 1, title: '유튜브 제목~~...', uploader: '김유튜버', ago: '2일 전', img: mainImg },
  { id: 2, title: '유튜브 제목~~...', uploader: '김유튜버', ago: '2일 전', img: mainImg },
]

export function Home() {
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
            <More />
          </div>
          <div className="home_match_scroll">
            {matchCards.map((card) => (
              <Link key={card.id} to="/my/schedule" className="home_match_card" style={{ backgroundImage: `url(${card.img})` }}>
                <div className="home_match_card_top">
                  <KeywordTag>{card.dday}</KeywordTag>
                  <p className="home_match_card_notice">{card.notice}</p>
                </div>
                <div className="home_match_card_txt">
                  <p className="home_match_card_place">{card.place}</p>
                  <p className="home_match_card_datetime">{card.datetime}</p>
                </div>
              </Link>
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
              <KeywordTag>스타터팀</KeywordTag>
              <KeywordTag>입문자 환영</KeywordTag>
              <KeywordTag>즐겁고 가볍게</KeywordTag>
              <KeywordTag>주말 경기</KeywordTag>
            </div>
            <div className="home_team_scroll">
              {teamCards.map((team) => (
                <Link key={team.id} to="/team" className="home_team_card">
                  <div className="home_team_card_logo">
                    <span className="home_team_card_logo_icon">S</span>
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
      <section className="home_banner">
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
