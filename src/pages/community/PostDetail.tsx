import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import arrowLeftIcon from '../../asset/icons/arrow_l.svg'
import bellIcon from '../../asset/icons/com_bell.svg'
import bookmarkIcon from '../../asset/icons/com_bookmark.svg'
import bookmarkOnIcon from '../../asset/icons/com_bookmark_on.svg'
import commentIcon from '../../asset/icons/com_comment.svg'
import goodIcon from '../../asset/icons/com_good.svg'
import sendIcon from '../../asset/icons/com_send.svg'
import chatSmallIcon from '../../asset/icons/com_chat02.svg'
import verticalDotIcon from '../../asset/icons/com_verticalDot.svg'
import eyeIcon from '../../asset/icons/com_eyes.svg'
import userIcon from '../../asset/icons/com_user.svg'
import MainTag from '../../components/MainTag'
import { boardPosts } from '../../data/mockData'
import { RequireLoginModal } from '../../layout/RequireLoginModal'
import './Community.css'

type DetailReply = {
  id?: string
  author: string
  time: string
  body: string
  isMine?: boolean
}

type DetailComment = {
  id: string
  author: string
  time: string
  body: string
  likes: number
  replies: DetailReply[]
  liked?: boolean
  isMine?: boolean
}

type ReplyMenuTarget = {
  commentId: string
  replyId: string
}

type DetailPost = {
  id: string
  title: string
  category: string
  author: string
  time: string
  body: string
  views: string
  comments: number
  recommended?: boolean
}

