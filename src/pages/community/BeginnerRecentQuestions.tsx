import { useNavigate } from 'react-router-dom'
import './Community.css'
import bookmarkIcon from '../../asset/icons/com_bookmark.svg'
import chatSmallIcon from '../../asset/icons/com_chat02.svg'
import userIcon from '../../asset/icons/com_user.svg'

const categoryTabs = ['전체', '법규/규정', '장비추천', '수리/튜닝', '게임/전술']

const recentQuestions = [
  {
    title: '서바이벌 게임에서 꼭 지켜야 할 기본 규칙이 궁금해요!',
    category: '법규/규정',
    author: '화가난병아리',
    time: '2시간 전',
    views: '999+',
    comments: '567',
    recommended: true,
  },
  {
    title: '서바이벌 게임용 장비는 어떻게 안전하게 사용하는 게 좋나요?',
    category: '장비 사용법',
    author: '게임마스터',
    time: '1시간 전',
    views: '150',
    comments: '120',
  },
  {
    title: '초보자를 위한 효과적인 팀 전략이 있나요?',
    category: '전략/전술',
    author: '전략가인호',
    time: '3시간 전',
    views: '320',
    comments: '98',
  },
  {
    title: '서바이벌 게임 중 부상 방지를 위한 주의사항은 무엇인가요?',
    category: '안전 수칙',
    author: '안전지킴이',
    time: '30분 전',
    views: '200',
    comments: '150',
  },
]

export function BeginnerRecentQuestions() {
  const navigate = useNavigate()

  return (
    <div className="beginner_recent_page">
      <div className="beginner_status_bar" aria-hidden="true">
        <span>15:00</span>
        <div className="beginner_status_icons">
          <span className="cellular_icon" />
          <span className="wifi_icon" />
          <span className="battery_icon" />
        </div>
      </div>

      <section className="beginner_recent_content">
        <header className="beginner_recent_header">
          <h1>최근 올라온 질문</h1>
          <p>다른 초보자들의 질문을 보고 도움을 받아보세요</p>
        </header>

        <label className="beginner_search beginner_recent_search" aria-label="검색">
          <span className="beginner_search_icon" aria-hidden="true" />
          <input type="search" placeholder="검색어를 입력하세요" />
        </label>

        <div className="beginner_tab_row beginner_recent_tabs" aria-label="질문 카테고리">
          {categoryTabs.map((tab, index) => (
            <button className={index === 0 ? 'active' : undefined} type="button" key={tab}>
              {tab}
            </button>
          ))}
        </div>

        <div className="beginner_question_list">
          {recentQuestions.map((question) => (
            <article
              className="beginner_question_card beginner_recent_question_card"
              key={question.title}
              onClick={() => navigate('/community/beginner/recent/first')}
            >
              <div className="beginner_question_body">
                <div className="beginner_question_labels">
                  {question.recommended ? <span className="recommend_label">★ 추천 질문</span> : null}
                  <span>{question.category}</span>
                </div>
                <h3>{question.title}</h3>
                <div className="beginner_question_meta">
                  <span>
                    <img src={userIcon} alt="" />
                    {question.author}
                  </span>
                  <span>{question.time}</span>
                  <span>
                    <span aria-hidden="true">◎</span>
                    {question.views}
                  </span>
                  <span>
                    <img src={chatSmallIcon} alt="" />
                    {question.comments}
                  </span>
                </div>
              </div>
              <button
                className="beginner_bookmark"
                type="button"
                aria-label={`${question.title} 저장`}
                onClick={(event) => event.stopPropagation()}
              >
                <img src={bookmarkIcon} alt="" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
