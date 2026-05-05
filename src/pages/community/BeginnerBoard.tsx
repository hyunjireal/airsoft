import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import arrowIcon from '../../asset/icons/arrow_r.svg'
import bookIcon from '../../asset/icons/com_book.svg'
import bookmarkIcon from '../../asset/icons/com_bookmark.svg'
import accIcon from '../../asset/icons/com_acc.svg'
import chatIcon from '../../asset/icons/com_chat.svg'
import chatSmallIcon from '../../asset/icons/com_chat02.svg'
import eyesIcon from '../../asset/icons/com_eyes.svg'
import qnaIcon from '../../asset/icons/com_qna.svg'
import starIcon from '../../asset/icons/com_star.svg'
import userIcon from '../../asset/icons/com_user.svg'
import beginnerCharacter from '../../asset/images/com_beginner_char01.png'
import communityHero from '../../asset/images/com_main01.jpg'
import qnaBubbleImage from '../../asset/images/com_mainQnat.png'
import CategoryTag from '../../components/CategoryTag'
import KeywordTag from '../../components/KeywordTag'
import MainTag from '../../components/MainTag'
import More from '../../components/More'
import SearchBar from '../../components/SearchBar'
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
          <div className="beginner_hero_top">
            <h1>초보 질문방</h1>
            <KeywordTag
              className="beginner_hero_badge"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                padding: '12px 10px',
                gap: '10px'
              }}
            >
              <img src={qnaIcon} alt="" />
              입문자 전용 Q&amp;A
            </KeywordTag>
          </div>

          <div className="beginner_hero_center">
            <div className="beginner_speech_bubble">
              <img className="beginner_speech_bg" src={qnaBubbleImage} alt="" />
              <div className="beginner_speech_text">
                <p>눈치 보지 말고 마음껏 물어보세요!</p>
                <p>입문자만 질문할 수 있고,</p>
                <p>베테랑 멘토들이 다정하게</p>
                <p>답해주는 안전한 공간이에요.</p>
              </div>
            </div>

            <img className="beginner_character" src={beginnerCharacter} alt="초보 질문방 캐릭터" />
          </div>

          <div className="beginner_hero_bottom">
            <SearchBar className="beginner_search" />

            <div className="beginner_hashtags" aria-label="추천 태그">
              <MainTag className="beginner_hashtag">#법규/규정</MainTag>
              <MainTag className="beginner_hashtag">#장비추천</MainTag>
              <MainTag className="beginner_hashtag">#수리/튜닝</MainTag>
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
                <p>기본 규칙, 안전수칙, 용어를 먼저 익혀보세요.</p>
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
                <h3>직접 질문하러 가기</h3>
                <p>가이드를 봐도 헷갈린다면 바로 질문해보세요.</p>
                <button className="beginner_tag_button" type="button" onClick={handleWrite}>
                  <KeywordTag
                    className="beginner_start_keyword beginner_start_keyword_light"
                    style={{ width: 64, height: 20, padding: '3px 6px', background: '#ffffff', color: '#1F2B45' }}
                  >
                    가이드보기 <img src={arrowIcon} alt="" />
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
              <h2>최근 올라온 질문</h2>
              <p>다른 초보자들의 질문을 보고 도움을 받아보세요</p>
            </div>
            <button className="beginner_more_button" type="button" onClick={() => navigate('/community/beginner/recent')}>
              <More />
            </button>
          </div>

          <div className="beginner_question_inner">
            <div className="beginner_question_tags" aria-label="질문 카테고리">
              {categoryTabs.map((tab) => (
                <button className="beginner_question_tag_button" type="button" key={tab}>
                  <KeywordTag
                    className="beginner_question_keyword"
                    style={{
                      width: 'fit-content',
                      height: 'fit-content',
                      padding: '6px 12px',
                      background: tab === '전체' ? '#3D3D3D' : '#D0D0D0',
                      color: tab === '전체' ? '#ffffff' : '#000000',
                      fontSize: 12,
                    }}
                  >
                    {tab}
                  </KeywordTag>
                </button>
              ))}
            </div>

            <div className="beginner_question_card_list">
              {recentQuestions.map((question) => (
                <article
                  className="beginner_question_card"
                  key={question.title}
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
                    aria-label={`${question.title} 저장`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <img src={bookmarkIcon} alt="" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
