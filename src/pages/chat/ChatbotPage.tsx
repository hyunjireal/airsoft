import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import arrowLeftIcon from '../../asset/icons/arrow_l.svg'
import sendIcon from '../../asset/icons/com_send.svg'
import gaiImage from '../../asset/images/gai.png'
import { requestChatAnswer, type ChatMessage } from '../../services/chatApi'
import './Chat.css'

type TimedChatMessage = ChatMessage & {
  time: string
}

const frequentQuestions = [
  '초보가 먼저 알아야 할 것',
  '처음 경기 준비물',
  '히트 선언 방법',
  '장비 대여 가능 여부',
  '매치 신청하는 법',
]

const welcomeMessage: TimedChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: '안녕하세요! AI 챗봇 가이에요.\n궁금한 정보를 알려드릴게요!',
  time: '오전 10:30',
}

function getTypingDelay(character: string) {
  if (/\s/.test(character)) return 18
  if (/[.!?。！？,，:;]\s?$/.test(character)) return 110
  if (character === '\n') return 160

  return 28
}

function getCurrentTime() {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())
}

function createMessage(role: ChatMessage['role'], text: string): TimedChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    text,
    time: getCurrentTime(),
  }
}

export function ChatbotPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuestionSent = useRef(false)
  const chatScrollRef = useRef<HTMLElement | null>(null)
  const typingTimerRef = useRef<number | null>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<TimedChatMessage[]>([welcomeMessage])
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  const typeAssistantAnswer = (answer: string) =>
    new Promise<void>((resolve) => {
      const assistantMessage = createMessage('assistant', '')
      const characters = Array.from(answer)
      let index = 0

      setTypingMessageId(assistantMessage.id)
      setMessages((current) => [...current, assistantMessage])

      const typeNextCharacter = () => {
        index += 1
        const nextText = characters.slice(0, index).join('')

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  text: nextText,
                }
              : message,
          ),
        )

        if (index >= characters.length) {
          setTypingMessageId(null)
          typingTimerRef.current = null
          resolve()
          return
        }

        typingTimerRef.current = window.setTimeout(
          typeNextCharacter,
          getTypingDelay(characters[index - 1]),
        )
      }

      typeNextCharacter()
    })

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
    await typeAssistantAnswer(answer)
    setIsSending(false)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void send()
  }

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/home')
  }

  useEffect(() => {
    const question = searchParams.get('question')
    if (!question || initialQuestionSent.current) {
      return
    }

    initialQuestionSent.current = true
    void send(question)
  }, [searchParams])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const chat = chatScrollRef.current
    if (!chat) {
      return
    }

    chat.scrollTop = chat.scrollHeight
  }, [messages, isSending])

  return (
    <div className="chat_page">
      <div className="chat_con">
        <header className="chat_top">
          <div className="chat_tit">
            <button className="chat_back_button" type="button" aria-label="뒤로가기" onClick={goBack}>
              <img src={arrowLeftIcon} alt="" aria-hidden="true" />
            </button>
            <h1>
              <span className="body_m_28">AI 챗봇 </span>
              <strong className="body_b_28">가이</strong>
            </h1>
          </div>
          <p className="chat_subtitle body_m_16">가이에게 무엇이든 물어보세요!</p>
        </header>

        <main className="chat" ref={chatScrollRef}>
          <section className="chat_thread" aria-live="polite">
            {messages.map((message) => (
              <article className={`chat_message_frame ${message.role} is_entering`} key={message.id}>
                {message.role === 'assistant' ? (
                  <img className="chat_gai" src={gaiImage} alt="" aria-hidden="true" />
                ) : null}
                <div className="chat_message_stack">
                  <div className={`chat_bubble${message.id === typingMessageId ? ' is_typing' : ''}`}>
                    {message.text}
                  </div>
                  <time>{message.time}</time>
                </div>
              </article>
            ))}
          </section>
        </main>

        <div className="chat_bottom">
          <div className="chat_faq">
            <p className="body_m_14">자주 묻는 질문</p>
            <div className="chat_faq_tags">
              {frequentQuestions.map((question) => (
                <button
                  className="chat_faq_tag"
                  key={question}
                  type="button"
                  onClick={() => void send(question)}
                  disabled={isSending}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          <form className="post_detail_comment_input" onSubmit={submit}>
            <div className="post_detail_comment_searchbar">
              <input
                value={input}
                placeholder="메세지를 입력하세요"
                onChange={(event) => setInput(event.target.value)}
                disabled={isSending}
              />
              <button type="submit" aria-label="보내기" disabled={isSending}>
                {isSending ? <span className="chat_send_loading" aria-hidden="true" /> : <img src={sendIcon} alt="" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
