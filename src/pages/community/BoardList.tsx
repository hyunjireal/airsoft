import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { boardNames } from '../../data/copy'
import { boardPosts } from '../../data/mockData'
import { RequireLoginModal } from '../../layout/RequireLoginModal'
import type { BoardPost } from '../../types'

export function BoardList() {
  const { boardType = 'free' } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const typedBoard = boardType as BoardPost['boardType']
  const posts = boardPosts.filter((post) => post.boardType === typedBoard)

  const write = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/community/post/create')
      return
    }
    setModalOpen(true)
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
        {posts.map((post) => (
          <Link className="card" key={post.id} to={`/community/post/${post.id}`}>
            <h2>{post.title}</h2>
            <p>{post.author} / {post.createdAt} / 댓글 {post.commentsCount}</p>
            <div className="chip_row">{post.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
          </Link>
        ))}
      </section>
      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
