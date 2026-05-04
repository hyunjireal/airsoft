import { useState } from 'react'
import { aiDummyAnswer } from '../../data/copy'

const suggestions = [
  '처음 경기장에 가면 뭘 준비해야 하나요?',
  '혼자 가도 참여할 수 있나요?',
  '히트 선언은 어떻게 하나요?',
  '장비는 꼭 사야 하나요?',
  '용병 참여는 어떤 방식인가요?',
]

interface Message {
  role: 'user' | 'ai'
  text: string
}

export function ChatbotPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const send = (text = input) => {
    if (!text.trim()) {
      return
    }
    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'ai', text: aiDummyAnswer }])
    setInput('')
  }

  return (
    <div className="page">
      <h1 className="page_title">AI에게 물어보기</h1>
      <p className="page_description">기초 질문, 경기 준비, 장비, 규칙을 편하게 물어보세요.</p>
      <section className="section">
        <div className="chip_row">{suggestions.map((question) => <button className="chip" key={question} type="button" onClick={() => send(question)}>{question}</button>)}</div>
      </section>
      <section className="section">
        {messages.map((message, index) => (
          <article className="card" key={`${message.role}-${index}`}>
            <span className="badge">{message.role === 'user' ? '사용자' : 'AI'}</span>
            <p>{message.text}</p>
          </article>
        ))}
      </section>
      <div className="list">
        <input className="input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="메시지 입력" />
        <button className="button primary_button" type="button" onClick={() => send()}>보내기</button>
      </div>
    </div>
  )
}
