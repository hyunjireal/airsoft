import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import arrowDownIcon from '../../asset/icons/arrow_down.svg'
import arrowUpIcon from '../../asset/icons/arrow_up.svg'
import bellIcon from '../../asset/icons/com_bell.svg'
import bookmarkIcon from '../../asset/icons/com_bookmark.svg'
import bookmarkOnIcon from '../../asset/icons/com_bookmark_on.svg'
import commentIcon from '../../asset/icons/com_comment.svg'
import eyeIcon from '../../asset/icons/com_eyes.svg'
import heartIcon from '../../asset/icons/com_heart.svg'
import sendIcon from '../../asset/icons/com_send.svg'
import userIcon from '../../asset/icons/com_user.svg'
import verticalDotIcon from '../../asset/icons/com_verticalDot.svg'
import mainUser01 from '../../asset/images/main_user01.png'
import mainUser02 from '../../asset/images/main_user02.png'
import mainUser03 from '../../asset/images/main_user03.png'
import mainUser04 from '../../asset/images/main_user04.png'
import mainUser05 from '../../asset/images/main_user05.png'
import { boardPosts } from '../../data/mockData'
import { generalPosts } from './BoardList'
import { recentQuestions } from './BeginnerBoard'
import { readCommunityBookmarks, toggleCommunityBookmark } from './communityBookmarkStore'
import './Community.css'

const PROFILE_IMAGE_KEY = 'airsoft:home-profile-image'
const NICKNAME_KEY = 'nickname'

const getInitialProfileImage = () => {
  if (typeof window === 'undefined') {
    return mainUser01
  }

  return localStorage.getItem(PROFILE_IMAGE_KEY) || mainUser01
}

const commentAvatarById: Record<string, string> = {
  'comment-best': mainUser02,
  'comment-staff': mainUser03,
  'comment-no-reply': mainUser04,
}

const replyAvatarById: Record<string, string> = {
  'reply-best-1': mainUser03,
  'reply-best-2': mainUser04,
  'reply-staff-1': mainUser05,
}

const getThreadAvatar = (
  id: string,
  fallbackAvatars: Record<string, string>,
  profileImage: string,
) => {
  if (isUserThreadItem(id)) {
    return profileImage
  }

  return fallbackAvatars[id] || mainUser05
}

const isUserThreadItem = (id: string) =>
  id.startsWith('comment-user-') || id.startsWith('reply-user-')

type ReplyData = {
  id: string
  author: string
  time: string
  dateTime: string
  body: string
  likeCount: number
  liked?: boolean
}

type ThreadCommentData = {
  id: string
  author: string
  badge?: string
  time: string
  dateTime: string
  body: string
  likeCount: number
  liked?: boolean
  replies: ReplyData[]
}

const initialComments: ThreadCommentData[] = [
  {
    id: 'comment-best',
    author: '화가난뼝아리',
    badge: 'BEST',
    time: '2026.05.11 14:31',
    dateTime: '2026-05-11T14:31',
    body: '처음 가기 전에는 안전거리와 필드 규정을 미리 확인해두는 게 제일 좋아요. 보호장비는 꼭 착용하고, 진행자 안내가 나오면 바로 따라가면 됩니다.',
    likeCount: 17,
    replies: [
      {
        id: 'reply-best-1',
        author: '초보전술러',
        time: '2026.05.11 14:36',
        dateTime: '2026-05-11T14:36',
        body: '고글은 정말 계속 착용해야겠네요. 처음 가기 전에 규정부터 다시 읽어볼게요.',
        likeCount: 9,
      },
      {
        id: 'reply-best-2',
        author: '필드메이트',
        time: '2026.05.11 14:42',
        dateTime: '2026-05-11T14:42',
        body: '입장 동선이랑 세이프티존 위치도 먼저 물어보면 훨씬 편해요.',
        likeCount: 6,
      },
    ],
  },
  {
    id: 'comment-staff',
    author: '새벽달빛',
    badge: '운영 스태프',
    time: '2026.05.11 15:04',
    dateTime: '2026-05-11T15:04',
    body: '렌탈 장비를 쓰는 날에는 시작 전에 탄창 상태와 연결 부위를 확인해보세요. 이상하면 바로 운영진에게 말하면 됩니다.',
    likeCount: 12,
    replies: [
      {
        id: 'reply-staff-1',
        author: '렌탈러너',
        time: '2026.05.11 15:12',
        dateTime: '2026-05-11T15:12',
        body: '렌탈 장비는 시작 전에 한번 더 확인해달라고 요청하면 되겠죠?',
        likeCount: 5,
      },
    ],
  },
  {
    id: 'comment-no-reply',
    author: '바람의노래',
    time: '2026.05.11 15:21',
    dateTime: '2026-05-11T15:21',
    body: '경기 중에는 주변 사람과의 거리부터 보는 습관이 제일 중요하더라고요.',
    likeCount: 9,
    replies: [],
  },
]

