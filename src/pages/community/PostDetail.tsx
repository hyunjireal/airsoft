import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import arrowDownIcon from '../../asset/icons/arrow_down.svg'
import arrowLeftIcon from '../../asset/icons/arrow_l.svg'
import arrowUpIcon from '../../asset/icons/arrow_up.svg'
import bellIcon from '../../asset/icons/com_bell.svg'
import bookmarkIcon from '../../asset/icons/com_bookmark.svg'
import commentIcon from '../../asset/icons/com_comment.svg'
import eyeIcon from '../../asset/icons/com_eyes.svg'
import heartIcon from '../../asset/icons/com_heart.svg'
import sendIcon from '../../asset/icons/com_send.svg'
import userIcon from '../../asset/icons/com_user.svg'
import verticalDotIcon from '../../asset/icons/com_verticalDot.svg'
import './Community.css'

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
  reply,
}: {
  now: number
  onLike: () => void
  onOpenReportSheet: () => void
  onReply: (author: string) => void
  reply: ReplyData
}) {
  const mentionMatch = reply.body.match(/^(@\S+)\s*(.*)$/)

  return (
    <div className="post_detail_reply">
      <div className="post_detail_reply_head">
        <div className="post_detail_reply_head_left">
          <span className="post_detail_comment_author">
            <span className="post_detail_avatar" aria-hidden="true" />
            {reply.author}
          </span>
          <span className="post_detail_comment_time">{getRelativeTime(reply.dateTime, now)}</span>
        </div>
        <button
          className="post_detail_comment_more"
          type="button"
          aria-label="답글 더보기"
          onClick={onOpenReportSheet}
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
  onLikeComment,
  onLikeReply,
  onReplyTo,
}: {
  comment: ThreadCommentData
  expanded: boolean
  mentionTarget: string
  now: number
  onAddReply: (commentId: string, body: string, mentionTarget: string) => void
  onCollapse: () => void
  onExpand: () => void
  onOpenReportSheet: () => void
  onLikeComment: () => void
  onLikeReply: (replyId: string) => void
  onReplyTo: (author: string) => void
}) {
  const [replyInput, setReplyInput] = useState('')
  const visibleReplies = expanded ? comment.replies : comment.replies.slice(0, 1)
  const hiddenReplyCount = Math.max(comment.replies.length - visibleReplies.length, 0)

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
              <span className="post_detail_avatar" aria-hidden="true" />
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
            onClick={onOpenReportSheet}
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
            onReply={() => onReplyTo(comment.author)}
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
              <form className="post_detail_reply_input" onSubmit={submitReply}>
                <span className="post_detail_reply_mention">@{mentionTarget}</span>
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
              onOpenReportSheet={onOpenReportSheet}
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
  const [comments, setComments] = useState(initialComments)
  const [commentInput, setCommentInput] = useState('')
  const [expandedReplyIds, setExpandedReplyIds] = useState<string[]>([])
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null)
  const [mentionTargets, setMentionTargets] = useState<Record<string, string>>({})
  const [now, setNow] = useState(() => Date.now())
  const [postBookmarked, setPostBookmarked] = useState(false)
  const [postLiked, setPostLiked] = useState(false)
  const [postLikeCount, setPostLikeCount] = useState(18)
  const [isReportSheetOpen, setIsReportSheetOpen] = useState(false)

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    if (!isReportSheetOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isReportSheetOpen])

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

  const postCommentCount = comments.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0,
  )

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

  const setReplyTarget = (commentId: string, author: string) => {
    setMentionTargets((targets) => ({ ...targets, [commentId]: author }))
    expandReplies(commentId)
  }

  const togglePostLike = () => {
    setPostLiked((liked) => !liked)
    setPostLikeCount((count) => count + (postLiked ? -1 : 1))
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
      author: '삼삼오오',
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

  const addReply = (commentId: string, body: string, mentionTarget: string) => {
    const { dateTime, time } = formatNow()
    const replyBody = `@${mentionTarget} ${body}`
    const reply: ReplyData = {
      id: `reply-user-${Date.now()}`,
      author: '삼삼오오',
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
  }

  return (
    <div className="post_detail_page">
      <article className="post_detail_top">
        <div className="post_detail_icon_box">
          <button
            className="post_detail_icon_button post_detail_back_button"
            type="button"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
          >
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
              onClick={() => setIsReportSheetOpen(true)}
            >
              <img src={verticalDotIcon} alt="" />
            </button>
          </div>
        </div>

        <div className="post_detail_content">
          <div className="post_detail_title_group">
            <div className="post_detail_title_top">
              <div className="post_detail_tag_row">
                <span className="is_recommended">추천 질문</span>
                <span>법규/규정</span>
              </div>
              <h1>서바이벌 게임에서 꼭 지켜야 할 기본 규칙이 궁금해요!</h1>
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
            onClick={() => setPostBookmarked((bookmarked) => !bookmarked)}
          >
            <span className="post_detail_bookmark_icon" aria-hidden="true">
              <img src={bookmarkIcon} alt="" />
            </span>
            <span>스크랩</span>
          </button>
        </div>
      </article>

      <section className="post_detail_comments" aria-labelledby="post-detail-comments-title">
        <div className="post_detail_comments_head">
          <h2 id="post-detail-comments-title">댓글 {postCommentCount}</h2>
          <form className="post_detail_comment_searchbar" onSubmit={addComment}>
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
              mentionTarget={mentionTargets[comment.id] ?? comment.author}
              now={now}
              onAddReply={addReply}
              onCollapse={() => collapseReplies(comment.id)}
              onExpand={() => expandReplies(comment.id)}
              onOpenReportSheet={() => setIsReportSheetOpen(true)}
              onLikeComment={() => toggleCommentLike(comment.id)}
              onLikeReply={(replyId) => toggleReplyLike(comment.id, replyId)}
              onReplyTo={(author) => setReplyTarget(comment.id, author)}
            />
          ))}
        </div>
      </section>

      {isReportSheetOpen ? (
        <div className="post_detail_report_sheet_layer" role="presentation">
          <button
            className="post_detail_report_sheet_backdrop"
            type="button"
            aria-label="신고 메뉴 닫기"
            onClick={() => setIsReportSheetOpen(false)}
          />
          <div
            className="post_detail_report_sheet"
            role="dialog"
            aria-modal="true"
            aria-label="게시글 신고 메뉴"
          >
            <div className="post_detail_report_sheet_group">
              <button
                className="post_detail_report_sheet_button post_detail_report_sheet_button--danger"
                type="button"
                onClick={() => setIsReportSheetOpen(false)}
              >
                신고하기
              </button>
              <button
                className="post_detail_report_sheet_button"
                type="button"
                onClick={() => setIsReportSheetOpen(false)}
              >
                차단하기
              </button>
            </div>
            <button
              className="post_detail_report_sheet_button post_detail_report_sheet_cancel"
              type="button"
              onClick={() => setIsReportSheetOpen(false)}
            >
              취소
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
