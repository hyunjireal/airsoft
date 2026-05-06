import { Link } from 'react-router-dom'
import './CreatorHome.css'
import list01 from '../../asset/images/creator_list01.png'
import list02 from '../../asset/images/creator_list02.png'
import list03 from '../../asset/images/creator_list03.png'
import list04 from '../../asset/images/creator_list04.png'
import list05 from '../../asset/images/creator_list05.png'
import list06 from '../../asset/images/creator_list06.png'
import list07 from '../../asset/images/creator_list07.png'
import list08 from '../../asset/images/creator_list08.png'
import list09 from '../../asset/images/creator_list09.png'

const creatorProfiles = [
  { id: 'creator-001', name: '건오별', stat: '1743만명', avatar: list01 },
  { id: 'creator-002', name: '영스윙', stat: '1743만명', avatar: list02 },
  { id: 'creator-003', name: '바보링', stat: '1743만명', avatar: list03 },
  { id: 'creator-004', name: '아쿠마', stat: '1743만명', avatar: list04 },
  { id: 'creator-001', name: '이찬원', stat: '1743만명', avatar: list05 },
  { id: 'creator-002', name: '외국인', stat: '1743만명', avatar: list06 },
  { id: 'creator-003', name: '나르마치고', stat: '1743만명', avatar: list07 },
  { id: 'creator-004', name: '빛나는꼬꼬', stat: '1743만명', avatar: list08 },
  { id: 'creator-001', name: '깡나브리', stat: '1743만명', avatar: list09 },
  { id: 'creator-002', name: '하나껌', stat: '1743만명', avatar: list07 },
  { id: 'creator-003', name: '교회는처치', stat: '1743만명', avatar: list08 },
  { id: 'creator-004', name: '곰발루이지', stat: '1743만명', avatar: list09 },
]

const SearchIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4.5-4.5" />
  </svg>
)

export function CreatorList() {
  return (
    <div className="creator_list_page">
      <h1>크리에이터 리스트</h1>

      <label className="creator_list_search" aria-label="크리에이터 검색">
        <SearchIcon />
        <input type="search" />
      </label>

      <div className="creator_list_filters" aria-label="크리에이터 카테고리">
        <button className="is_active" type="button">장비</button>
        <button type="button">게임</button>
      </div>

      <section className="creator_profile_grid" aria-label="크리에이터 프로필 목록">
        {creatorProfiles.map((creator, index) => (
          <Link className="creator_profile_tile" key={`${creator.name}-${index}`} to={`/creator/${creator.id}`}>
            <img src={creator.avatar} alt="" />
            <strong>{creator.name}</strong>
            <span>{creator.stat}</span>
          </Link>
        ))}
      </section>
    </div>
  )
}