const detailPostMap: Record<string, DetailPost> = {
  'q-001': {
    id: 'q-001',
    title: '서바이벌 게임에서 꼭 지켜야 할 기본 규칙이 궁금해요!',
    category: '법규/규정',
    author: '필드메이트',
    time: '2시간 전',
    body: '이번 주말에 처음으로 서바이벌 게임에 참여하려고 합니다. 안전장비는 준비했는데, 현장에서 꼭 지켜야 하는 기본 규칙이나 입문자가 실수하기 쉬운 부분이 궁금해요.',
    views: '999+',
    comments: 3,
    recommended: true,
  },
  'q-002': {
    id: 'q-002',
    title: '처음 가는 필드에서는 어떤 장비를 우선으로 준비하면 좋나요?',
    category: '장비',
    author: '게임마스터',
    time: '1시간 전',
    body: '첫 야외전에 참여하려고 하는데 고글, 장갑, 보호대 중에서 무엇을 먼저 준비해야 할지 고민입니다. 대여 장비로 시작해도 괜찮은지도 궁금해요.',
    views: '150',
    comments: 3,
  },
  'q-003': {
    id: 'q-003',
    title: '팀플레이 입문자가 알아두면 좋은 기본 전술 팁이 있을까요?',
    category: '게임/전술',
    author: '전술고수',
    time: '30분 전',
    body: '처음 팀플레이에 참여하면 어디를 보고 움직여야 할지 어렵더라고요. 입문자가 팀원들과 호흡을 맞출 때 꼭 알아두면 좋은 기본 전술이 궁금합니다.',
    views: '200',
    comments: 3,
  },
  'q-004': {
    id: 'q-004',
    title: '보호장비는 어느 정도까지 챙겨야 안전하게 즐길 수 있나요?',
    category: '안전',
    author: '에솦러',
    time: '4시간 전',
    body: '고글은 필수라고 들었는데 마스크나 장갑, 무릎 보호대까지 챙겨야 하는지 궁금합니다. 초보 기준으로 안전하게 준비할 수 있는 장비 구성이 알고 싶어요.',
    views: '188',
    comments: 3,
  },
  'hot-001': {
    id: 'hot-001',
    title: '서울 근교 필드 BEST 5',
    category: '정보',
    author: '필드메모',
    time: '55분 전',
    body: '서울에서 접근하기 좋은 필드들을 정리해봤습니다. 이동 시간, 초보 친화도, 장비 대여 가능 여부를 기준으로 골라봤어요.',
    views: '999+',
    comments: 42,
  },
  'hot-002': {
    id: 'hot-002',
    title: '숲 필드 주의할 점 7가지',
    category: '안전',
    author: '우드랜드',
    time: '1시간 전',
    body: '숲 필드는 시야가 좁고 지형이 불규칙해서 안전수칙을 더 꼼꼼히 지켜야 합니다. 이동 동선과 보호장비 체크 포인트를 정리했습니다.',
    views: '812',
    comments: 29,
  },
  'hot-003': {
    id: 'hot-003',
    title: '장비 직구 조언 부탁드립니다',
    category: '장비',
    author: '장비고민',
    time: '2시간 전',
    body: '해외 직구로 고글과 파우치를 구매하려고 하는데 사이즈나 배송, 필드 사용 가능 여부에서 조심해야 할 점이 있을까요?',
    views: '640',
    comments: 26,
  },
  'general-001': {
    id: 'general-001',
    title: '이번달 국내 에어소프트 행사 일정 공유',
    category: '정보',
    author: '레드도트',
    time: '55분 전',
    body: '이번 달 국내에서 열리는 에어소프트 행사와 체험전 일정을 모아봤습니다. 참가 전에 각 행사 공지와 안전 규정을 꼭 확인해주세요.',
    views: '629',
    comments: 138,
  },
  'general-002': {
    id: 'general-002',
    title: '주말 야외전 다녀왔습니다. 재밌었네요',
    category: '자유수다',
    author: '마다가스카르',
    time: '2시간 전',
    body: '주말 야외전에 다녀왔는데 운영도 깔끔하고 초보자 브리핑도 자세해서 좋았습니다. 다음에는 장비 세팅을 조금 더 가볍게 해보려고요.',
    views: '470',
    comments: 24,
  },
  'general-003': {
    id: 'general-003',
    title: '팀 스나이퍼 신규 팀원 모집합니다 (경험자 우대)',
    category: '팀원모집',
    author: '블랙워리어',
    time: '1시간 전',
    body: '주말 중심으로 활동하는 팀에서 신규 팀원을 모집합니다. 기본 안전수칙을 숙지하고 꾸준히 참여할 수 있는 분이면 환영합니다.',
    views: '150',
    comments: 120,
  },
  'general-004': {
    id: 'general-004',
    title: '신형 고글 써봤는데',
    category: '장비',
    author: '장비오리',
    time: '3시간 전',
    body: '신형 고글을 하루 사용해봤는데 김 서림은 적고 착용감은 괜찮았습니다. 다만 헬멧과 같이 쓸 때는 스트랩 길이를 꼭 확인해야겠더라고요.',
    views: '320',
    comments: 138,
  },
  'general-005': {
    id: 'general-005',
    title: '[마포구] 이번주 주말 서바이벌 같이 가실 분 구합니다 (입문자 가능)',
    category: '팀원모집',
    author: '필드러버',
    time: '3시간 전',
    body: '이번 주말에 마포구에서 출발해서 경기권 필드로 이동할 예정입니다. 입문자도 가능하고, 안전 브리핑은 같이 챙겨드릴게요.',
    views: '320',
    comments: 103,
  },
  'general-006': {
    id: 'general-006',
    title: '비 와서 우중전 뛰었는데 안개탄 빡셌던 후기',
    category: '경기후기',
    author: '벙커장인',
    time: '3시간 전',
    body: '비 오는 날이라 시야 확보가 어렵고 장비 관리가 중요했습니다. 방수 파우치와 여분 수건을 챙기니 꽤 도움이 됐어요.',
    views: '320',
    comments: 138,
  },
  'general-007': {
    id: 'general-007',
    title: '탄창 파우치 세팅 다들 어떻게 함',
    category: '장비',
    author: '야전삽',
    time: '2시간 전',
    body: '탄창 파우치를 허리 쪽에 둘지 앞쪽에 둘지 고민입니다. 빠르게 꺼내기 좋은 세팅이나 초보자가 쓰기 편한 배치가 궁금해요.',
    views: '192',
    comments: 138,
  },
  'general-008': {
    id: 'general-008',
    title: '오버워치 스킨 받는 이벤트 관련 늅늅 질문입니다',
    category: '이벤트',
    author: '너무너무너무',
    time: '3시간 전',
    body: '이벤트 참여 조건을 봤는데 초보자 퀴즈 완료 후 어디에서 보상을 확인하는지 헷갈립니다. 참여해보신 분 계신가요?',
    views: '361',
    comments: 138,
  },
}

