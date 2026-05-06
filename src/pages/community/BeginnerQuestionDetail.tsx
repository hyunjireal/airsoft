import { useState } from 'react'
import './Community.css'
import chatSmallIcon from '../../asset/icons/com_chat02.svg'
import userIcon from '../../asset/icons/com_user.svg'

type Reply = {
  author: string
  time: string
  body: string
}

const comments = [
  {
    id: 'comment-1',
    author: '화가난병아리',
    badge: '베스트 댓글',
    mentor: '베테랑 멘토',
    time: '2시간 전',
    body: '가장 중요한 건 고글을 절대 벗지 않는 거예요. 경기장 안에서는 진행자의 안내를 먼저 듣고, 히트 선언은 크게 말해주세요. 처음이라면 시작 전에 안전거리와 탄속 규정을 꼭 확인하면 좋아요.',
    likes: 24,
    repliesList: [
      {
        author: '화가난병아리',
        time: '2시간 전',
        body: '고글은 정말 계속 착용해야겠네요. 처음 가기 전에 필드 규정도 미리 확인해볼게요.',
      },
    ],
  },
  {
    id: 'comment-2',
    author: '새벽담벗',
    mentor: '운영 스태프',
    time: '45분 전',
    body: '장비를 사용할 때는 항상 상태를 점검하는 게 중요해요. 손잡이나 연결 부위가 느슨하지 않은지 꼭 확인하세요.',
    likes: 15,
    repliesList: [],
  },
  {
    id: 'comment-3',
    author: '바람의노래',
    time: '방금 전',
    body: '경기 중에는 항상 주변을 살피고, 다른 참가자와의 거리를 유지하는 것이 안전사고를 예방하는 데 도움이 돼요.',
    likes: 32,
    repliesList: [],
  },
]