const formatNow = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  const time = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
  return { time, dateTime: now.toISOString() }
}

const getRelativeTime = (dateTime: string, now: number) => {
  const targetTime = new Date(dateTime).getTime()
  const diffMinutes = Math.max(0, Math.floor((now - targetTime) / 60000))

  if (diffMinutes < 1) return '방금 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}시간 전`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}일 전`

  const date = new Date(dateTime)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
}

const postDateTime = '2026-05-11T14:31'
const BASE_POST_LIKE_COUNT = 18
const POST_AUTHOR_NAME = '화가난뼝아리'
const DEFAULT_CURRENT_USER_NAME = '삼삼오오'

const getCurrentUserName = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_CURRENT_USER_NAME
  }

  return localStorage.getItem(NICKNAME_KEY) || DEFAULT_CURRENT_USER_NAME
}

const parseCount = (value: string | number | undefined) => {
  if (typeof value === 'number') {
    return value
  }

  if (!value) {
    return 0
  }

  const count = Number(value.replace(/[^\d]/g, ''))

  return Number.isFinite(count) ? count : 0
}

const defaultPostBody =
  '이번 주말에 처음으로 에어소프트 게임에 참여하려고 합니다. 안전장비는 준비했는데, 현장에서 꼭 지켜야 하는 기본 규칙이나 입문자가 실수하기 쉬운 부분이 궁금해요.'

const detailBodyRules = [
  {
    patterns: ['장비', '고글', '배터리', '파우치', '체스트리그', '튜닝'],
    body: (title: string) =>
      `${title}\n\n처음 장비를 고를 때는 멋보다 안전성과 착용감을 먼저 보는 게 좋습니다. 고글은 얼굴에 뜨는 곳이 없는지, 파우치나 체스트리그는 뛰거나 엎드릴 때 흔들리지 않는지 확인해보세요.\n\n이미 사용 중인 장비가 있다면 브랜드보다 필드에서 오래 착용했을 때 불편한 지점이 있는지 적어주시면 더 정확한 추천을 받을 수 있습니다.`,
  },
  {
    patterns: ['규칙', '법규', '안전', '보호', '탄속', '브리핑'],
    body: (title: string) =>
      `${title}\n\n입문자라면 게임 시작 전 브리핑에서 안전 규칙을 한 번 더 확인하는 것이 가장 중요합니다. 고글은 세이프존을 제외하고 벗지 않고, 총구 방향과 격발 가능 구역을 계속 의식하는 습관을 들이면 좋습니다.\n\n필드마다 세부 규정이 조금씩 다르니 방문 전 공지와 현장 안내를 함께 확인해보세요.`,
  },
  {
    patterns: ['전술', '근거리', '교전', '엄폐', '히트', '게임'],
    body: (title: string) =>
      `${title}\n\n초보자는 빠르게 움직이는 것보다 안전하게 위치를 잡고 주변 소리를 듣는 것이 더 도움이 됩니다. 교전 중에는 팀원 위치와 엄폐물을 먼저 확인하고, 히트 판정이 애매하다면 넉넉하게 인정하는 편이 분위기도 좋습니다.\n\n익숙해지기 전까지는 한두 가지 역할만 정해서 반복해보면 게임 흐름을 훨씬 빨리 파악할 수 있어요.`,
  },
  {
    patterns: ['매너', '소리', '신고', '맞았', '아웃', '대기'],
    body: (title: string) =>
      `${title}\n\n필드 매너는 복잡한 기술보다 서로가 즐겁게 게임할 수 있게 만드는 기본 약속에 가깝습니다. 맞았다고 느껴지면 바로 콜하고, 모호한 상황에서는 운영진에게 차분히 확인하는 편이 좋습니다.\n\n처음 방문한 필드라면 단골 유저나 진행자의 안내를 따라가면서 분위기를 익히는 것을 추천합니다.`,
  },
  {
    patterns: ['모집', '같이', '팀', '멤버', '참여', '주말'],
    body: (title: string) =>
      `${title}\n\n함께 게임할 사람을 찾는 글이라면 날짜, 지역, 이동 방식, 장비 대여 가능 여부를 먼저 적어두면 참여자가 훨씬 빠르게 판단할 수 있습니다.\n\n초보 참여가 가능한지, 게임 난이도나 분위기가 어떤지도 함께 공유하면 처음 오는 사람도 부담 없이 연락할 수 있어요.`,
  },
  {
    patterns: ['후기', '방문', '필드', 'CQB', '야외', '실내'],
    body: (title: string) =>
      `${title}\n\n필드 후기는 이동 동선, 세이프존 편의성, 진행 방식, 초보자 배려 여부를 함께 보면 좋습니다. 사진이나 짧은 상황 설명이 있으면 다음 방문을 고민하는 유저에게 큰 도움이 됩니다.\n\n좋았던 점뿐 아니라 처음 가는 사람이 미리 알면 좋은 주의사항도 함께 남겨주세요.`,
  },
  {
    patterns: ['이벤트', '할인', '행사', '공지'],
    body: (title: string) =>
      `${title}\n\n이벤트나 공지 글은 참여 조건과 기간, 준비물을 먼저 확인하는 것이 좋습니다. 특히 장비 지참 여부, 신청 마감 시간, 현장 결제 가능 여부처럼 놓치기 쉬운 정보를 체크해보세요.\n\n참여해본 분들의 추가 팁이 있다면 댓글로 함께 남겨주시면 좋아요.`,
  },
]

