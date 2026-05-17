import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import arrowDownIcon from '../../asset/icons/arrow_down.svg'
import { createCommunityPost } from './communityPostStore'
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

type AttachedImagePreview = {
  id: string
  name: string
  url: string
}

const isVeteranUser = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem('level') === '숙련자'
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
  const beginnerBoardDisabled = isVeteranUser()
  const initialBoardContext: PostBoardContext =
    !beginnerBoardDisabled &&
    (location.state as PostCreateLocationState | null)?.boardContext === 'beginner'
      ? 'beginner'
      : 'general'

  const [boardContext, setBoardContext] = useState<PostBoardContext>(initialBoardContext)
  const [boardMenuOpen, setBoardMenuOpen] = useState(false)
  const postCategories = boardContext === 'beginner' ? beginnerPostCategories : generalPostCategories
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>(postCategories[0])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [titleError, setTitleError] = useState('')
  const [bodyError, setBodyError] = useState('')
  const [fileName, setFileName] = useState('선택한 파일 없음')
  const [attachedImages, setAttachedImages] = useState<AttachedImagePreview[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const boardDropdownRef = useRef<HTMLDivElement>(null)
  const attachedImagesRef = useRef<AttachedImagePreview[]>([])
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

  useEffect(() => {
    attachedImagesRef.current = attachedImages
  }, [attachedImages])

  useEffect(() => {
    return () => {
      attachedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.url))
    }
  }, [])

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/'))

    setAttachedImages((currentImages) => {
      currentImages.forEach((image) => URL.revokeObjectURL(image.url))

      return files.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${file.size}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    })

    if (files.length === 0) {
      setFileName('선택한 파일 없음')
    } else if (files.length === 1) {
      setFileName(files[0].name)
    } else {
      setFileName(`${files[0].name} 외 ${files.length - 1}장`)
    }
  }

  const clearAttachedImage = (imageId: string) => {
    setAttachedImages((currentImages) => {
      const targetImage = currentImages.find((image) => image.id === imageId)
      if (targetImage) {
        URL.revokeObjectURL(targetImage.url)
      }

      const nextImages = currentImages.filter((image) => image.id !== imageId)

      if (nextImages.length === 0) {
        setFileName('선택한 파일 없음')
        if (fileRef.current) {
          fileRef.current.value = ''
        }
      } else if (nextImages.length === 1) {
        setFileName(nextImages[0].name)
      } else {
        setFileName(`${nextImages[0].name} 외 ${nextImages.length - 1}장`)
      }

      return nextImages
    })
  }

  const handleBoardSelect = (nextBoard: PostBoardContext) => {
    if (beginnerBoardDisabled && nextBoard === 'beginner') {
      return
    }

    setBoardContext(nextBoard)
    setBoardMenuOpen(false)
  }

  const submitPost = () => {
    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()
    const nextTitleError = trimmedTitle ? '' : '제목을 입력하시오'
    const nextBodyError = trimmedBody ? '' : '본문을 입력하시오'

    setTitleError(nextTitleError)
    setBodyError(nextBodyError)

    if (nextTitleError || nextBodyError) {
      return
    }

    const createdPost = createCommunityPost({
      boardContext,
      category: String(selectedCategory),
      title: trimmedTitle,
      body: trimmedBody,
      fileName: attachedImages[0]?.name,
    })
    const destination = boardContext === 'beginner' ? '/community' : '/community/free'

    navigate(destination, {
      replace: true,
      state: {
        focusPostId: createdPost.id,
      },
    })
  }

  return (
    <div className="post_create_page">
      <PageHeader
        className="post_create_header"
        layout="standard"
        title="글 작성하기"
        onBack={() => navigate(-1)}
      />

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
                {boardOptions.map((option) => {
                  const disabled = beginnerBoardDisabled && option.value === 'beginner'

                  return (
                  <button
                    key={option.value}
                    className={`post_create_board_option${boardContext === option.value ? ' is_active' : ''}${disabled ? ' is_disabled' : ''}`}
                    type="button"
                    role="option"
                    aria-selected={boardContext === option.value}
                    aria-disabled={disabled}
                    disabled={disabled}
                    onClick={() => handleBoardSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    <small>{option.description}</small>
                    {disabled ? (
                      <small className="post_create_board_option_notice">
                        숙련자는 일반 게시판에 글을 작성할 수 있어요.
                      </small>
                    ) : null}
                    {option.notice ? (
                      <small className="post_create_board_option_notice">{option.notice}</small>
                    ) : null}
                  </button>
                  )
                })}
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
            className={`post_create_control post_create_input${titleError ? ' is_error' : ''}`}
            placeholder="제목을 입력해주세요"
            value={title}
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? 'post_title_error' : undefined}
            onChange={(event) => {
              setTitle(event.target.value)
              if (titleError) {
                setTitleError('')
              }
            }}
          />
          {titleError ? (
            <p className="post_create_error" id="post_title_error">
              {titleError}
            </p>
          ) : null}
        </div>

        <div className="post_create_field">
          <label className="post_create_label" htmlFor="post_body">
            본문
          </label>
          <textarea
            id="post_body"
            className={`post_create_textarea${bodyError ? ' is_error' : ''}`}
            placeholder="본문을 입력해주세요"
            value={body}
            aria-invalid={Boolean(bodyError)}
            aria-describedby={bodyError ? 'post_body_error' : undefined}
            onChange={(event) => {
              setBody(event.target.value)
              if (bodyError) {
                setBodyError('')
              }
            }}
          />
          {bodyError ? (
            <p className="post_create_error" id="post_body_error">
              {bodyError}
            </p>
          ) : null}
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
          {attachedImages.length > 0 ? (
            <div className="post_create_preview_grid" aria-label="첨부한 사진 미리보기">
              {attachedImages.map((image) => (
                <figure className="post_create_preview_item" key={image.id}>
                  <img src={image.url} alt={image.name} />
                  <figcaption>{image.name}</figcaption>
                  <button
                    type="button"
                    className="post_create_preview_remove"
                    aria-label={`${image.name} 첨부 삭제`}
                    onClick={() => clearAttachedImage(image.id)}
                  >
                    ×
                  </button>
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <section className="post_create_cta">
        <button
          type="button"
          className="post_create_submit"
          onClick={submitPost}
        >
          작성하기
        </button>
      </section>
    </div>
  )
}
