import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import arrowIcon from '../../asset/icons/arrow_r.svg'
import bookIcon from '../../asset/icons/com_book.svg'
import bookmarkIcon from '../../asset/icons/com_bookmark.svg'
import bookmarkOnIcon from '../../asset/icons/com_bookmark_on.svg'
import accIcon from '../../asset/icons/com_acc.svg'
import chatIcon from '../../asset/icons/com_chat.svg'
import chatSmallIcon from '../../asset/icons/com_chat02.svg'
import eyesIcon from '../../asset/icons/com_eyes.svg'
import aiIcon from '../../asset/icons/com_ai.svg'
import qnaIcon from '../../asset/icons/com_qna.svg'
import sendIcon from '../../asset/icons/com_send.svg'
import starIcon from '../../asset/icons/com_star.svg'
import userIcon from '../../asset/icons/com_user.svg'
import writeIcon from '../../asset/icons/com_write.svg'
import gaiImage from '../../asset/images/gai.png'
import CategoryTag from '../../components/CategoryTag'
import KeywordTag from '../../components/KeywordTag'
import MainTag from '../../components/MainTag'
import More from '../../components/More'
import './Community.css'

const categoryTabs = ['전체', '법규규정', '장비추천', '룰/매너', '게임전술'] as const
type CategoryTab = (typeof categoryTabs)[number]

const quickQuestions = [
  '초보가 먼저 알아야 할 것',
  '맞으면 어떻게 해?',
  '필드 규칙 알려줘',
]

const recentQuestions = [
  {
    id: 'q-001',
    title: '서바이벌 게임에서 꼭 지켜야 할 기본 규칙이 궁금해요!',
    category: '법규규정',
    author: '초보대원',
    time: '2시간 전',
    views: '999+',
    comments: '567',
    recommended: true,
  },
  {
    id: 'q-002',
    title: '처음 가는 필드에서 어떤 장비를 준비하면 좋나요?',
    category: '장비추천',
    author: '게임마스터',
    time: '1시간 전',
    views: '150',
    comments: '120',
  },
  {
    id: 'q-003',
    title: '히트 선언을 했을 때 이동 매너는 어떻게 지키나요?',
    category: '룰/매너',
    author: '매너가이드',
    time: '3시간 전',
    views: '320',
    comments: '98',
  },
  {
    id: 'q-004',
    title: '초보자도 따라 하기 쉬운 팀 전술이 있나요?',
    category: '게임전술',
    author: '전술입문',
    time: '30분 전',
    views: '200',
    comments: '150',
  },
  {
    id: 'q-005',
    title: '비비탄과 보호 장비 관련 법규는 어디까지 알아야 하나요?',
    category: '법규규정',
    author: '안전제일',
    time: '4시간 전',
    views: '188',
    comments: '42',
  },
  {
    id: 'q-006',
    title: '입문용 고글과 장갑은 어떤 기준으로 고르면 되나요?',
    category: '장비추천',
    author: '장비뉴비',
    time: '5시간 전',
    views: '276',
    comments: '63',
  },
]

function chatQuestionUrl(question: string) {
  return `/chat?question=${encodeURIComponent(question)}`
}

