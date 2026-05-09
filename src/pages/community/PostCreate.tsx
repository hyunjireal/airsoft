import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Community.css'

const postCategories = ['전체', '자유수다', '팀원모집', '경기후기', '장비', '정보', '이벤트'] as const
type PostCategory = (typeof postCategories)[number]

export function PostCreate() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('전체')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [fileName, setFileName] = useState('선택된 파일 없음')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileName(file ? file.name : '선택된 파일 없음')
  }

  return (
    <div className="post_create_page">
      <header className="post_create_header">
        <button
          className="post_create_back"
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
        >
          ‹
        </button>
        <h1 className="post_create_title">글 작성하기</h1>
      </header>

      <div className="post_create_body">
        <div className="post_create_field">
          <span className="post_create_label">말머리 선택</span>
          <div className="post_create_chips">
            {postCategories.map((cat) => (
              <button
                type="button"
                key={cat}
                className={`beginner_question_chip ${selectedCategory === cat ? 'is-active' : 'is-neutral'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="post_create_field">
          <label className="post_create_label" htmlFor="post_title">
            제목
          </label>
          <input
            id="post_title"
            className="post_create_input"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="post_create_field">
          <label className="post_create_label" htmlFor="post_body">
            본문
          </label>
          <textarea
            id="post_body"
            className="post_create_textarea"
            placeholder="본문을 입력해주세요"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className="post_create_field">
          <span className="post_create_label">사진 첨부</span>
          <div className="post_create_file_area">
            <button
              type="button"
              className="post_create_file_button"
              onClick={() => fileRef.current?.click()}
            >
              파일 선택
            </button>
            <span className="post_create_file_name">{fileName}</span>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFile} hidden />
          </div>
        </div>

        <button
          type="button"
          className="post_create_submit"
          onClick={() => navigate('/community')}
        >
          작성하기
        </button>
      </div>
    </div>
  )
}