export function BeginnerQuestionDetail() {
  const [postReaction, setPostReaction] = useState<'like' | 'dislike' | null>(null)
  const [postLikes, setPostLikes] = useState(12)
  const [postDislikes, setPostDislikes] = useState(1)
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>(() =>
    Object.fromEntries(comments.map((comment) => [comment.id, comment.likes])),
  )
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>([])
  const [openReplyIds, setOpenReplyIds] = useState<string[]>([])
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({})
  const [commentReplies, setCommentReplies] = useState<Record<string, Reply[]>>(() =>
    Object.fromEntries(comments.map((comment) => [comment.id, comment.repliesList])),
  )

  const totalCommentCount = comments.length + Object.values(commentReplies).reduce((total, replies) => total + replies.length, 0)

  const handlePostReaction = (nextReaction: 'like' | 'dislike') => {
    if (postReaction === nextReaction) {
      setPostReaction(null)
      if (nextReaction === 'like') {
        setPostLikes((count) => count - 1)
      } else {
        setPostDislikes((count) => count - 1)
      }
      return
    }

    if (postReaction === 'like') {
      setPostLikes((count) => count - 1)
    }
    if (postReaction === 'dislike') {
      setPostDislikes((count) => count - 1)
    }

    setPostReaction(nextReaction)
    if (nextReaction === 'like') {
      setPostLikes((count) => count + 1)
    } else {
      setPostDislikes((count) => count + 1)
    }
  }

  const handleCommentLike = (commentId: string) => {
    const isLiked = likedCommentIds.includes(commentId)
    setLikedCommentIds((ids) => (isLiked ? ids.filter((id) => id !== commentId) : [...ids, commentId]))
    setCommentLikes((likes) => ({
      ...likes,
      [commentId]: likes[commentId] + (isLiked ? -1 : 1),
    }))
  }

  const toggleReplyInput = (commentId: string) => {
    setOpenReplyIds((ids) => (ids.includes(commentId) ? ids.filter((id) => id !== commentId) : [...ids, commentId]))
  }

  const submitReply = (commentId: string) => {
    const body = replyInputs[commentId]?.trim()
    if (!body) {
      return
    }

    setCommentReplies((replies) => ({
      ...replies,
      [commentId]: [
        ...replies[commentId],
        {
          author: localStorage.getItem('nickname') || '삼삼오오 유저',
          time: '방금 전',
          body,
        },
      ],
    }))
    setReplyInputs((inputs) => ({ ...inputs, [commentId]: '' }))
    setOpenReplyIds((ids) => (ids.includes(commentId) ? ids : [...ids, commentId]))
  }

  return (
    <div className="beginner_detail_page">
      <article className="beginner_detail_post">
        <div className="beginner_detail_post_content">
          <div className="beginner_question_labels beginner_detail_labels">
            <span className="recommend_label">★ 추천 질문</span>
            <span>법규/규정</span>
          </div>

          <h1>서바이벌 게임에서 꼭 지켜야 할 기본 규칙이 궁금해요!</h1>

          <div className="beginner_question_meta beginner_detail_meta">
            <span>
              <img src={userIcon} alt="" />
              화가난병아리
            </span>
            <span>2시간 전</span>
            <span>
              <span aria-hidden="true">◎</span>
              999+
            </span>
            <span>
              <img src={chatSmallIcon} alt="" />
              567
            </span>
          </div>

          <p className="beginner_detail_body">
            이번 주말에 처음으로 서바이벌 게임에 참여하려고 합니다. 안전장비는 준비했는데, 현장에서 꼭
            지켜야 하는 기본 규칙이나 입문자가 실수하기 쉬운 부분이 궁금해요.
          </p>

          <div className="beginner_reaction_row">
            <button
              className={postReaction === 'like' ? 'active' : undefined}
              type="button"
              aria-pressed={postReaction === 'like'}
              onClick={() => handlePostReaction('like')}
            >
              <span aria-hidden="true">♟</span>
              좋아요 {postLikes}
            </button>
            <button
              className={postReaction === 'dislike' ? 'active' : undefined}
              type="button"
              aria-pressed={postReaction === 'dislike'}
              onClick={() => handlePostReaction('dislike')}
            >
              <span aria-hidden="true">♟</span>
              싫어요 {postDislikes}
            </button>
          </div>
        </div>
      </article>

      <section className="beginner_comments">
        <h2>댓글 {totalCommentCount}</h2>
        <div className="beginner_comment_list">
          {comments.map((comment) => (
            <article className="beginner_comment" key={comment.id}>
              <div className="beginner_comment_head">
                <span className="beginner_comment_author">
                  <img src={userIcon} alt="" />
                  {comment.author}
                </span>
                {comment.badge ? <span className="beginner_comment_badge best">{comment.badge}</span> : null}
                {comment.mentor ? <span className="beginner_comment_badge dark">{comment.mentor}</span> : null}
                <span className="beginner_comment_time">{comment.time}</span>
              </div>
              <p>{comment.body}</p>

              <div className="beginner_comment_actions">
                <button
                  className={likedCommentIds.includes(comment.id) ? 'active' : undefined}
                  type="button"
                  aria-pressed={likedCommentIds.includes(comment.id)}
                  onClick={() => handleCommentLike(comment.id)}
                >
                  <span aria-hidden="true">♥</span>
                  좋아요 {commentLikes[comment.id]}
                </button>
                <button type="button" onClick={() => toggleReplyInput(comment.id)}>
                  답글 {commentReplies[comment.id].length}
                </button>
              </div>

              {openReplyIds.includes(comment.id) ? (
                <>
                  {commentReplies[comment.id].map((reply) => (
                    <div className="beginner_reply" key={`${reply.author}-${reply.time}-${reply.body}`}>
                      <div className="beginner_comment_head">
                        <span className="beginner_comment_author">
                          <img src={userIcon} alt="" />
                          {reply.author}
                        </span>
                        <span className="beginner_comment_time">{reply.time}</span>
                      </div>
                      <p>{reply.body}</p>
                    </div>
                  ))}

                  <div className="beginner_reply_input">
                    <input
                      placeholder="답글을 입력하세요"
                      value={replyInputs[comment.id] ?? ''}
                      onChange={(event) => setReplyInputs((inputs) => ({ ...inputs, [comment.id]: event.target.value }))}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          submitReply(comment.id)
                        }
                      }}
                    />
                    <button type="button" onClick={() => submitReply(comment.id)}>
                      답글 쓰기
                    </button>
                  </div>
                </>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
