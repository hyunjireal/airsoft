import { useState } from 'react'
import './Community.css'
import { useNavigate, useParams } from 'react-router-dom'
import { boardNames } from '../../data/copy'
import { boardPosts } from '../../data/mockData'
import { RequireLoginModal } from '../../layout/RequireLoginModal'
import type { BoardPost } from '../../types'

const freeBoardCategories = ['전체', '자유수다', '팁 게시판', '모집해요', '후기']
const freeBoardTypes: BoardPost['boardType'][] = ['free', 'tip', 'review']

function getPostCategory(post: BoardPost) {
  if (post.category) {
    return post.category
  }
  if (post.boardType === 'tip') {
    return '팁 게시판'
  }
  if (post.boardType === 'review') {
    return '후기'
  }
  return '자유수다'
}

export function BoardList() {
  const { boardType = 'free' } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const typedBoard = boardType as BoardPost['boardType']
  const isFreeBoard = typedBoard === 'free'
  const posts = boardPosts.filter((post) => {
    const matchesBoard = isFreeBoard ? freeBoardTypes.includes(post.boardType) : post.boardType === typedBoard
    const matchesCategory = !isFreeBoard || selectedCategory === '전체' || getPostCategory(post) === selectedCategory

    return matchesBoard && matchesCategory
  })

  const write = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/community/post/create')
      return
    }
    setModalOpen(true)
  }

  const openPost = () => {
    navigate('/community/beginner/recent/first')
  }

  return (
    <div className="page">
      <h1 className="page_title">{boardNames[typedBoard] ?? '게시판'}</h1>
      <section className="section">
        <input className="input" placeholder="검색" />
        {isFreeBoard ? (
          <div className="chip_row" aria-label="자유게시판 카테고리">
            {freeBoardCategories.map((category) => (
              <button
                className={`chip chip_button ${selectedCategory === category ? 'active' : ''}`}
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        ) : (
          <div className="chip_row"><span className="chip">전체</span><span className="chip">초보</span><span className="chip">인기</span></div>
        )}
        <button className="button primary_button" type="button" onClick={write}>글쓰기</button>
      </section>
      <section className="section">
        {posts.map((post) => (
          <button className="card post_card_button" key={post.id} type="button" onClick={openPost}>
            <span className="badge">{getPostCategory(post)}</span>
            <h2>{post.title}</h2>
            <p>{post.author} / {post.createdAt} / 댓글 {post.commentsCount}</p>
            <div className="chip_row">{post.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
          </button>
        ))}
      </section>
      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
