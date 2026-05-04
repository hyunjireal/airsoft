import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { boardPosts } from '../../data/mockData'
import { RequireLoginModal } from '../../layout/RequireLoginModal'

export function PostDetail() {
  const { id } = useParams()
  const [modalOpen, setModalOpen] = useState(false)
  const post = boardPosts.find((item) => item.id === id)

  if (!post) {
    return <div className="page"><h1 className="page_title">게시글을 찾을 수 없어요</h1></div>
  }

  return (
    <div className="page">
      <h1 className="page_title">{post.title}</h1>
      <section className="section">
        <article className="card">
          <p>{post.author} / {post.createdAt}</p>
          <div className="chip_row">{post.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
          <p>{post.content}</p>
        </article>
        <article className="card"><h2>댓글 목록</h2><p>댓글 {post.commentsCount}개</p></article>
        <button className="button" type="button" onClick={() => setModalOpen(true)}>댓글 입력</button>
      </section>
      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