const detailComments: DetailComment[] = [
  {
    id: 'detail-comment-1',
    author: '안전교관',
    time: '2시간 전',
    body: '가장 중요한 건 고글을 절대 벗지 않는 거예요. 경기장 안에서는 진행자의 안내를 먼저 듣고, 히트 선언은 크게 말해주세요. 처음이라면 시작 전에 안전거리와 탄속 규정을 꼭 확인하면 좋아요.',
    likes: 22,
    replies: [
      {
        id: 'detail-reply-1',
        author: '입문러너',
        time: '2시간 전',
        body: '고글은 정말 계속 착용해야겠네요. 처음 가기 전에 필드 규정도 미리 확인해볼게요.',
      },
    ],
  },
  {
    id: 'detail-comment-2',
    author: '새벽달빛',
    time: '45분 전',
    body: '장비를 사용할 때는 항상 상태를 점검하는 게 중요해요. 손잡이나 연결 부위가 느슨하지 않은지 꼭 확인하세요.',
    likes: 7,
    replies: [],
  },
  {
    id: 'detail-comment-3',
    author: '탄속체커',
    time: '방금 전',
    body: '경기 중에는 항상 주변을 살피고, 다른 참가자와의 거리를 유지하는 것이 안전사고를 예방하는 데 도움이 돼요.',
    likes: 4,
    replies: [],
  },
]

