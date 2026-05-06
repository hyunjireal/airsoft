import { Link, useNavigate } from 'react-router-dom';
import './CreatorHome.css';
import grade01 from '../../asset/images/creator_grade01.png';
import grade02 from '../../asset/images/creator_grade02.png';
import grade03 from '../../asset/images/creator_grade03.png';
import grade04 from '../../asset/images/creator_grade04.png';
import grade05 from '../../asset/images/creator_grade05.png';
import grade06 from '../../asset/images/creator_grade06.png';
import grade07 from '../../asset/images/creator_grade07.png';
import grade08 from '../../asset/images/creator_grade08.png';
import grade09 from '../../asset/images/creator_grade09.png';
import grade10 from '../../asset/images/creator_grade10.png';
import grade11 from '../../asset/images/creator_grade11.png';

import list01 from '../../asset/images/creator_list01.png';
import list02 from '../../asset/images/creator_list02.png';
import list03 from '../../asset/images/creator_list03.png';
import list04 from '../../asset/images/creator_list04.png';
import list05 from '../../asset/images/creator_list05.png';
import list06 from '../../asset/images/creator_list06.png';
import list07 from '../../asset/images/creator_list07.png';
import list08 from '../../asset/images/creator_list08.png';
import list09 from '../../asset/images/creator_list09.png';

const podiumData = [
  { rank: 2, name: '나는야최고', score: '', avatar: grade02 },
  { rank: 1, name: '레드닷존', score: '986', avatar: grade01 },
  { rank: 3, name: '꼬꼬댁', score: '', avatar: grade03 }
];

const ranks = [
  { rank: 4, name: '베키러리', score: 985, avatar: grade04 },
  { rank: 5, name: '나나캣', score: 922, avatar: grade05 },
  { rank: 6, name: '피파소녀', score: 885, avatar: grade06 },
  { rank: 7, name: '빛나는 꼬꼬', score: 823, avatar: grade07 },
  { rank: 8, name: '빈온', score: 736, avatar: grade08 },
  { rank: 9, name: '딱나브리', score: 650, avatar: grade09 },
  { rank: 10, name: '뾰족쏜', score: 557, avatar: grade10 },
];

const gridList = [
  { name: '건오벌', stat: '1743만장', avatar: list01 },
  { name: '명스텔', stat: '1743만장', avatar: list02 },
  { name: '바투랑', stat: '1743만장', avatar: list03 },
  { name: '닉네임', stat: '1743만장', avatar: list04 },
  { name: '닉네임', stat: '1743만장', avatar: list05 },
  { name: '닉네임', stat: '1743만장', avatar: list06 },
  { name: '닉네임', stat: '1743만장', avatar: list07 },
  { name: '닉네임', stat: '1743만장', avatar: list08 },
  { name: '닉네임', stat: '1743만장', avatar: list09 },
];

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="12" cy="19" r="1.5"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 21h8M12 17v4M7 4h10M4 4h2v5a2 2 0 0 0 2 2h0M20 4h-2v5a2 2 0 0 1-2 2h0M12 17a6 6 0 0 0 6-6V4H6v7a6 6 0 0 0 6 6z"/>
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="0">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const BadgeIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12L2 9l4-3 1-4 4 1 3-3 3 3 4-1 1 4 4 3-2 3 2 3-4 3-1 4-4-1-3 3-3-3-4 1-1-4-4-3 2-3z" fill="#475569" stroke="none" />
    <path d="M12 8l1.5 2.5 3 .5-2 2 .5 3-2.5-1.5L10 16l.5-3-2-2 3-.5L12 8z" fill="#facc15" stroke="none" />
  </svg>
);

export function CreatorHome() {
  const navigate = useNavigate();

  return (
    <div className="creator_page">
      <header className="creator_header">
        <button className="icon_btn" onClick={() => navigate(-1)}><CloseIcon /></button>
        <div className="creator_title_wrapper">
          <h1 className="creator_title">크리에이터</h1>
          <div className="creator_date">2026년 5월 30일</div>
        </div>
        <button className="icon_btn"><MoreIcon /></button>
      </header>

      <section className="podium_section">
        {podiumData.map((item, index) => {
          const isCenter = index === 1;
          const cls = isCenter ? 'podium_1' : index === 0 ? 'podium_2' : 'podium_3';
          return (
            <div className={`podium_item ${cls}`} key={item.rank}>
              <div className="podium_avatar_wrapper">
                <img src={item.avatar} alt={item.name} className="podium_avatar" />
              </div>
              <div className="podium_name">{item.name}</div>
              <div className="podium_base">
                <div className="podium_badge">
                  <BadgeIcon />
                  {item.score && <span className="podium_score">{item.score}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="list_ranking_section">
        <div className="update_time">순위표가 2시간 전에 갱신되었어요</div>
        <div className="ranking_list">
          {ranks.map(rank => (
            <div className="ranking_row" key={rank.rank}>
              <div className="rank_num">
                <TrophyIcon /> {rank.rank}
              </div>
              <img src={rank.avatar} alt={rank.name} className="ranking_row_avatar" />
              <div className="ranking_row_name">{rank.name}</div>
              <div className="ranking_row_score">
                <StarIcon /> {rank.score}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="banner_section">
        <Link to="#" className="banner_card">
          <img src={grade11} alt="Banner" className="banner_img" />
        </Link>
      </section>

      <section className="creator_bottom_section">
        <h2 className="bottom_title">크리에이터 리스트</h2>
        <div className="search_bar_wrapper">
          <span className="search_icon"><SearchIcon /></span>
          <input type="text" className="search_input" placeholder="검색" />
        </div>
        <div className="chip_filters">
          <span className="creator_chip active">장르</span>
          <span className="creator_chip">게임</span>
        </div>
        <div className="creator_grid">
          {gridList.map((item, idx) => (
            <Link to="#" className="grid_item" key={idx}>
              <img src={item.avatar} alt={item.name} className="grid_avatar" />
              <div className="grid_name">{item.name}</div>
              <div className="grid_stat">{item.stat}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