const createLinkedPostBody = (title: string, category: string) => {
  const targetText = `${title} ${category}`
  const matchedRule = detailBodyRules.find((rule) =>
    rule.patterns.some((pattern) => targetText.includes(pattern)),
  )

  if (matchedRule) {
    return matchedRule.body(title)
  }

  return `${title}\n\n${category} 주제로 올라온 커뮤니티 글입니다. 글의 상황이나 궁금한 점을 조금 더 자세히 적어두면 같은 경험을 가진 유저들이 더 구체적으로 답변하기 좋아요.\n\n관련 장비, 방문한 필드, 게임 날짜처럼 맥락이 되는 정보를 함께 남기면 댓글 흐름도 자연스럽게 이어집니다.`
}

const getLinkedPostDetail = (postId?: string) => {
  const beginnerQuestion = recentQuestions.find((question) => question.id === postId)

  if (beginnerQuestion) {
    return {
      id: beginnerQuestion.id,
      title: beginnerQuestion.title,
      category: beginnerQuestion.category,
      author: beginnerQuestion.author,
      createdAt: beginnerQuestion.time,
      views: beginnerQuestion.views,
      commentsCount: parseCount(beginnerQuestion.comments),
      body: beginnerQuestion.id === 'q-001'
        ? defaultPostBody
        : createLinkedPostBody(beginnerQuestion.title, beginnerQuestion.category),
      recommended: beginnerQuestion.recommended,
    }
  }

  const generalPost = generalPosts.find((post) => post.id === postId)

  if (generalPost) {
    return {
      id: generalPost.id,
      title: generalPost.title,
      category: generalPost.category,
      author: generalPost.author,
      createdAt: generalPost.createdAt,
      views: generalPost.views,
      commentsCount: generalPost.commentsCount,
      body: createLinkedPostBody(generalPost.title, generalPost.category),
      recommended: false,
    }
  }

  const boardPost = boardPosts.find((post) => post.id === postId)

  if (boardPost) {
    return {
      id: boardPost.id,
      title: boardPost.title,
      category: boardPost.category || boardPost.tags[0] || '커뮤니티',
      author: boardPost.author,
      createdAt: boardPost.createdAt,
      views: 320,
      commentsCount: boardPost.commentsCount,
      body: boardPost.content,
      recommended: boardPost.isBeginnerQuestion,
    }
  }

  return {
    id: 'q-001',
    title: recentQuestions[0]?.title || '초보 질문방 게시글',
    category: recentQuestions[0]?.category || '법규/규정',
    author: recentQuestions[0]?.author || POST_AUTHOR_NAME,
    createdAt: getRelativeTime(postDateTime, Date.now()),
    views: recentQuestions[0]?.views || '999+',
    commentsCount: parseCount(recentQuestions[0]?.comments),
    body: defaultPostBody,
    recommended: true,
  }
}

