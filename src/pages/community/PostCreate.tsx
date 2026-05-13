import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import arrowDownIcon from '../../asset/icons/arrow_down.svg'
import './Community.css'

const beginnerPostCategories = ['법규/규정', '장비', '안전', '게임/전술', '수리/튜닝'] as const
const generalPostCategories = ['자유수다', '팀원모집', '경기후기', '장비', '정보', '이벤트'] as const

type BeginnerPostCategory = (typeof beginnerPostCategories)[number]
type GeneralPostCategory = (typeof generalPostCategories)[number]
type PostCategory = BeginnerPostCategory | GeneralPostCategory
type PostBoardContext = 'beginner' | 'general'

type PostCreateLocationState = {
  boardContext?: PostBoardContext
}

const boardOptions: {
  value: PostBoardContext
  label: string
  description: string
  notice?: string
}[] = [
  {
    value: 'beginner',
    label: '초보 질문방',
    description: '입문자 질문, 안전, 장비 고민을 나누는 공간',
    notice: '*초보자만 게시글 작성이 가능해요',
  },
  {
    value: 'general',
    label: '일반 게시판',
    description: '자유수다, 경기후기, 모집, 정보 공유',
  },
]

export function PostCreate() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialBoardContext: PostBoardContext =
    (location.state as PostCreateLocationState | null)?.boardContext === 'beginner'
      ? 'beginner'
      : 'general'

  const [boardContext, setBoardContext] = useState<PostBoardContext>(initialBoardContext)
  const [boardMenuOpen, setBoardMenuOpen] = useState(false)
  const postCategories = boardContext === 'beginner' ? beginnerPostCategories : generalPostCategories
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>(postCategories[0])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [fileName, setFileName] = useState('선택한 파일 없음')
  const fileRef = useRef<HTMLInputElement>(null)
  const boardDropdownRef = useRef<HTMLDivElement>(null)
  const currentBoard = boardOptions.find((option) => option.value === boardContext) ?? boardOptions[1]

  useEffect(() => {
    setSelectedCategory(postCategories[0])
  }, [postCategories])

  useEffect(() => {
    if (!boardMenuOpen) {
      return undefined
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!boardDropdownRef.current?.contains(event.target as Node)) {
        setBoardMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setBoardMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [boardMenuOpen])

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileName(file ? file.name : '선택한 파일 없음')
  }

  const handleBoardSelect = (nextBoard: PostBoardContext) => {
    setBoardContext(nextBoard)
    setBoardMenuOpen(false)
  }

  const submitDestination = boardContext === 'beginner' ? '/community' : '/community/free'

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
          <span className="post_create_label">게시판 선택</span>
          <div className="post_create_board_select_wrap" ref={boardDropdownRef}>
            <button
              id="post-board-trigger"
              className={`post_create_control post_create_board_trigger${boardMenuOpen ? ' is_open' : ''}`}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={boardMenuOpen}
              aria-controls="post-board-listbox"
              onClick={() => setBoardMenuOpen((open) => !open)}
            >
              <span>{currentBoard.label}</span>
              <img src={arrowDownIcon} alt="" aria-hidden="true" />
            </button>

            {boardMenuOpen ? (
              <div
                id="post-board-listbox"
                className="post_create_board_dropdown"
                role="listbox"
                aria-labelledby="post-board-trigger"
              >
                {boardOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`post_create_board_option${boardContext === option.value ? ' is_active' : ''}`}
                    type="button"
                    role="option"
                    aria-selected={boardContext === option.value}
                    onClick={() => handleBoardSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    <small>{option.description}</small>
                    {option.notice ? (
                      <small className="post_create_board_option_notice">{option.notice}</small>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="post_create_field">
          <span className="post_create_label">말머리 선택</span>
          <div className="post_create_chips">
            {postCategories.map((category) => (
              <button
                type="button"
                key={category}
                className={`beginner_question_chip ${selectedCategory === category ? 'is-active' : 'is-neutral'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
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
            className="post_create_control post_create_input"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
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
            onChange={(event) => setBody(event.target.value)}
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
          onClick={() => navigate(submitDestination)}
        >
          작성하기
        </button>
      </div>
    </div>
  )
}
