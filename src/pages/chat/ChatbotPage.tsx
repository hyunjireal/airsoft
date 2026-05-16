import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import arrowRightIcon from '../../asset/icons/arrow_r.svg'
import imageIcon from '../../asset/icons/match_img.svg'
import sendIcon from '../../asset/icons/com_send.svg'
import gaiImage from '../../asset/images/gai.png'
import { requestChatAnswer, type ChatAttachment, type ChatMessage } from '../../services/chatApi'
import './Chat.css'

type TimedChatMessage = ChatMessage & {
  time: string
}

const frequentQuestions = [
  '초보 장비 추천해줘',
  '보호장비 뭐가 필요해?',
  '배터리 관리 팁',
  '국내 규제에서 조심할 점',
  '첫 게임 전 체크리스트',
]

const welcomeMessage: TimedChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text:
    '안녕하세요! 저는 AI 장비 코치 가이예요.\n장비 사진을 보내주시면 입문자 기준으로 안전, 규제, 관리 포인트를 함께 체크해드릴게요.',
  time: '오전 10:30',
}

function getTypingDelay(character: string) {
  if (/\s/.test(character)) return 16
  if (/[.!?。]\s?$/.test(character)) return 90
  if (character === '\n') return 110

  return 16
}

function getCurrentTime() {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())
}

function createMessage(
  role: ChatMessage['role'],
  text: string,
  attachments?: ChatAttachment[],
): TimedChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    text,
    attachments,
    time: getCurrentTime(),
  }
}