function CommentMeta({
  count,
  dateTime,
  label,
  liked,
  onLike,
  onReply,
  now,
}: {
  count: number
  dateTime: string
  label?: string
  liked?: boolean
  now: number
  onLike?: () => void
  onReply?: () => void
}) {
  return (
    <div className="post_detail_comment_meta_line">
      <div className="post_detail_comment_meta_left">
        <time dateTime={dateTime}>{getRelativeTime(dateTime, now)}</time>
        <button
          className={`post_detail_comment_good_count ${liked ? 'is_active' : ''}`}
          type="button"
          onClick={onLike}
        >
          <img src={heartIcon} alt="" />
          <span>{count}</span>
        </button>
      </div>
      {label ? (
        <button className="post_detail_reply_label" type="button" onClick={onReply}>
          {label}
        </button>
      ) : null}
    </div>
  )
}

function ReplyItem({
  now,
  onLike,
  onOpenReportSheet,
  onReply,
  currentUserName,
  profileImage,
  reply,
}: {
  now: number
  onLike: () => void
  onOpenReportSheet: (canManage: boolean) => void
  onReply: (author: string) => void
  currentUserName: string
  profileImage: string
  reply: ReplyData
}) {
  const mentionMatch = reply.body.match(/^(@\S+)\s*(.*)$/)
  const avatarSrc = getThreadAvatar(reply.id, replyAvatarById, profileImage)
  const avatarClassName = `post_detail_avatar ${isUserThreadItem(reply.id) ? 'is_user_profile' : 'is_default_profile'}`
  const isReplyOwner = isUserThreadItem(reply.id) || reply.author === currentUserName

  return (
    <div className="post_detail_reply" data-reply-id={reply.id}>
      <div className="post_detail_reply_head">
        <div className="post_detail_reply_head_left">
          <span className="post_detail_comment_author">
            <span className="post_detail_avatar_frame" aria-hidden="true">
              <img className={avatarClassName} src={avatarSrc} alt="" />
            </span>
            {reply.author}
          </span>
          <span className="post_detail_comment_time">{getRelativeTime(reply.dateTime, now)}</span>
        </div>
        <button
          className="post_detail_comment_more"
          type="button"
          aria-label="답글 더보기"
          onClick={() => onOpenReportSheet(isReplyOwner)}
        >
          <img src={verticalDotIcon} alt="" />
        </button>
      </div>
      <p>
        {mentionMatch ? (
          <>
            <span className="post_detail_reply_mention">{mentionMatch[1]}</span>
            {mentionMatch[2] ? ` ${mentionMatch[2]}` : ''}
          </>
        ) : (
          reply.body
        )}
      </p>
      <CommentMeta
        count={reply.likeCount}
        dateTime={reply.dateTime}
        label="답글쓰기"
        liked={reply.liked}
        now={now}
        onLike={onLike}
        onReply={() => onReply(reply.author)}
      />
    </div>
  )
}

