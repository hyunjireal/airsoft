import { useState } from 'react'
import './Community.css'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import bookmarkIcon from '../../asset/icons/com_bookmark.svg'
import bookmarkOnIcon from '../../asset/icons/com_bookmark_on.svg'
import chatSmallIcon from '../../asset/icons/com_chat02.svg'
import eyeIcon from '../../asset/icons/com_eyes.svg'
import writeIcon from '../../asset/icons/com_write.svg'
import hotFieldOne from '../../asset/images/com_field01.png'
import hotFieldTwo from '../../asset/images/com_field02.png'
import hotFieldThree from '../../asset/images/com_field03.png'
import hotFieldFour from '../../asset/images/match_list01.jpg'
import hotFieldFive from '../../asset/images/match_list02.jpg'
import hotFieldSix from '../../asset/images/match_list03.jpg'
import CategoryTag from '../../components/CategoryTag'
import MainTag from '../../components/MainTag'
import More from '../../components/More'
import { boardNames } from '../../data/copy'
import { boardPosts } from '../../data/mockData'
import { RequireLoginModal } from '../../layout/RequireLoginModal'
import type { BoardPost } from '../../types'

const freeBoardCategories = ['전체', '자유수다', '팀원모집', '경기후기', '장비', '정보', '이벤트']
const freeBoardTypes: BoardPost['boardType'][] = ['free', 'tip', 'review']

interface GeneralPostItem {
  id: string
  category: string
  title: string
  author: string
  createdAt: string
  views: number
  commentsCount: number
  saved?: boolean
}

const hotPosts = [
  { id: 'hot-001', title: '서울 근교 필드 BEST 5', image: hotFieldOne, comments: 42 },
  { id: 'hot-002', title: '숲 필드 주의할 점 7가지', image: hotFieldTwo, comments: 29 },
  { id: 'hot-003', title: '장비 직구 조언 부탁드립니다', image: hotFieldThree, comments: 26 },
  { id: 'hot-004', title: '실내 CQB 입문자 추천 팁', image: hotFieldFour, comments: 38 },
  { id: 'hot-005', title: '팀플레이 포지션 정하는 법', image: hotFieldFive, comments: 21 },
  { id: 'hot-006', title: '에어소프트 총기 관리 기초', image: hotFieldSix, comments: 33 },
]

const generalPosts: GeneralPostItem[] = [
  {
    id: 'general-001',
    category: '정보',
    title: '이번달 국내 에어소프트 행사 일정 공유',
    author: '레드도트',
    createdAt: '55분 전',
    views: 629,
    commentsCount: 138,
  },
  {
    id: 'general-002',
    category: '자유수다',
    title: '주말 야외전 다녀왔습니다. 재밌었네요',
    author: '화가난뼝아리',
    createdAt: '2시간 전',
    views: 470,
    commentsCount: 24,
  },
  {
    id: 'general-003',
    category: '팀원모집',
    title: '팀 스나이퍼 신규 팀원 모집합니다 (경험자 우대)',
    author: '블랙워리어',
    createdAt: '1시간 전',
    views: 150,
    commentsCount: 120,
  },
  {
    id: 'general-004',
    category: '장비',
    title: '신형 고글 써봤는데',
    author: '장비오리',
    createdAt: '3시간 전',
    views: 320,
    commentsCount: 138,
  },
  {
    id: 'general-005',
    category: '팀원모집',
    title: '[마포구] 이번주 주말 서바이벌 같이 가실 분 구합니다 (입문자 가능)',
    author: '필드러버',
    createdAt: '3시간 전',
    views: 320,
    commentsCount: 103,
  },
  {
    id: 'general-006',
    category: '경기후기',
    title: '비 와서 우중전 뛰었는데 안개탄 빡셌던 후기',
    author: '벙커장인',
    createdAt: '3시간 전',
    views: 320,
    commentsCount: 138,
  },
  {
    id: 'general-007',
    category: '장비',
    title: '탄창 파우치 세팅 다들 어떻게 함',
    author: '야전삽',
    createdAt: '2시간 전',
    views: 192,
    commentsCount: 138,
  },
  {
    id: 'general-008',
    category: '이벤트',
    title: '오버워치 스킨 받는 이벤트 관련 늅늅 질문입니다',
    author: '너무너무너무',
    createdAt: '3시간 전',
    views: 361,
    commentsCount: 138,
    saved: true,
  },
]

function getPostCategory(post: BoardPost) {
  if (post.category) {
    return post.category
  }
  if (post.boardType === 'tip') {
    return '정보'
  }
  if (post.boardType === 'review') {
    return '경기후기'
  }
  return '자유수다'
}

