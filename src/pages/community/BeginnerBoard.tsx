import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import arrowIcon from '../../asset/icons/arrow_r.svg'
import bookIcon from '../../asset/icons/com_book.svg'
import bookmarkIcon from '../../asset/icons/com_bookmark.svg'
import chatIcon from '../../asset/icons/com_chat.svg'
import chatSmallIcon from '../../asset/icons/com_chat02.svg'
import userIcon from '../../asset/icons/com_user.svg'
import beginnerCharacter from '../../asset/images/com_beginner_char01.png'
import communityHero from '../../asset/images/com_main01.jpg'
import { RequireLoginModal } from '../../layout/RequireLoginModal'

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

export function BeginnerBoard() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  const handleWrite = () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      setModalOpen(true)
      return
    }

    navigate('/community/post/create')
  }

  return (
    <div className="beginner_board_page">
      <section className="beginner_hero" aria-label="초보 질문방 소개">
        <img className="beginner_hero_bg" src={communityHero} alt="" />
        <div className="beginner_hero_overlay" />

        <div className="beginner_hero_content">
          <h1>초보 질문방</h1>
          <span className="beginner_hero_badge">
            <span aria-hidden="true">♡</span>
            입문자 전용 Q&amp;A
          </span>

          <div className="beginner_speech_bubble">
            <p>눈치 보지 말고 마음껏 물어보세요!</p>
            <p>입문자만 질문할 수 있고,</p>
            <p>베테랑 멘토들이 다정하게</p>
            <p>답해주는 안전한 공간이에요.</p>
          </div>

          <img className="beginner_character" src={beginnerCharacter} alt="초보 질문방 캐릭터" />

          <label className="beginner_search" aria-label="검색">
            <span className="beginner_search_icon" aria-hidden="true" />
            <input type="search" placeholder="검색어를 입력하세요" />
          </label>

          <div className="beginner_hashtags" aria-label="추천 태그">
            <button type="button">#법규/규정</button>
            <button type="button">#장비추천</button>
            <button type="button">#수리/튜닝</button>
          </div>
        </div>
      </section>

      <section className="beginner_start_section">
        <h2>처음이라면 이렇게 시작해보세요</h2>
        <div className="beginner_start_grid">
          <article className="beginner_start_card beginner_start_card_light">
            <div>
              <h3>초보자 가이드 보기</h3>
              <p>기본 규칙, 안전수칙, 용어를 먼저 익혀보세요.</p>
            </div>
            <div className="beginner_start_action">
              <button type="button" onClick={() => navigate('/guide')}>
                가이드보기
                <img src={arrowIcon} alt="" />
              </button>
              <img className="beginner_start_icon" src={bookIcon} alt="" />
            </div>
          </article>

          <article className="beginner_start_card beginner_start_card_dark">
            <div>
              <h3>직접 질문하러 가기</h3>
              <p>가이드로 봐도 헷갈린다면 바로 질문해보세요.</p>
            </div>
            <div className="beginner_start_action">
              <button type="button" onClick={handleWrite}>
                가이드보기
                <img src={arrowIcon} alt="" />
              </button>
              <img className="beginner_start_icon" src={chatIcon} alt="" />
            </div>
          </article>
        </div>
      </section>

      <section className="beginner_questions_section">
        <div className="beginner_section_head">
          <div>
            <h2>최근 올라온 질문</h2>
            <p>다른 초보자들의 질문을 보고 도움을 받아보세요</p>
          </div>
          <button type="button" onClick={() => navigate('/community/beginner/recent')}>
            더보기
            <img src={arrowIcon} alt="" />
          </button>
        </div>

        <div className="beginner_tab_row" aria-label="질문 카테고리">
          {categoryTabs.map((tab, index) => (
            <button className={index === 0 ? 'active' : undefined} type="button" key={tab}>
              {tab}
            </button>
          ))}
        </div>

        <div className="beginner_question_list">
          {recentQuestions.map((question) => (
            <article
              className="beginner_question_card"
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

      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
