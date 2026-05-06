import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Community.css'

const postTags = ['법규규정', '장비추천', '룰/매너', '게임전술'] as const

export function PostCreate() {
  const navigate = useNavigate()
  const [selectedTag, setSelectedTag] = useState<(typeof postTags)[number]>('법규규정')

  return (
    <div className="page community_post_create_page">
      <h1 className="page_title">글 작성하기</h1>
      <section className="section community_post_form">
        <div className="field">
          <span>말머리 선택</span>
          <div className="community_post_tags" aria-label="말머리 선택">
            {postTags.map((tag) => (
              <button
                className={`community_post_tag_button ${selectedTag === tag ? 'is_active' : ''}`}
                type="button"
                key={tag}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <label className="field">
          제목 작성
          <input className="input" placeholder="질문 제목을 입력해주세요" />
        </label>

        <label className="field">
          본문 작성
          <textarea className="textarea" placeholder="궁금한 내용을 자세히 적어주세요" />
        </label>

        <label className="field community_photo_attach">
          사진 첨부
          <input type="file" accept="image/*" multiple />
        </label>

        <button className="button primary_button" type="button" onClick={() => navigate('/community')}>
          작성하기
        </button>
      </section>
    </div>
  )
}