export function BoardList() {
  const { boardType = 'free' } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedSort, setSelectedSort] = useState<'latest' | 'popular'>('latest')
  const typedBoard = boardType as BoardPost['boardType']
  const isFreeBoard = typedBoard === 'free'
  const posts = boardPosts.filter((post) => {
    const matchesBoard = isFreeBoard ? freeBoardTypes.includes(post.boardType) : post.boardType === typedBoard
    const matchesCategory = !isFreeBoard || selectedCategory === '전체' || getPostCategory(post) === selectedCategory

    return matchesBoard && matchesCategory
  })
  const displayPosts: GeneralPostItem[] = isFreeBoard
    ? generalPosts.filter((post) => selectedCategory === '전체' || post.category === selectedCategory)
    : posts.map((post) => ({
        id: post.id,
        category: getPostCategory(post),
        title: post.title,
        author: post.author,
        createdAt: post.createdAt,
        views: 320,
        commentsCount: post.commentsCount,
      }))

  const write = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/community/post/create')
      return
    }
    setModalOpen(true)
  }

  const openPost = (postId: string) => {
    navigate(`/community/post/${postId}`)
  }

  if (isFreeBoard) {
    return (
      <div className="general_board_page">
        <section className="general_board_hero">
          <nav className="community_tabs" aria-label="커뮤니티 게시판 탭">
            <NavLink to="/community" end>
              초보 질문방
            </NavLink>
            <NavLink to="/community/free">일반 게시판</NavLink>
          </nav>

          <div className="general_board_hero_copy">
            <h1>일반 게시판</h1>
            <p>
              팀 모집, 장비 정보, 경기 후기를
              <br />
              자유롭게 공유해보세요
            </p>
          </div>
        </section>

        <section className="general_hot_section" aria-labelledby="hot-posts-heading">
          <div className="general_section_header">
            <h2 id="hot-posts-heading">오늘의 HOT 게시글</h2>
            <button className="general_more_button" type="button" aria-label="HOT 게시글 더보기">
              <More className="general_more_text" />
            </button>
          </div>
          <div className="general_hot_scroller">
            {hotPosts.map((post) => (
              <button className="general_hot_card" key={post.title} type="button" onClick={() => openPost(post.id)}>
                <span className="general_hot_image">
                  <img src={post.image} alt="" />
                  <MainTag className="general_hot_badge">HOT</MainTag>
                </span>
                <strong>{post.title}</strong>
                <span className="general_hot_stats">
                  <span>
                    <img src={eyeIcon} alt="" />
                    999+
                  </span>
                  <span>
                    <img src={chatSmallIcon} alt="" />
                    {post.comments}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="general_board_filters" aria-label="게시글 정렬과 카테고리">
          <div className="general_sort_tabs">
            <button
              className={selectedSort === 'latest' ? 'active' : ''}
              type="button"
              onClick={() => setSelectedSort('latest')}
            >
              최신순
            </button>
            <button
              className={selectedSort === 'popular' ? 'active' : ''}
              type="button"
              onClick={() => setSelectedSort('popular')}
            >
              인기순
            </button>
          </div>
          <div className="general_category_scroller" aria-label="일반게시판 카테고리">
            {freeBoardCategories.map((category) => (
              <button
                className={selectedCategory === category ? 'active' : ''}
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
              >
                <CategoryTag className={selectedCategory === category ? 'active' : ''}>{category}</CategoryTag>
              </button>
            ))}
          </div>
        </section>

        <section className="general_post_list" aria-label="일반 게시글 목록">
          {displayPosts.map((post) => (
            <button className="general_post_card" key={post.id} type="button" onClick={() => openPost(post.id)}>
              <span className="general_post_card_top">
                <span className="general_post_category">{post.category}</span>
                <img className="general_bookmark_icon" src={post.saved ? bookmarkOnIcon : bookmarkIcon} alt="" />
              </span>
              <span className="general_post_title">{post.title}</span>
              <span className="general_post_meta">
                <span>
                  {post.author} · {post.createdAt}
                </span>
                <span className="general_post_stats">
                  <span>
                    <img src={eyeIcon} alt="" />
                    {post.views}
                  </span>
                  <span>
                    <img src={chatSmallIcon} alt="" />
                    {post.commentsCount}
                  </span>
                </span>
              </span>
            </button>
          ))}
        </section>

        <button
          className="community_write_floating beginner_write_floating general_write_fab"
          type="button"
          aria-label="글쓰기"
          onClick={write}
        >
          <img src={writeIcon} alt="" />
        </button>
        <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page_title">{boardNames[typedBoard] ?? '게시판'}</h1>
      <section className="section">
        <input className="input" placeholder="검색" />
        <div className="chip_row"><span className="chip">전체</span><span className="chip">초보</span><span className="chip">인기</span></div>
        <button className="button primary_button" type="button" onClick={write}>글쓰기</button>
      </section>
      <section className="section">
        {displayPosts.map((post) => (
          <button className="card post_card_button" key={post.id} type="button" onClick={() => openPost(post.id)}>
            <span className="badge">{post.category}</span>
            <h2>{post.title}</h2>
            <p>{post.author} / {post.createdAt} / 댓글 {post.commentsCount}</p>
          </button>
        ))}
      </section>
      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
