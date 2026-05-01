import { Link } from 'react-router-dom'
import { boardPosts } from '../../data/mockData'

export function MyPosts() {
  return (
    <div className="page">
      <h1 className="page-title">내가 쓴 글</h1>
      <section className="section">
        {boardPosts.filter((post) => post.author === '라이트기어').map((post) => (
          <Link className="card" key={post.id} to={`/community/post/${post.id}`}>{post.title}</Link>
        ))}
      </section>
    </div>
  )
}
