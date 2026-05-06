import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Guide.css'

type Quiz = {
  category: string
  question: string
  choices: string[]
  answer: string
  correctFeedback: string
  wrongFeedback: string
}

const quizzes: Quiz[] = [
  {
    category: '준비물과 안전장비',
    question: '게임 구역에 들어갈 때 반드시 착용해야 하는 것은?',
    choices: ['모자', '보안경', '팔찌', '이어폰'],
    answer: '보안경',
    correctFeedback: '게임 구역에서는 보안경 착용이 가장 기본이에요.',
    wrongFeedback: '게임 구역에서는 눈 보호가 최우선이에요. 정답은 보안경입니다.',
  },
  {
    category: '준비물과 안전장비',
    question: '고글에 김이 서려 앞이 잘 보이지 않을 때 올바른 행동은?',
    choices: ['잠깐 고글을 벗는다', '혼자 구석으로 이동한다', '손을 들고 운영자에게 알린다', '그대로 뛰어다닌다'],
    answer: '손을 들고 운영자에게 알린다',
    correctFeedback: '시야 문제가 생기면 멈추고 운영자 안내를 받는 것이 안전해요.',
    wrongFeedback: '고글을 벗거나 혼자 이동하면 위험해요. 손을 들고 운영자에게 알려주세요.',
  },
  {
    category: '세이프존 규칙',
    question: '세이프존에서 하면 안 되는 행동은?',
    choices: ['장비를 정리한다', '물을 마신다', '사람을 향해 총구를 든다', '운영자 안내를 듣는다'],
    answer: '사람을 향해 총구를 든다',
    correctFeedback: '세이프존에서는 총구를 사람에게 향하지 않아요.',
    wrongFeedback: '세이프존에서도 총구 방향은 항상 조심해야 해요.',
  },
  {
    category: '히트 판정',
    question: '탄에 맞았을 때 가장 먼저 해야 할 행동은?',
    choices: ['바로 숨는다', '손을 들고 히트라고 말한다', '상대에게 다시 쏜다', '맞지 않은 척 이동한다'],
    answer: '손을 들고 히트라고 말한다',
    correctFeedback: '히트 선언은 크게, 손은 보이게 올리는 것이 좋아요.',
    wrongFeedback: '탄에 맞으면 손을 들고 히트라고 말해 주변에 알려야 해요.',
  },
  {
    category: '장비 점검',
    question: '경기 전 가장 먼저 확인하면 좋은 것은?',
    choices: ['현장 규칙과 장비 대여 여부', '무조건 장비 구매', '친구 장비 몰래 사용', '규칙보다 복장 색상'],
    answer: '현장 규칙과 장비 대여 여부',
    correctFeedback: '필드마다 규칙과 대여 조건이 달라서 먼저 확인해야 해요.',
    wrongFeedback: '처음이라면 장비 구매보다 현장 규칙과 대여 가능 여부 확인이 먼저예요.',
  },
  {
    category: '안전거리',
    question: '가까운 거리에서 상대를 발견했을 때 좋은 판단은?',
    choices: ['무조건 연사한다', '필드 규정의 안전거리와 항복 권고를 따른다', '얼굴을 겨냥한다', '장난으로 위협한다'],
    answer: '필드 규정의 안전거리와 항복 권고를 따른다',
    correctFeedback: '근거리 상황은 필드 규정과 운영자 안내를 따르는 것이 가장 안전해요.',
    wrongFeedback: '근거리에서는 안전거리와 항복 권고 같은 필드 규정이 우선이에요.',
  },
  {
    category: '총구 관리',
    question: '이동 중 에어소프트건을 들고 있을 때 기본 자세는?',
    choices: ['사람을 향해 겨눈다', '방아쇠에 손가락을 올린다', '총구를 안전한 방향으로 둔다', '뛰면서 흔든다'],
    answer: '총구를 안전한 방향으로 둔다',
    correctFeedback: '총구 방향과 방아쇠 손가락 관리는 기본 안전 습관이에요.',
    wrongFeedback: '이동 중에는 총구를 안전한 방향으로 두고 방아쇠에서 손가락을 빼주세요.',
  },
  {
    category: '필드 매너',
    question: '운영자의 경기 중지 안내가 들렸을 때 해야 할 행동은?',
    choices: ['계속 진행한다', '즉시 사격을 멈추고 안내를 따른다', '몰래 위치를 바꾼다', '장비를 점검하며 발사한다'],
    answer: '즉시 사격을 멈추고 안내를 따른다',
    correctFeedback: '경기 중지 안내는 안전 상황일 수 있으니 즉시 멈춰야 해요.',
    wrongFeedback: '운영자 안내가 들리면 사격을 멈추고 지시에 따라야 해요.',
  },
  {
    category: '장비 보관',
    question: '필드 밖으로 이동할 때 장비는 어떻게 다루는 것이 좋을까요?',
    choices: ['노출한 채 들고 간다', '케이스나 가방에 넣어 이동한다', '공공장소에서 장전한다', '장난으로 겨눈다'],
    answer: '케이스나 가방에 넣어 이동한다',
    correctFeedback: '필드 밖에서는 케이스나 가방에 넣어 안전하게 이동해요.',
    wrongFeedback: '필드 밖에서는 오해와 위험을 줄이기 위해 장비를 가방이나 케이스에 넣어주세요.',
  },
  {
    category: '장비·법규·필드 매너',
    question: '처음 가는 필드에서 가장 좋은 행동은?',
    choices: ['브리핑을 대충 듣는다', '모르는 규칙은 시작 전에 질문한다', '주변 사람을 따라만 한다', '규칙을 몰라도 바로 게임한다'],
    answer: '모르는 규칙은 시작 전에 질문한다',
    correctFeedback: '모르는 규칙은 시작 전에 질문하면 모두가 더 안전해져요.',
    wrongFeedback: '처음 가는 필드에서는 모르는 규칙을 시작 전에 질문하는 것이 좋아요.',
  },
]