function ThreadComment({
  comment,
  expanded,
  mentionTarget,
  now,
  onAddReply,
  onCollapse,
  onExpand,
  onOpenReportSheet,
  currentUserName,
  profileImage,
  onLikeComment,
  onLikeReply,
  onReplyTo,
}: {
  comment: ThreadCommentData
  expanded: boolean
  mentionTarget?: string
  now: number
  onAddReply: (commentId: string, body: string, mentionTarget?: string) => void
  onCollapse: () => void
  onExpand: () => void
  onOpenReportSheet: (canManage: boolean) => void
  currentUserName: string
  profileImage: string
  onLikeComment: () => void
  onLikeReply: (replyId: string) => void
  onReplyTo: (author: string) => void
}) {
  const [replyInput, setReplyInput] = useState('')
  const visibleReplies = expanded ? comment.replies : comment.replies.slice(0, 1)
  const hiddenReplyCount = Math.max(comment.replies.length - visibleReplies.length, 0)
  const avatarSrc = getThreadAvatar(comment.id, commentAvatarById, profileImage)
  const avatarClassName = `post_detail_avatar ${isUserThreadItem(comment.id) ? 'is_user_profile' : 'is_default_profile'}`
  const isCommentOwner = isUserThreadItem(comment.id) || comment.author === currentUserName

  const submitReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = replyInput.trim()
    if (!body) return
    onAddReply(comment.id, body, mentionTarget)
    setReplyInput('')
  }

  return (
    <article
      className="post_detail_comment is_best"
      data-comment-id={comment.id}
    >
      <div className="post_detail_comment_main">
        <div className="post_detail_comment_top">
          <div className="post_detail_comment_left">
            <span className="post_detail_comment_author">
              <span className="post_detail_avatar_frame" aria-hidden="true">
                <img className={avatarClassName} src={avatarSrc} alt="" />
              </span>
              {comment.author}
            </span>
            {comment.badge ? (
              <span
                className={
                  comment.badge === 'BEST'
                    ? 'post_detail_comment_best_tag'
                    : 'post_detail_comment_staff_tag'
                }
              >
                {comment.badge}
              </span>
            ) : null}
          </div>
          <button
            className="post_detail_comment_more"
            type="button"
            aria-label="댓글 더보기"
            onClick={() => onOpenReportSheet(isCommentOwner)}
          >
            <img src={verticalDotIcon} alt="" />
          </button>
        </div>

        <div className="post_detail_comment_bottom">
          <p>{comment.body}</p>
          <CommentMeta
            count={comment.likeCount}
            dateTime={comment.dateTime}
            label="답글쓰기"
            liked={comment.liked}
            now={now}
            onLike={onLikeComment}
            onReply={() => onReplyTo('')}
          />
        </div>
      </div>

      {comment.replies.length > 0 || expanded ? (
        <div className={`post_detail_reply_box ${expanded ? 'is_expanded' : 'is_collapsed'}`}>
          {expanded ? (
            <>
              <button className="post_detail_reply_close_button" type="button" onClick={onCollapse}>
                <span>답글 닫기</span>
                <img src={arrowUpIcon} alt="" />
              </button>
              <form
                className="post_detail_reply_input"
                data-reply-input-id={comment.id}
                onSubmit={submitReply}
              >
                <span className="post_detail_reply_composer_profile">
                  <span className="post_detail_avatar_frame post_detail_composer_avatar" aria-hidden="true">
                    <img className="post_detail_avatar is_user_profile" src={profileImage} alt="" />
                  </span>
                  <span>{currentUserName}</span>
                </span>
                {mentionTarget ? (
                  <span className="post_detail_reply_mention">@{mentionTarget}</span>
                ) : null}
                <input
                  value={replyInput}
                  placeholder="답글을 달아보세요."
                  onChange={(event) => setReplyInput(event.target.value)}
                />
                <button type="submit" aria-label="답글 보내기">
                  <img src={sendIcon} alt="" />
                </button>
              </form>
            </>
          ) : null}

          {visibleReplies.map((reply) => (
            <ReplyItem
              key={reply.id}
              now={now}
              currentUserName={currentUserName}
              onOpenReportSheet={onOpenReportSheet}
              profileImage={profileImage}
              reply={reply}
              onLike={() => onLikeReply(reply.id)}
              onReply={(author) => onReplyTo(author)}
            />
          ))}

          {!expanded && hiddenReplyCount > 0 ? (
            <button className="post_detail_reply_more_button" type="button" onClick={onExpand}>
              <span>답글 {hiddenReplyCount}개 더보기</span>
              <img src={arrowDownIcon} alt="" />
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

export function PostDetail() {
  const navigate = useNavigate()
  const { id: postId } = useParams()
  const linkedPost = getLinkedPostDetail(postId)
  const [comments, setComments] = useState(initialComments)
  const [commentInput, setCommentInput] = useState('')
  const [expandedReplyIds, setExpandedReplyIds] = useState<string[]>([])
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null)
  const [highlightedReplyId, setHighlightedReplyId] = useState<string | null>(null)
  const [focusedReplyInputId, setFocusedReplyInputId] = useState<string | null>(null)
  const [mentionTargets, setMentionTargets] = useState<Record<string, string>>({})
  const [now, setNow] = useState(() => Date.now())
  const [postBookmarked, setPostBookmarked] = useState(() =>
    readCommunityBookmarks().has(linkedPost.id),
  )
  const [postLiked, setPostLiked] = useState(false)
  const [reportSheetTarget, setReportSheetTarget] = useState<{ canManage: boolean } | null>(null)
  const [profileImage, setProfileImage] = useState(getInitialProfileImage)
  const [currentUserName, setCurrentUserName] = useState(getCurrentUserName)

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    setPostBookmarked(readCommunityBookmarks().has(linkedPost.id))
  }, [linkedPost.id])

  useEffect(() => {
    const syncUserProfile = (event: StorageEvent) => {
      if (event.key === PROFILE_IMAGE_KEY) {
        setProfileImage(event.newValue || mainUser01)
      } else if (event.key === NICKNAME_KEY) {
        setCurrentUserName(event.newValue || DEFAULT_CURRENT_USER_NAME)
      }
    }

    const syncUserProfileOnFocus = () => {
      setProfileImage(localStorage.getItem(PROFILE_IMAGE_KEY) || mainUser01)
      setCurrentUserName(getCurrentUserName())
    }

    window.addEventListener('storage', syncUserProfile)
    window.addEventListener('focus', syncUserProfileOnFocus)

    return () => {
      window.removeEventListener('storage', syncUserProfile)
      window.removeEventListener('focus', syncUserProfileOnFocus)
    }
  }, [])

  useEffect(() => {
    if (!highlightedCommentId) return

    const scrollTimerId = window.setTimeout(() => {
      const commentElement = document.querySelector<HTMLElement>(
        `[data-comment-id="${highlightedCommentId}"]`,
      )
      commentElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)

    const clearTimerId = window.setTimeout(() => {
      setHighlightedCommentId((currentId) =>
        currentId === highlightedCommentId ? null : currentId,
      )
    }, 1800)

    return () => {
      window.clearTimeout(scrollTimerId)
      window.clearTimeout(clearTimerId)
    }
  }, [highlightedCommentId])

  useEffect(() => {
    if (!highlightedReplyId) return

    const scrollTimerId = window.setTimeout(() => {
      const replyElement = document.querySelector<HTMLElement>(
        `[data-reply-id="${highlightedReplyId}"]`,
      )
      replyElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)

    const clearTimerId = window.setTimeout(() => {
      setHighlightedReplyId((currentId) =>
        currentId === highlightedReplyId ? null : currentId,
      )
    }, 1800)

    return () => {
      window.clearTimeout(scrollTimerId)
      window.clearTimeout(clearTimerId)
    }
  }, [highlightedReplyId])

  useEffect(() => {
    if (!focusedReplyInputId) return

    const scrollTimerId = window.setTimeout(() => {
      const replyInputElement = document.querySelector<HTMLElement>(
        `[data-reply-input-id="${focusedReplyInputId}"]`,
      )
      replyInputElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)

    const focusTimerId = window.setTimeout(() => {
      const replyInput = document.querySelector<HTMLInputElement>(
        `[data-reply-input-id="${focusedReplyInputId}"] input`,
      )
      replyInput?.focus({ preventScroll: true })
    }, 220)

    const clearTimerId = window.setTimeout(() => {
      setFocusedReplyInputId((currentId) =>
        currentId === focusedReplyInputId ? null : currentId,
      )
    }, 800)

    return () => {
      window.clearTimeout(scrollTimerId)
      window.clearTimeout(focusTimerId)
      window.clearTimeout(clearTimerId)
    }
  }, [focusedReplyInputId])

  const postCommentCount = comments.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0,
  )
  const postLikeCount = BASE_POST_LIKE_COUNT + (postLiked ? 1 : 0)
  const isPostOwner = currentUserName === linkedPost.author

  const topLikedComment = comments.reduce<ThreadCommentData | null>((topComment, comment) => {
    if (!topComment) return comment
    if (comment.likeCount > topComment.likeCount) return comment
    return topComment
  }, null)

  const sortedComments = topLikedComment
    ? [
        topLikedComment,
        ...comments
          .filter((comment) => comment.id !== topLikedComment.id)
          .sort(
            (firstComment, secondComment) =>
              new Date(firstComment.dateTime).getTime() -
              new Date(secondComment.dateTime).getTime(),
          ),
      ]
    : []

  const expandReplies = (commentId: string) => {
    setExpandedReplyIds((ids) => (ids.includes(commentId) ? ids : [...ids, commentId]))
  }

  const collapseReplies = (commentId: string) => {
    setExpandedReplyIds((ids) => ids.filter((id) => id !== commentId))
  }

  const setReplyTarget = (commentId: string, author?: string) => {
    setMentionTargets((targets) => {
      if (!author) {
        const { [commentId]: _removedTarget, ...nextTargets } = targets
        return nextTargets
      }

      return { ...targets, [commentId]: author }
    })
    expandReplies(commentId)
    setFocusedReplyInputId(commentId)
  }

  const togglePostLike = () => {
    setPostLiked((liked) => !liked)
  }

  const togglePostBookmark = () => {
    const nextBookmarks = toggleCommunityBookmark(linkedPost.id)
    setPostBookmarked(nextBookmarks.has(linkedPost.id))
  }

  const toggleCommentLike = (commentId: string) => {
    setComments((items) =>
      items.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              liked: !comment.liked,
              likeCount: comment.likeCount + (comment.liked ? -1 : 1),
            }
          : comment,
      ),
    )
  }

  const toggleReplyLike = (commentId: string, replyId: string) => {
    setComments((items) =>
      items.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === replyId
                  ? {
                      ...reply,
                      liked: !reply.liked,
                      likeCount: reply.likeCount + (reply.liked ? -1 : 1),
                    }
                  : reply,
              ),
            }
          : comment,
      ),
    )
  }

  const addComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = commentInput.trim()
    if (!body) return
    const { dateTime, time } = formatNow()
    const nextComment: ThreadCommentData = {
      id: `comment-user-${Date.now()}`,
      author: currentUserName,
      time,
      dateTime,
      body,
      likeCount: 0,
      replies: [],
    }
    setComments((items) => [...items, nextComment])
    setHighlightedCommentId(nextComment.id)
    setCommentInput('')
  }

  const addReply = (commentId: string, body: string, mentionTarget?: string) => {
    const { dateTime, time } = formatNow()
    const replyBody = mentionTarget ? `@${mentionTarget} ${body}` : body
    const reply: ReplyData = {
      id: `reply-user-${Date.now()}`,
      author: currentUserName,
      time,
      dateTime,
      body: replyBody,
      likeCount: 0,
    }
    setComments((items) =>
      items.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment,
      ),
    )
    expandReplies(commentId)
    setHighlightedReplyId(reply.id)
  }

  return (
    <div className="post_detail_page">
      <PageHeader
        className="post_detail_header"
        backButtonClassName="post_detail_header_back"
        layout="standard"
        title="글 상세"
        titleClassName="post_detail_header_title"
        onBack={() => navigate(-1)}
        rightSlot={(
          <div className="post_detail_icon_right">
            <button className="post_detail_icon_button" type="button" aria-label="알림">
              <img src={bellIcon} alt="" />
            </button>
            <button
              className="post_detail_icon_button"
              type="button"
              aria-label="더보기"
              onClick={() => setReportSheetTarget({ canManage: isPostOwner })}
            >
              <img src={verticalDotIcon} alt="" />
            </button>
          </div>
        )}
      />

      <article className="post_detail_top">
        <div className="post_detail_content">
          <div className="post_detail_title_group">
            <div className="post_detail_title_top">
              <div className="post_detail_tag_row">
                {linkedPost.recommended ? <span className="is_recommended">추천 질문</span> : null}
                <span>{linkedPost.category}</span>
              </div>
              <h1>{linkedPost.title}</h1>
            </div>
            <div className="post_detail_title_top">
              <div className="post_detail_tag_row">
                <span className="is_recommended">추천 질문</span>
                <span>법규/규정</span>
              </div>
              <h1>서바이벌 게임에서 꼭 지켜야 할 기본 규칙이 궁금해요!</h1>
            </div>

            <div className="post_detail_meta post_detail_meta--linked">
              <span>
                <img src={userIcon} alt="" />
                {linkedPost.author} · {linkedPost.createdAt}
              </span>
              <span>
                <img src={eyeIcon} alt="" />
                {linkedPost.views}
              </span>
              <span>
                <img src={commentIcon} alt="" />
                {postCommentCount}
              </span>
            </div>

            <div className="post_detail_meta">
              <span>
                <img src={userIcon} alt="" />
                화가난뼝아리 · {getRelativeTime(postDateTime, now)}
              </span>
              <span>
                <img src={eyeIcon} alt="" />
                999+
              </span>
              <span>
                <img src={commentIcon} alt="" />
                {postCommentCount}
              </span>
            </div>
          </div>

          <p className="post_detail_body post_detail_body--linked">{linkedPost.body}</p>
          <p className="post_detail_body">
            이번 주말에 처음으로 서바이벌 게임에 참여하려고 합니다. 안전장비는 준비했는데,
            현장에서 꼭 지켜야 하는 기본 규칙이나 입문자가 실수하기 쉬운 부분이 궁금해요.
          </p>
        </div>

        <div className="post_detail_button_box">
          <button
            className={`post_detail_action post_detail_action_good ${postLiked ? 'is_active' : ''}`}
            type="button"
            onClick={togglePostLike}
          >
            <img src={heartIcon} alt="" />
            <span>공감</span>
            <strong>{postLikeCount}</strong>
          </button>
          <div className="post_detail_action post_detail_action_comment">
            <img src={commentIcon} alt="" />
            <span>댓글</span>
            <strong>{postCommentCount}</strong>
          </div>
          <button
            className={`post_detail_action post_detail_action_arch ${postBookmarked ? 'is_active' : ''}`}
            type="button"
            onClick={togglePostBookmark}
          >
            <span className="post_detail_bookmark_icon" aria-hidden="true">
              <img src={postBookmarked ? bookmarkOnIcon : bookmarkIcon} alt="" />
            </span>
            <span>스크랩</span>
          </button>
        </div>
      </article>

      <section className="post_detail_comments" aria-labelledby="post-detail-comments-title">
        <div className="post_detail_comments_head">
          <h2 id="post-detail-comments-title">댓글 {postCommentCount}</h2>
          <form className="post_detail_comment_searchbar" onSubmit={addComment}>
            <span className="post_detail_comment_composer_profile">
              <span className="post_detail_avatar_frame post_detail_composer_avatar" aria-hidden="true">
                <img className="post_detail_avatar is_user_profile" src={profileImage} alt="" />
              </span>
              <span>{currentUserName}</span>
            </span>
            <input
              value={commentInput}
              placeholder="댓글을 달아보세요."
              onChange={(event) => setCommentInput(event.target.value)}
            />
            <button type="submit" aria-label="댓글 보내기">
              <img src={sendIcon} alt="" />
            </button>
          </form>
        </div>

        <div className="post_detail_comment_list">
          {sortedComments.map((comment) => (
            <ThreadComment
              comment={comment}
              expanded={expandedReplyIds.includes(comment.id)}
              key={comment.id}
              mentionTarget={mentionTargets[comment.id]}
              now={now}
              onAddReply={addReply}
              onCollapse={() => collapseReplies(comment.id)}
              onExpand={() => expandReplies(comment.id)}
              onOpenReportSheet={(canManage) => setReportSheetTarget({ canManage })}
              currentUserName={currentUserName}
              profileImage={profileImage}
              onLikeComment={() => toggleCommentLike(comment.id)}
              onLikeReply={(replyId) => toggleReplyLike(comment.id, replyId)}
              onReplyTo={(author) => setReplyTarget(comment.id, author)}
            />
          ))}
        </div>
      </section>

      {reportSheetTarget ? (
        <div className="post_detail_report_sheet_layer" role="presentation">
          <button
            className="post_detail_report_sheet_backdrop"
            type="button"
            aria-label="신고 메뉴 닫기"
            onClick={() => setReportSheetTarget(null)}
          />
          <div
            className="post_detail_report_sheet"
            role="dialog"
            aria-modal="true"
            aria-label="게시글 신고 메뉴"
          >
            <div className="post_detail_report_sheet_group">
              {reportSheetTarget.canManage ? (
                <>
                  <button
                    className="post_detail_report_sheet_button post_detail_report_sheet_button--edit"
                    type="button"
                    onClick={() => setReportSheetTarget(null)}
                  >
                    수정하기
                  </button>
                  <button
                    className="post_detail_report_sheet_button post_detail_report_sheet_button--danger"
                    type="button"
                    onClick={() => setReportSheetTarget(null)}
                  >
                    삭제하기
                  </button>
                </>
              ) : null}
              <button
                className="post_detail_report_sheet_button"
                type="button"
                onClick={() => setReportSheetTarget(null)}
              >
                차단하기
              </button>
            </div>
            <button
              className="post_detail_report_sheet_button post_detail_report_sheet_cancel"
              type="button"
              onClick={() => setReportSheetTarget(null)}
            >
              취소
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
