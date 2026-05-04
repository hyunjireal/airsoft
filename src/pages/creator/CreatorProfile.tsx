import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { creators } from '../../data/creators'

export function CreatorProfile() {
  const { creatorId } = useParams()
  const creator = creators.find((item) => item.id === creatorId)
  const [subscribed, setSubscribed] = useState(false)

  if (!creator) {
    return <div className="page"><h1 className="page_title">크리에이터를 찾을 수 없어요</h1></div>
  }

  return (
    <div className="page">
      <section className="card creator_profile_card">
        <div className="card_row">
          <div className="creator_avatar large">{creator.rank}</div>
          <div>
            <h1 className="page_title">{creator.nickname}</h1>
            <p className="muted">구독자 {creator.subscribers}</p>
          </div>
        </div>
        <p>{creator.bio}</p>
        <div className="chip_row">
          {creator.styleTags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
        </div>
        <button className="button primary_button" type="button" onClick={() => setSubscribed((value) => !value)}>
          {subscribed ? '구독 중' : '구독 버튼'}
        </button>
      </section>

      <section className="section">
        <h2 className="section_title">대표영상</h2>
        {creator.videos.map((video) => (
          <article className="card media_card" key={video}>
            <div className="placeholder_image">영상 썸네일</div>
            <h3>{video}</h3>
          </article>
        ))}
      </section>

      <section className="section">
        <h2 className="section_title">크리에이터 게시물</h2>
        {creator.posts.map((post) => <article className="card" key={post}>{post}</article>)}
      </section>

      <section className="section">
        <h2 className="section_title">공지</h2>
        {creator.notices.map((notice) => <article className="card" key={notice}>{notice}</article>)}
      </section>
    </div>
  )
}