export function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [postLiked, setPostLiked] = useState(false)
  const [postLikes, setPostLikes] = useState(18)
  const [postBookmarked, setPostBookmarked] = useState(false)
  const [comments, setComments] = useState<DetailComment[]>(detailComments)
  const [commentReactions, setCommentReactions] = useState<Record<string, { liked: boolean; likes: number }>>(() =>
    Object.fromEntries(detailComments.map((comment) => [comment.id, { liked: Boolean(comment.liked), likes: comment.likes }])),
  )
  const [commentInput, setCommentInput] = useState('')
  const [openReplyIds, setOpenReplyIds] = useState<string[]>([])
  const [openCommentMenuId, setOpenCommentMenuId] = useState<string | null>(null)
  const [replyMenuTarget, setReplyMenuTarget] = useState<ReplyMenuTarget | null>(null)
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null)
  const [openPostMenu, setOpenPostMenu] = useState(false)
  const [postEdits, setPostEdits] = useState<Record<string, Partial<Pick<DetailPost, 'title' | 'body'>>>>({})
  const [deletedPostIds, setDeletedPostIds] = useState<string[]>([])
  const [commentsExpanded, setCommentsExpanded] = useState(false)
  const replyLongPressTimer = useRef<number | null>(null)
  const boardPost = boardPosts.find((item) => item.id === id)
  const detailPost = id ? detailPostMap[id] : undefined
  const postBase = detailPost ?? (boardPost
    ? {
        id: boardPost.id,
        title: boardPost.title,
        category: boardPost.category ?? boardPost.tags[0] ?? '자유수다',
        author: boardPost.author,
        time: boardPost.createdAt,
        body: boardPost.content,
        views: '320',
        comments: boardPost.commentsCount,
        recommended: boardPost.isBeginnerQuestion,
      }
    : undefined)
  const post = postBase && !deletedPostIds.includes(postBase.id) ? { ...postBase, ...postEdits[postBase.id] } : undefined
  const initialVisibleCommentCount = detailComments.length + detailComments.reduce((total, comment) => total + comment.replies.length, 0)
  const visibleCommentCount = comments.length + comments.reduce((total, comment) => total + comment.replies.length, 0)
  const postCommentCount = post ? post.comments + Math.max(visibleCommentCount - initialVisibleCommentCount, 0) : 0
  const hasOpenReply = openReplyIds.length > 0
  const activeReplyId = openReplyIds.at(-1)
  const visibleComments = commentsExpanded ? comments : comments.slice(0, 1)

  useEffect(() => {
    const closeMenus = () => {
      setOpenPostMenu(false)
      setOpenCommentMenuId(null)
      setReplyMenuTarget(null)
    }

    window.addEventListener('click', closeMenus)
    return () => window.removeEventListener('click', closeMenus)
  }, [])

  if (!post) {
    return <div className="page"><h1 className="page_title">게시글을 찾을 수 없어요</h1></div>
  }

  const togglePostLike = () => {
    setPostLiked((liked) => !liked)
    setPostLikes((likes) => likes + (postLiked ? -1 : 1))
  }

  const editPost = () => {
    const nextTitle = window.prompt('글 제목을 수정하세요', post.title)?.trim()
    if (!nextTitle) {
      return
    }

    const nextBody = window.prompt('글 내용을 수정하세요', post.body)?.trim()
    if (!nextBody) {
      return
    }

    setPostEdits((items) => ({ ...items, [post.id]: { title: nextTitle, body: nextBody } }))
    setOpenPostMenu(false)
  }

  const deletePost = () => {
    if (!window.confirm('글을 삭제할까요?')) {
      return
    }

    setDeletedPostIds((items) => [...items, post.id])
    setOpenPostMenu(false)
  }

  const revealWrittenItem = (itemId: string) => {
    setHighlightedItemId(itemId)
    window.setTimeout(() => {
      document.getElementById(itemId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 0)
    window.setTimeout(() => {
      setHighlightedItemId((currentId) => (currentId === itemId ? null : currentId))
    }, 1400)
  }

  const submitComment = () => {
    const body = commentInput.trim()

    if (!body) {
      setModalOpen(true)
      return
    }

    if (activeReplyId) {
      const replyId = `detail-reply-user-${Date.now()}`
      setComments((items) =>
        items.map((comment) =>
          comment.id === activeReplyId
            ? {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    id: replyId,
                    author: '나',
                    time: '방금 전',
                    body,
                    isMine: true,
                  },
                ],
              }
            : comment,
        ),
      )
      setCommentsExpanded(true)
      setCommentInput('')
      revealWrittenItem(replyId)
      return
    }

    const commentId = `detail-comment-user-${Date.now()}`
    const nextComment: DetailComment = {
      id: commentId,
      author: '나',
      time: '방금 전',
      body,
      likes: 0,
      replies: [],
      isMine: true,
    }

    setComments((items) => [...items, nextComment])
    setCommentReactions((reactions) => ({ ...reactions, [commentId]: { liked: false, likes: 0 } }))
    setCommentsExpanded(true)
    setCommentInput('')
    revealWrittenItem(commentId)
  }

  const toggleReplyInput = (commentId: string) => {
    setOpenReplyIds((ids) => (ids.includes(commentId) ? ids.filter((item) => item !== commentId) : [...ids, commentId]))
  }

  const toggleCommentLike = (commentId: string) => {
    setCommentReactions((reactions) => {
      const current = reactions[commentId]
      if (!current) {
        return reactions
      }

      return {
        ...reactions,
        [commentId]: {
          liked: !current.liked,
          likes: current.likes + (current.liked ? -1 : 1),
        },
      }
    })
  }

  const editComment = (commentId: string) => {
    const current = comments.find((comment) => comment.id === commentId)
    if (!current) {
      return
    }

    const nextBody = window.prompt('댓글을 수정하세요', current.body)?.trim()
    if (!nextBody) {
      return
    }

    setComments((items) => items.map((comment) => (comment.id === commentId ? { ...comment, body: nextBody } : comment)))
    setOpenCommentMenuId(null)
  }

  const deleteComment = (commentId: string) => {
    const current = comments.find((comment) => comment.id === commentId)
    if (!current || !window.confirm('댓글을 삭제할까요?')) {
      return
    }

    setComments((items) => items.filter((comment) => comment.id !== commentId))
    setCommentReactions((reactions) => {
      const nextReactions = { ...reactions }
      delete nextReactions[commentId]
      return nextReactions
    })
    setOpenReplyIds((ids) => ids.filter((id) => id !== commentId))
    setOpenCommentMenuId(null)
  }

  const editReply = (commentId: string, replyId: string) => {
    const reply = comments.find((comment) => comment.id === commentId)?.replies.find((item) => item.id === replyId)
    if (!reply) {
      return
    }

    const nextBody = window.prompt('답글을 수정하세요', reply.body)?.trim()
    if (!nextBody) {
      return
    }

    setComments((items) =>
      items.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map((item) => (item.id === replyId ? { ...item, body: nextBody } : item)),
            }
          : comment,
      ),
    )
    setReplyMenuTarget(null)
  }

  const deleteReply = (commentId: string, replyId: string) => {
    const reply = comments.find((comment) => comment.id === commentId)?.replies.find((item) => item.id === replyId)
    if (!reply || !window.confirm('답글을 삭제할까요?')) {
      return
    }

    setComments((items) =>
      items.map((comment) =>
        comment.id === commentId ? { ...comment, replies: comment.replies.filter((item) => item.id !== replyId) } : comment,
      ),
    )
    setReplyMenuTarget(null)
  }

  const openReplyMenu = (commentId: string, replyId?: string) => {
    if (!replyId) {
      return
    }

    setReplyMenuTarget({ commentId, replyId })
  }

  const clearReplyLongPressTimer = () => {
    if (replyLongPressTimer.current) {
      window.clearTimeout(replyLongPressTimer.current)
      replyLongPressTimer.current = null
    }
  }

  return (
    <div className="post_detail_page">
      <article className="post_detail_top">
        <div className="post_detail_icon_box">
          <button className="post_detail_icon_button post_detail_back_button" type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>
            <img src={arrowLeftIcon} alt="" />
          </button>

          <div className="post_detail_icon_right">
            <button className="post_detail_icon_button" type="button" aria-label="알림">
              <img src={bellIcon} alt="" />
            </button>
            <button
              className="post_detail_icon_button"
              type="button"
              aria-label="더보기"
              aria-expanded={openPostMenu}
              onClick={(event) => {
                event.stopPropagation()
                setOpenPostMenu((open) => !open)
                setOpenCommentMenuId(null)
                setReplyMenuTarget(null)
              }}
            >
              <img src={verticalDotIcon} alt="" />
            </button>
            {openPostMenu ? (
              <div className="post_detail_post_menu">
                <button type="button" onClick={(event) => { event.stopPropagation(); editPost() }}>
                  수정
                </button>
                <button type="button" onClick={(event) => { event.stopPropagation(); deletePost() }}>
                  삭제
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="post_detail_content">
          <div className="post_detail_title_group">
            <div className="post_detail_title_top">
              <div className="post_detail_tag_row">
                {post.recommended ? <span className="is_recommended">추천질문</span> : null}
                <span>{post.category.replace('/', ' ')}</span>
              </div>

              <h1>{post.title}</h1>
            </div>

            <div className="post_detail_meta">
              <span>
                <img src={userIcon} alt="" />
                {post.author} · {post.time}
              </span>
              <span>
                <img src={eyeIcon} alt="" />
                {post.views}
              </span>
              <span>
                <img src={chatSmallIcon} alt="" />
                {postCommentCount}
              </span>
            </div>
          </div>

          <p className="post_detail_body">{post.body}</p>
        </div>

        <div className="post_detail_button_box">
          <button
            className={`post_detail_action post_detail_action_good ${postLiked ? 'is_active' : ''}`}
            type="button"
            aria-pressed={postLiked}
            onClick={togglePostLike}
          >
            <img src={goodIcon} alt="" />
            <span>공감</span>
            <strong>{postLikes}</strong>
          </button>

          <button
            className={`post_detail_action post_detail_action_comment ${commentsExpanded ? 'is_active' : ''}`}
            type="button"
            aria-expanded={commentsExpanded}
            onClick={() => setCommentsExpanded((expanded) => !expanded)}
          >
            <img src={commentIcon} alt="" />
            <span>댓글</span>
            <strong>{postCommentCount}</strong>
          </button>

          <button
            className={`post_detail_action post_detail_action_arch ${postBookmarked ? 'is_active' : ''}`}
            type="button"
            aria-pressed={postBookmarked}
            onClick={() => setPostBookmarked((bookmarked) => !bookmarked)}
          >
            <img src={postBookmarked ? bookmarkOnIcon : bookmarkIcon} alt="" />
            <span>스크랩</span>
          </button>
        </div>
      </article>

      <section className="post_detail_comments">
        <h2>댓글 {postCommentCount}</h2>

        <div className="post_detail_comment_list">
          {visibleComments.map((comment) => {
            const commentIndex = comments.findIndex((item) => item.id === comment.id)
            const reaction = commentReactions[comment.id] ?? { liked: false, likes: comment.likes }

            return (
              <article className="post_detail_comment" key={comment.id}>
                <div
                  id={comment.id}
                  className={`post_detail_comment_main ${highlightedItemId === comment.id ? 'is_written_flash' : ''}`}
                >
                  <div className="post_detail_comment_top">
                    <div className="post_detail_comment_left">
                      <span className="post_detail_comment_author">
                        <img src={userIcon} alt="" />
                        {comment.author}
                      </span>
                      {commentIndex === 0 ? <MainTag className="post_detail_comment_best_tag">BEST</MainTag> : null}
                      {comment.author === '새벽달빛' ? <MainTag className="post_detail_comment_staff_tag">운영 스태프</MainTag> : null}
                    </div>

                    <div className="post_detail_comment_right">
                      <button
                        className={`post_detail_comment_icon_action ${reaction.liked ? 'is_active' : ''}`}
                        type="button"
                        aria-label="공감"
                        aria-pressed={reaction.liked}
                        onClick={() => toggleCommentLike(comment.id)}
                      >
                        <img src={goodIcon} alt="" />
                      </button>
                      <button
                        className={`post_detail_comment_icon_action ${openReplyIds.includes(comment.id) ? 'is_active' : ''}`}
                        type="button"
                        aria-label="댓글"
                        aria-pressed={openReplyIds.includes(comment.id)}
                        onClick={() => toggleReplyInput(comment.id)}
                      >
                        <img src={commentIcon} alt="" />
                      </button>
                      <button
                        className="post_detail_comment_more"
                        type="button"
                        aria-label="더보기"
                        aria-expanded={openCommentMenuId === comment.id}
                        onClick={(event) => {
                          event.stopPropagation()
                          setReplyMenuTarget(null)
                          setOpenPostMenu(false)
                          setOpenCommentMenuId((menuId) => (menuId === comment.id ? null : comment.id))
                        }}
                      >
                        <img src={verticalDotIcon} alt="" />
                      </button>
                      {openCommentMenuId === comment.id ? (
                        <div className="post_detail_edit_menu">
                          <button type="button" onClick={(event) => { event.stopPropagation(); editComment(comment.id) }}>
                            수정
                          </button>
                          <button type="button" onClick={(event) => { event.stopPropagation(); deleteComment(comment.id) }}>
                            삭제
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="post_detail_comment_bottom">
                    <p>{comment.body}</p>
                    <div className="post_detail_comment_meta_line">
                      <time dateTime="2026-05-11T14:31">2026.05.11 14:31</time>
                      <span className="post_detail_comment_good_count">
                        <img src={goodIcon} alt="" />
                        <span>{reaction.likes}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {openReplyIds.includes(comment.id)
                  ? comment.replies.map((reply, replyIndex) => {
                      const replyId = reply.id ?? `${comment.id}-reply-${replyIndex}`
                      const replyMenuOpen =
                        replyMenuTarget?.commentId === comment.id && replyMenuTarget.replyId === replyId

                      return (
                      <div
                        id={replyId}
                        className={`post_detail_reply ${highlightedItemId === replyId ? 'is_written_flash' : ''}`}
                        key={replyId}
                        onContextMenu={(event) => {
                          event.preventDefault()
                          openReplyMenu(comment.id, replyId)
                        }}
                        onPointerDown={() => {
                          clearReplyLongPressTimer()
                          replyLongPressTimer.current = window.setTimeout(() => {
                            openReplyMenu(comment.id, replyId)
                          }, 550)
                        }}
                        onPointerLeave={clearReplyLongPressTimer}
                        onPointerUp={clearReplyLongPressTimer}
                      >
                        <div className="post_detail_reply_head">
                          <div className="post_detail_reply_identity">
                            <span className="post_detail_comment_author">
                              <img src={userIcon} alt="" />
                              {reply.author}
                            </span>
                            <span className="post_detail_comment_time">{reply.time}</span>
                          </div>
                          <button
                            className="post_detail_comment_more post_detail_reply_more"
                            type="button"
                            aria-label="더보기"
                            aria-expanded={replyMenuOpen}
                            onClick={(event) => {
                              event.stopPropagation()
                              setOpenCommentMenuId(null)
                              setOpenPostMenu(false)
                              openReplyMenu(comment.id, replyId)
                            }}
                          >
                            <img src={verticalDotIcon} alt="" />
                          </button>
                          {replyMenuOpen ? (
                            <div className="post_detail_reply_menu">
                              <button type="button" onClick={(event) => { event.stopPropagation(); editReply(comment.id, replyId) }}>
                                수정
                              </button>
                              <button type="button" onClick={(event) => { event.stopPropagation(); deleteReply(comment.id, replyId) }}>
                                삭제
                              </button>
                            </div>
                          ) : null}
                        </div>
                        <p>{reply.body}</p>
                      </div>
                      )
                    })
                  : null}

              </article>
            )
          })}
        </div>

        <form
          className="post_detail_comment_input"
          onSubmit={(event) => {
            event.preventDefault()
            submitComment()
          }}
        >
          <div className="post_detail_comment_searchbar">
            <input
              value={commentInput}
              placeholder={hasOpenReply ? '답글을 입력하세요' : '댓글을 입력하세요'}
              onChange={(event) => setCommentInput(event.target.value)}
            />
            <button type="submit" aria-label="보내기">
              <img src={sendIcon} alt="" />
            </button>
          </div>
        </form>
      </section>

      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