const completedCategories = ['안전장비', '세이프존', '히트 판정']

export function GuideQuiz() {
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [answered, setAnswered] = useState<{ question: string; selected: string; isCorrect: boolean }[]>([])
  const [isChecked, setIsChecked] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const currentQuiz = quizzes[currentIndex]
  const progress = Math.round(((currentIndex + 1) / quizzes.length) * 100)
  const correctCount = answered.filter((answer) => answer.isCorrect).length
  const wrongAnswers = useMemo(() => answered.filter((answer) => !answer.isCorrect), [answered])
  const isLastQuestion = currentIndex === quizzes.length - 1

  const selectChoice = (choice: string) => {
    if (isChecked) return

    setSelectedChoice(choice)
  }

  const checkAnswer = () => {
    if (!selectedChoice || isChecked) return

    const isCorrect = selectedChoice === currentQuiz.answer
    setAnswered((prev) => [...prev, { question: currentQuiz.question, selected: selectedChoice, isCorrect }])
    setIsChecked(true)
  }

  const goNext = () => {
    if (isLastQuestion) {
      setIsComplete(true)
      return
    }

    if (currentIndex === 4) {
      setShowMilestone(true)
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedChoice(null)
    setIsChecked(false)
  }

  const continueAfterMilestone = () => {
    setShowMilestone(false)
    setCurrentIndex((prev) => prev + 1)
    setSelectedChoice(null)
    setIsChecked(false)
  }

  const skipQuestion = () => {
    if (isLastQuestion) {
      setIsComplete(true)
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedChoice(null)
    setIsChecked(false)
  }

  const restartQuiz = () => {
    setStarted(false)
    setCurrentIndex(0)
    setSelectedChoice(null)
    setAnswered([])
    setIsChecked(false)
    setShowMilestone(false)
    setIsComplete(false)
  }

  if (!started) {
    return (
      <div className="guide_quiz_page guide_quiz_intro">
        <section className="guide_quiz_cover" aria-labelledby="quiz-title">
          <div className="guide_quiz_cover_overlay" />
          <div className="guide_quiz_cover_content">
            <span className="guide_quiz_pill">초보자 퀴즈</span>
            <h1 id="quiz-title">초보자 퀴즈</h1>
            <p>안전과 기본 룰을 가볍게 익히고, 첫 게임을 더 편하게 시작해보세요.</p>
            <button className="guide_quiz_primary" type="button" onClick={() => setStarted(true)}>
              퀴즈 시작하기
            </button>
            <Link className="guide_quiz_text_link" to="/guide">
              먼저 초보자 가이드 보기
            </Link>
          </div>
        </section>
      </div>
    )
  }

  if (showMilestone) {
    return (
      <div className="guide_quiz_page guide_quiz_center">
        <section className="guide_quiz_milestone">
          <div className="guide_quiz_trophy" aria-hidden="true">★</div>
          <h1>절반까지 왔어요</h1>
          <p>현재 {answered.length} / {quizzes.length} 진행 중</p>
          <span>남은 문항도 가볍게 이어서 풀어보세요.</span>
          <button className="guide_quiz_primary" type="button" onClick={continueAfterMilestone}>
            계속 풀기
          </button>
          <button className="guide_quiz_secondary" type="button" onClick={() => setShowMilestone(false)}>
            지금까지 푼 문제 보기
          </button>
          <div className="guide_quiz_category_row" aria-label="완료한 카테고리">
            {completedCategories.map((category) => (
              <span key={category}>✓ {category}</span>
            ))}
          </div>
        </section>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="guide_quiz_page guide_quiz_center">
        <section className="guide_quiz_result">
          <div className="guide_quiz_cup" aria-hidden="true">🏆</div>
          <h1>퀴즈 완료!</h1>
          <strong>{correctCount} / {quizzes.length} 정답</strong>
          <p>기본 규칙을 잘 이해하고 있어요.</p>
          <div className="guide_quiz_result_grid">
            <article>
              <h2>잘 이해한 내용</h2>
              <span>✓ 안전장비</span>
              <span>✓ 세이프존 규칙</span>
              <span>✓ 히트 선언</span>
            </article>
            <article>
              <h2>다시 보면 좋은 내용</h2>
              {wrongAnswers.length > 0 ? (
                wrongAnswers.slice(0, 2).map((answer) => <span key={answer.question}>• {answer.question}</span>)
              ) : (
                <span>• 장비·법규</span>
              )}
            </article>
          </div>
          <button className="guide_quiz_primary" type="button" disabled>
            이벤트 아이템 받기
          </button>
          <button className="guide_quiz_secondary" type="button" onClick={() => navigate('/community/beginner')}>
            초보 질문방으로 가기
          </button>
          <button className="guide_quiz_secondary" type="button" onClick={() => navigate('/match')}>
            매치 찾으러 가기
          </button>
          <div className="guide_quiz_result_actions">
            <button className="guide_quiz_link_button" type="button" onClick={restartQuiz}>
              퀴즈 다시 풀기
            </button>
            <button className="guide_quiz_link_button" type="button" onClick={() => navigate('/home')}>
              홈으로 가기
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="guide_quiz_page">
      <section className="guide_quiz_card" aria-labelledby="current-quiz-title">
        <div className="guide_quiz_header">
          <div className="guide_quiz_count">
            <span>{currentIndex + 1} / {quizzes.length}</span>
            <div className="guide_quiz_progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className="guide_quiz_category">{currentQuiz.category}</span>
          <h1 id="current-quiz-title">{currentQuiz.question}</h1>
        </div>

        <div className="guide_quiz_choices">
          {currentQuiz.choices.map((choice) => {
            const isSelected = selectedChoice === choice

            return (
              <button
                className={`guide_quiz_choice ${isSelected ? 'selected' : ''}`}
                key={choice}
                type="button"
                onClick={() => selectChoice(choice)}
              >
                <span className="guide_quiz_radio" aria-hidden="true" />
                {choice}
              </button>
            )
          })}
        </div>

        {selectedChoice && isChecked ? (
          <div className={`guide_quiz_feedback ${selectedChoice === currentQuiz.answer ? 'correct' : 'wrong'}`}>
            <span aria-hidden="true">{selectedChoice === currentQuiz.answer ? '✓' : '×'}</span>
            <div>
              <strong>{selectedChoice === currentQuiz.answer ? '정답이에요!' : '아쉬워요'}</strong>
              <p>{selectedChoice === currentQuiz.answer ? currentQuiz.correctFeedback : currentQuiz.wrongFeedback}</p>
            </div>
          </div>
        ) : null}

        <div className="guide_quiz_actions">
          {isChecked ? (
            <button className="guide_quiz_primary" type="button" onClick={goNext}>
              {isLastQuestion ? '마지막 문제예요! 제출하기' : '다음 문제'}
            </button>
          ) : (
            <>
              <button className="guide_quiz_primary" type="button" onClick={checkAnswer} disabled={!selectedChoice}>
                확인하기
              </button>
              <button className="guide_quiz_link_button" type="button" onClick={skipQuestion}>
                문제 건너뛰기
              </button>
            </>
          )}
          {isChecked ? (
            <Link className="guide_quiz_text_link" to="/guide">
              가이드 다시 보기
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  )
}
