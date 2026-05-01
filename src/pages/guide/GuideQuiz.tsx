import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const quizzes = [
  {
    question: '게임장 안에서 고글을 벗어도 될까요?',
    choices: ['상황에 따라 가능', '운영진이 안내하기 전까지 벗지 않는다'],
    answer: '운영진이 안내하기 전까지 벗지 않는다',
  },
  {
    question: '탄에 맞았을 때 가장 먼저 해야 할 행동은?',
    choices: ['바로 숨는다', '손을 들고 히트라고 말한다'],
    answer: '손을 들고 히트라고 말한다',
  },
  {
    question: '처음 참가할 때 가장 먼저 확인하면 좋은 것은?',
    choices: ['현장 규칙과 장비 대여 여부', '무조건 장비 구매'],
    answer: '현장 규칙과 장비 대여 여부',
  },
]

export function GuideQuiz() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<Record<string, string>>({})

  return (
    <div className="page">
      <h1 className="page-title">간단 퀴즈</h1>
      <section className="section">
        {quizzes.map((quiz) => (
          <article className="card" key={quiz.question}>
            <h2>{quiz.question}</h2>
            {quiz.choices.map((choice) => (
              <button className="button" key={choice} type="button" onClick={() => setAnswers({ ...answers, [quiz.question]: choice })}>
                {answers[quiz.question] === choice ? '선택됨: ' : ''}{choice}
              </button>
            ))}
            {answers[quiz.question] ? <span className="badge">정답: {quiz.answer}</span> : null}
          </article>
        ))}
      </section>
      <button className="button primary-button" type="button" onClick={() => navigate('/guide/complete')}>가이드 완료</button>
    </div>
  )
}
