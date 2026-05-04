import chatSmallIcon from '../../asset/icons/com_chat02.svg'
import userIcon from '../../asset/icons/com_user.svg'

const comments = [
  {
    author: '화가난병아리',
    badge: '베스트 댓글',
    mentor: '베테랑 멘토',
    time: '2시간 전',
    body: '가장 중요한 건 고글을 절대 벗지 않는 거예요. 경기장 안에서는 진행자의 안내를 먼저 듣고, 히트 선언은 크게 말해주세요. 처음이라면 시작 전에 안전거리와 탄속 규정을 꼭 확인하면 좋아요.',
    likes: 24,
    replies: 1,
    repliesList: [
      {
        author: '화가난병아리',
        time: '2시간 전',
        body: '고글은 정말 계속 착용해야겠네요. 처음 가기 전에 필드 규정도 미리 확인해볼게요.',
      },
    ],
  },
  {
    author: '새벽담벗',
    mentor: '운영 스태프',
    time: '45분 전',
    body: '장비를 사용할 때는 항상 상태를 점검하는 게 중요해요. 손잡이나 연결 부위가 느슨하지 않은지 꼭 확인하세요.',
    likes: 15,
  },
  {
    author: '바람의노래',
    time: '방금 전',
    body: '경기 중에는 항상 주변을 살피고, 다른 참가자와의 거리를 유지하는 것이 안전사고를 예방하는 데 도움이 돼요.',
    likes: 32,
  },
]

export function BeginnerQuestionDetail() {
  return (
    <div className="beginner_detail_page">
      <article className="beginner_detail_post">
        <div className="beginner_status_bar" aria-hidden="true">
          <span>15:00</span>
          <div className="beginner_status_icons">
            <span className="cellular_icon" />
            <span className="wifi_icon" />
            <span className="battery_icon" />
          </div>
        </div>

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
            <button type="button">
              <span aria-hidden="true">♟</span>
              좋아요 12
            </button>
            <button type="button">
              <span aria-hidden="true">♟</span>
              싫어요 1
            </button>
          </div>
        </div>
      </article>

      <section className="beginner_comments">
        <h2>댓글 3</h2>
        <div className="beginner_comment_list">
          {comments.map((comment, index) => (
            <article className="beginner_comment" key={`${comment.author}-${index}`}>
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
                <button type="button">
                  <span aria-hidden="true">♥</span>
                  좋아요 {comment.likes}
                </button>
                {comment.replies ? <button type="button">답글 {comment.replies}</button> : null}
              </div>

              {comment.repliesList?.map((reply) => (
                <div className="beginner_reply" key={`${reply.author}-${reply.body}`}>
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

              {index === 0 ? (
                <div className="beginner_reply_input">
                  <input placeholder="답글을 입력하세요" />
                  <button type="button">답글 쓰기</button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