export function BeginnerBoard() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('전체')
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiFocused, setAiFocused] = useState(false)

  const filteredQuestions = useMemo(() => {
    if (activeCategory === '전체') {
      return recentQuestions
    }

    return recentQuestions.filter((question) => question.category === activeCategory)
  }, [activeCategory])

  const askGai = (question: string) => {
    const trimmed = question.trim()
    if (!trimmed) return

    navigate(chatQuestionUrl(trimmed))
  }

  const toggleBookmark = (questionId: string) => {
    setBookmarkedIds((current) => {
      const next = new Set(current)
      if (next.has(questionId)) {
        next.delete(questionId)
      } else {
        next.add(questionId)
      }
      return next
    })
  }

  return (
    <div className="beginner_board_page">
      <section className="beginner_hero" aria-label="초보 질문방 소개">
        <img className="beginner_hero_gai" src={gaiImage} alt="" />

        <div className="beginner_hero_content">
          <div className="beginner_hero_top">
            <h1>초보 질문방</h1>
            <KeywordTag
              className="beginner_hero_badge"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                padding: '12px 10px',
                gap: '10px',
                fontSize: 15
              }}
            >
              <img src={qnaIcon} alt="" />
              입문자 전용 Q&amp;A
            </KeywordTag>
          </div>

          <div className="beginner_hero_center">
            <form
              className={`beginner_ai_search ${aiFocused || aiQuestion ? 'is_active' : ''}`}
              aria-label="가이에게 질문하기"
              onSubmit={(event) => {
                event.preventDefault()
                askGai(aiQuestion)
              }}
            >
              <span className="beginner_ai_search_left">
                <img src={aiIcon} alt="" />
                <input
                  type="search"
                  value={aiQuestion}
                  onFocus={() => setAiFocused(true)}
                  onBlur={() => setAiFocused(false)}
                  onChange={(event) => setAiQuestion(event.target.value)}
                  placeholder="가이에게 물어보세요"
                />
              </span>
              <button className="beginner_ai_search_send" type="submit" aria-label="질문 보내기">
                <img src={sendIcon} alt="" />
              </button>
            </form>
          </div>
          <div className="beginner_hero_bottom">
            <p className="beginner_hero_prompt">많이 묻는 질문을 바로 물어보세요</p>
            <div className="beginner_hashtags chip_box" aria-label="추천 질문">
              {quickQuestions.map((question) => (
                <button className="beginner_hashtag_button" type="button" key={question} onClick={() => askGai(question)}>
                  <MainTag className="beginner_hashtag">{question}</MainTag>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="beginner_body">
        <section className="beginner_start_section">
          <p className="beginner_start_title">처음이라면 이렇게 시작해보세요</p>
          <div className="beginner_guide_inner">
            <article className="beginner_start_card beginner_start_card_light">
              <div className="beginner_start_text">
                <h3>초보자 가이드 보기</h3>
                <p>기본 규칙, 안전수칙, 용어를 먼저 훑어보세요.</p>
                <button className="beginner_tag_button" type="button" onClick={() => navigate('/guide')}>
                  <KeywordTag
                    className="beginner_start_keyword beginner_start_keyword_dark"
                    style={{ width: 64, height: 20, padding: '3px 6px', background: '#1F2B45', color: '#ffffff' }}
                  >
                    가이드보기 <img src={arrowIcon} alt="" />
                  </KeywordTag>
                </button>
              </div>
              <img className="beginner_start_icon" src={bookIcon} alt="" />
            </article>

            <article className="beginner_start_card beginner_start_card_dark">
              <div className="beginner_start_text">
                <h3>자주 묻는 질문 보기</h3>
                <p>초보자들이 많이 물어본 질문부터 확인해보세요.</p>
                <button className="beginner_tag_button" type="button" onClick={() => navigate('/community/beginner/recent')}>
                  <KeywordTag
                    className="beginner_start_keyword beginner_start_keyword_light"
                    style={{ width: 74, height: 20, padding: '3px 6px', background: '#ffffff', color: '#1F2B45' }}
                  >
                    확인하러가기 <img src={arrowIcon} alt="" />
                  </KeywordTag>
                </button>
              </div>
              <img className="beginner_start_icon" src={chatIcon} alt="" />
            </article>
          </div>
        </section>

        <section className="beginner_questions_section">
          <div className="beginner_question_tit">
            <div className="beginner_question_m_tit">
              <h2>
                <span>최근 올라온 질문</span>
                <button className="beginner_more_button" type="button" aria-label="최근 질문 더보기">
                  <More />
                </button>
              </h2>
              <p>다른 초보자들의 질문을 보고 먼저 답을 받아보세요.</p>
            </div>
          </div>

          <div className="beginner_question_inner">
            <div className="beginner_question_tags" aria-label="질문 카테고리">
              {categoryTabs.map((tab) => (
                <button
                  className="beginner_question_tag_button"
                  type="button"
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  aria-pressed={activeCategory === tab}
                >
                  <KeywordTag
                    className="beginner_question_keyword"
                    style={{
                      width: 'fit-content',
                      height: 'fit-content',
                      padding: '6px 12px',
                      background: activeCategory === tab ? '#3D3D3D' : '#D0D0D0',
                      color: activeCategory === tab ? '#ffffff' : '#000000',
                      fontSize: 12,
                    }}
                  >
                    {tab}
                  </KeywordTag>
                </button>
              ))}
            </div>

            <div className="beginner_question_card_list">
              {filteredQuestions.map((question) => {
                const bookmarked = bookmarkedIds.has(question.id)

                return (
                  <article
                    className="beginner_question_card"
                    key={question.id}
                    onClick={() => navigate('/community/beginner/recent/first')}
                  >
                    <div className="beginner_question_card_content">
                      <div className="beginner_question_sub_tit">
                        {question.recommended ? (
                          <CategoryTag
                            className="beginner_recommend_tag"
                            style={{
                              border: 0,
                              gap: 0,
                              fontSize: 10,
                              color: '#000000',
                            }}
                          >
                            <img src={starIcon} alt="" />
                            추천 질문
                          </CategoryTag>
                        ) : null}
                        <KeywordTag
                          className="beginner_question_card_category"
                          style={{
                            width: 'fit-content',
                            height: 'fit-content',
                            padding: '3px 6px',
                            background: '#D0D0D0',
                            color: '#000000',
                            fontSize: 10,
                            fontWeight: 500,
                            letterSpacing: 0,
                          }}
                        >
                          {question.category}
                        </KeywordTag>
                      </div>
                      <h3 className="beginner_question_card_tit">{question.title}</h3>
                      <div className="beginner_question_info">
                        <div className="beginner_question_info_right">
                          <span>
                            <img src={userIcon} alt="" />
                            {question.author} · {question.time}
                          </span>
                          <span>
                            <img src={eyesIcon} alt="" />
                            {question.views}
                          </span>
                          <span>
                            <img src={chatSmallIcon} alt="" />
                            {question.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="beginner_question_card_acc" aria-hidden="true">
                      <img src={accIcon} alt="" />
                    </div>
                    <button
                      className="beginner_question_info_left"
                      type="button"
                      aria-label={`${question.title} 북마크`}
                      aria-pressed={bookmarked}
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleBookmark(question.id)
                      }}
                    >
                      <img src={bookmarked ? bookmarkOnIcon : bookmarkIcon} alt="" />
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      <button className="community_write_floating" type="button" onClick={() => navigate('/community/post/create')}>
        <img src={writeIcon} alt="" />
        <span>글 작성하기</span>
      </button>
    </div>
  )
}
