import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { requestChatAnswer, type ChatMessage } from '../../services/chatApi'
import './Chat.css'

const suggestions = [
  '처음 경기장에 가면 뭘 준비해야 하나요?',
  '혼자 가도 참여할 수 있나요?',
  '히트 선언은 어떻게 하나요?',
  '장비는 꼭 사야 하나요?',
  '이 앱에서 매치 신청은 어디서 하나요?',
]

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: '안녕하세요. 에어소프트 입문 질문이나 삼삼오오 앱 사용법을 편하게 물어보세요. 안전 관련 내용은 필드 운영진 안내를 우선으로 확인하도록 도와드릴게요.',
}

function createMessage(role: ChatMessage['role'], text: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    text,
  }
}

export function ChatbotPage() {
  const [searchParams] = useSearchParams()
  const initialQuestionSent = useRef(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const [isSending, setIsSending] = useState(false)

  const send = async (text = input) => {
    const trimmed = text.trim()
    if (!trimmed || isSending) {
      return
    }

    const userMessage = createMessage('user', trimmed)
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsSending(true)

    const answer = await requestChatAnswer(nextMessages)
    setMessages((current) => [...current, createMessage('assistant', answer)])
    setIsSending(false)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void send()
  }

  useEffect(() => {
    const question = searchParams.get('question')
    if (!question || initialQuestionSent.current) {
      return
    }

    initialQuestionSent.current = true
    void send(question)
  }, [searchParams])

  return (
    <div className="page chat_page">
      <h1 className="page_title">AI에게 물어보기</h1>
      <p className="page_description">뉴비가 궁금한 것과 삼삼오오 앱 사용법을 대화하듯 물어보세요.</p>

      <section className="section">
        <div className="chip_row">
          {suggestions.map((question) => (
            <button className="chip chip_button" key={question} type="button" onClick={() => void send(question)}>
              {question}
            </button>
          ))}
        </div>
      </section>

      <section className="section chat_thread" aria-live="polite">
        {messages.map((message) => (
          <article className={`card chat_message ${message.role}`} key={message.id}>
            <span className="badge">{message.role === 'user' ? '사용자' : 'AI'}</span>
            <p>{message.text}</p>
          </article>
        ))}
        {isSending ? (
          <article className="card chat_message assistant">
            <span className="badge">AI</span>
            <p>답변을 정리하고 있어요...</p>
          </article>
        ) : null}
      </section>

      <form className="chat_input_bar" onSubmit={submit}>
        <textarea
          className="textarea"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="예: 첫 매치에 혼자 가도 괜찮나요?"
          rows={3}
        />
        <button className="button primary_button" type="submit" disabled={isSending}>
          {isSending ? '전송 중' : '보내기'}
        </button>
      </form>
    </div>
  )
}