function dataUrlToAttachment(dataUrl: string, name = 'gai-equipment-photo.jpg'): ChatAttachment {
  const size = Math.round((dataUrl.length * 3) / 4)

  return {
    id: `image-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    type: 'image/jpeg',
    size,
    dataUrl,
  }
}

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('사진을 불러오지 못했어요. 다시 시도해주세요.'))
    reader.readAsDataURL(file)
  })
}

function isAnalysisLine(line: string) {
  return /^(✅|⚠️?|❗|💡)/u.test(line.trim())
}

function renderMessageText(text: string, isTyping: boolean) {
  const lines = text.split('\n')
  const hasAnalysis = lines.some(isAnalysisLine)

  return (
    <div className={hasAnalysis ? 'chat_result_summary' : 'chat_text'}>
      {hasAnalysis ? <strong className="chat_result_title">분석 결과</strong> : null}
      {lines.map((line, index) => {
        const trimmedLine = line.trim()

        if (!trimmedLine) {
          return <span className="chat_text_spacer" key={`spacer-${index}`} aria-hidden="true" />
        }

        if (isAnalysisLine(trimmedLine)) {
          const icon = trimmedLine.match(/^(✅|⚠️?|❗|💡)/u)?.[0] ?? ''
          const label = trimmedLine.replace(/^(✅|⚠️?|❗|💡)\s*/u, '').trim()

          return (
            <span className="chat_result_line" key={`${trimmedLine}-${index}`}>
              <span className="chat_result_icon" aria-hidden="true">
                {icon}
              </span>
              <span>{label}</span>
            </span>
          )
        }

        return (
          <span className="chat_text_line" key={`${trimmedLine}-${index}`}>
            {trimmedLine}
          </span>
        )
      })}
      {hasAnalysis && !isTyping ? (
        <button className="chat_result_cta" type="button">
          상세 결과 보기
          <img src={arrowRightIcon} alt="" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}

export function ChatbotPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuestionSent = useRef(false)
  const chatScrollRef = useRef<HTMLElement | null>(null)
  const typingTimerRef = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<TimedChatMessage[]>([welcomeMessage])
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState('')

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setIsCameraReady(false)
  }

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

  const sendEquipmentPhoto = async (attachment: ChatAttachment) => {
    if (isSending) {
      return
    }

    const userMessage = createMessage(
      'user',
      '장비 사진을 촬영했어요. 초보 기준으로 추천 장비와 안전 체크를 해주세요.',
      [attachment],
    )
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setIsSending(true)

    try {
      const answer = await requestChatAnswer(nextMessages)
      await typeAssistantAnswer(answer)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '가이가 사진 분석을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'
      await typeAssistantAnswer(message)
    } finally {
      setIsSending(false)
    }
  }

  const sendText = async (text = input) => {
    const trimmed = text.trim()
    if (!trimmed || isSending) {
      return
    }

    const userMessage = createMessage('user', trimmed)
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsSending(true)

    try {
      const answer = await requestChatAnswer(nextMessages)
      await typeAssistantAnswer(answer)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '가이가 응답을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'
      await typeAssistantAnswer(message)
    } finally {
      setIsSending(false)
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendText()
  }

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      fileInputRef.current?.click()
      return
    }

    setCameraError('')
    setIsCameraOpen(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 1920 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setIsCameraReady(true)
    } catch {
      setCameraError('카메라를 열 수 없어요. 브라우저 권한을 확인하거나 사진 파일을 선택해주세요.')
      fileInputRef.current?.click()
    }
  }

  const closeCamera = () => {
    stopCamera()
    setIsCameraOpen(false)
  }

  const capturePhoto = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || !isCameraReady) {
      return
    }

    const width = video.videoWidth || 1080
    const height = video.videoHeight || 1440
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    context.drawImage(video, 0, 0, width, height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.86)
    closeCamera()
    await sendEquipmentPhoto(dataUrlToAttachment(dataUrl))
  }

  const selectFallbackPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      await typeAssistantAnswer('사진 파일만 사용할 수 있어요. 장비 사진으로 다시 선택해주세요.')
      return
    }

    const dataUrl = await readImageAsDataUrl(file)
    closeCamera()
    await sendEquipmentPhoto(dataUrlToAttachment(dataUrl, file.name))
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
    void sendText(question)
  }, [searchParams])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current)
      }
      stopCamera()
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
        <PageHeader
          className="chat_top"
          groupClassName="chat_tit"
          title="AI 챗봇 가이"
          onBack={goBack}
        />

        <main className="chat" ref={chatScrollRef}>
          <section className="chat_thread" aria-live="polite">
            <div className="chat_day_marker">
              <span aria-hidden="true">▣</span>
              오늘
            </div>

            <div className="chat_scan_prompt">
              <img src={gaiImage} alt="" aria-hidden="true" />
              <div>
                <strong>장비 전체 사진을 한 장 보내주세요!</strong>
                <span>가이가 안전, 규제, 관리 포인트를 더 정확하게 분석해드릴 수 있어요.</span>
              </div>
              <button type="button" onClick={openCamera} disabled={isSending}>
                <img src={imageIcon} alt="" aria-hidden="true" />
                사진 보내기
              </button>
            </div>

            {messages.map((message) => {
              const isTyping = message.id === typingMessageId

              return (
                <article className={`chat_message_frame ${message.role} is_entering`} key={message.id}>
                  {message.role === 'assistant' ? (
                    <img className="chat_gai" src={gaiImage} alt="" aria-hidden="true" />
                  ) : null}
                  <div className="chat_message_stack">
                    <div className={`chat_bubble${isTyping ? ' is_typing' : ''}`}>
                      {message.attachments?.map((attachment) => (
                        <img
                          className="chat_uploaded_image"
                          key={attachment.id}
                          src={attachment.dataUrl}
                          alt={attachment.name}
                        />
                      ))}
                      {renderMessageText(message.text, isTyping)}
                    </div>
                    <time>{message.time}</time>
                  </div>
                </article>
              )
            })}

            {isSending && !typingMessageId ? (
              <article className="chat_message_frame assistant is_entering">
                <img className="chat_gai" src={gaiImage} alt="" aria-hidden="true" />
                <div className="chat_message_stack">
                  <div className="chat_analysis_state">
                    <span>가이가 분석 중이에요</span>
                    <span className="chat_typing_dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                </div>
              </article>
            ) : null}
          </section>
        </main>

        <div className="chat_bottom chat_bottom_scan">
          <div className="chat_faq">
            <p className="body_m_14">자주 묻는 질문</p>
            <div className="chat_faq_tags">
              {frequentQuestions.map((question) => (
                <button
                  className="chat_faq_tag"
                  key={question}
                  type="button"
                  onClick={() => void sendText(question)}
                  disabled={isSending}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <form className="post_detail_comment_input" onSubmit={submit}>
            <div className="post_detail_comment_searchbar chat_input_bar">
              <button
                className="chat_capture_inline"
                type="button"
                onClick={openCamera}
                disabled={isSending}
                aria-label="장비 사진 보내기"
              >
                <img src={imageIcon} alt="" aria-hidden="true" />
              </button>
              <input
                value={input}
                placeholder="장비 사진을 찍거나 질문을 입력해 주세요."
                onChange={(event) => setInput(event.target.value)}
                disabled={isSending}
              />
              <button className="chat_send_button" type="submit" aria-label="보내기" disabled={isSending}>
                {isSending ? (
                  <span className="chat_send_loading" aria-hidden="true" />
                ) : (
                  <img src={sendIcon} alt="" />
                )}
              </button>
            </div>
          </form>
        </div>

        <input
          ref={fileInputRef}
          className="chat_file_input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={selectFallbackPhoto}
        />
        <canvas ref={canvasRef} className="chat_capture_canvas" />

        {isCameraOpen ? (
          <div className="gai_camera_overlay">
            <video ref={videoRef} className="gai_camera_video" playsInline muted />
            <div className="gai_camera_scrim" />
            <div className="gai_camera_topbar">
              <button type="button" aria-label="카메라 닫기" onClick={closeCamera}>
                ←
              </button>
              <strong>장비 스캔</strong>
              <button type="button" aria-label="카메라 닫기" onClick={closeCamera}>
                ×
              </button>
            </div>
            <div className="gai_camera_hint">
              <strong>장비가 프레임 안에 들어오게 맞춰주세요</strong>
              <span>불법 개조, 안전 문제 가능성까지 함께 체크할게요.</span>
            </div>
            <div className="gai_scan_frame" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            {cameraError ? <p className="gai_camera_error">{cameraError}</p> : null}
            {!isCameraReady && !cameraError ? (
              <p className="gai_camera_error">카메라를 준비하는 중이에요.</p>
            ) : null}
            <div className="gai_camera_actions">
              <button type="button" onClick={capturePhoto} disabled={!isCameraReady}>
                사진 촬영하기
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
