import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ChangeEvent, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoginButton } from '../../components/LoginButton'
import { PageHeader } from '../../components/PageHeader'
import aiIcon from '../../asset/icons/com_ai.svg'
import chatbotCalendarIcon from '../../asset/icons/chatbot_cal.svg'
import imageIcon from '../../asset/icons/match_img.svg'
import sendIcon from '../../asset/icons/com_send.svg'
import gaiImage from '../../asset/images/gai.png'
import type { ChatAttachment, ChatMessage } from '../../services/chatApi'
import './Chat.css'

type AnalysisTone = 'good' | 'warn' | 'info'

type AnalysisItem = {
  label: string
  value: string
  detail: string
  tone: AnalysisTone
}

type AnalysisResult = {
  title: string
  confidence: string
  summary: string
  items: AnalysisItem[]
}

type TimedChatMessage = ChatMessage & {
  time: string
  analysis?: AnalysisResult
}

const analysisThinkingSteps = [
  '사진 속 장비 구성을 분리하고 있어요',
  '보호장비와 안전 기준을 대조하고 있어요',
  '입문자 기준 위험 포인트를 골라내고 있어요',
  '추천 순서를 정리하고 있어요',
]

const frequentQuestions = [
  '초보 장비 추천해줘',
  '보호장비는 뭐가 필요해?',
  '배터리 관리 방법',
  '국내 규제에서 확인할 점',
  '첫 게임 전 체크리스트',
]

const analysisLoadingLabels = [
  '사진에서 장비 구성을 확인하고 있어요',
  '보호장비와 안전 요소를 대조하고 있어요',
  '입문자 기준 추천 포인트를 정리하고 있어요',
  '필드 입장 전 체크리스트를 만들고 있어요',
]

const typingLoadingLabels = [
  'AI가 입력 중이에요',
  '질문 내용을 정리하고 있어요',
  '초보자 기준으로 답변을 준비하고 있어요',
]

const mockAnalysisResults: AnalysisResult[] = [
  {
    title: '입문자 장비 안전 분석',
    confidence: 'AI 체크 완료',
    summary: '전체 구성은 입문자가 사용하기에 무난해요. 다만 얼굴 보호와 탄속 확인은 필드 방문 전에 한 번 더 챙기는 편이 좋아요.',
    items: [
      { label: '보호장비', value: '적절해요', detail: '기본 장비 구성은 안정적으로 보여요.', tone: 'good' },
      { label: '안전', value: '고글 착용 권장', detail: '눈 보호는 가장 먼저 확인해야 해요.', tone: 'warn' },
      { label: '추천', value: '메쉬 마스크 추천', detail: '근거리 CQB에서는 하관 보호가 있으면 좋아요.', tone: 'info' },
      { label: '규제', value: '탄속 확인 필요', detail: '방문 필드 기준에 맞는지 크로노 측정이 필요해요.', tone: 'warn' },
      { label: '관리', value: '배터리 상태 점검', detail: '게임 전 충전량과 커넥터 상태를 확인하세요.', tone: 'info' },
    ],
  },
  {
    title: '필드 입장 전 빠른 점검',
    confidence: '데모 분석 완료',
    summary: '사진 기준으로는 바로 게임 준비가 가능해 보이지만, 마스크와 여분 배터리를 준비하면 훨씬 안정적인 세팅이에요.',
    items: [
      { label: '보호장비', value: '기본 구성 양호', detail: '장갑과 고글을 함께 챙기면 좋아요.', tone: 'good' },
      { label: '안전', value: '렌즈 손상 확인', detail: '고글 렌즈에 균열이나 흠집이 없는지 봐주세요.', tone: 'warn' },
      { label: '추천', value: '예비 탄창 준비', detail: '초보자는 1개보다 2개 이상이 편해요.', tone: 'info' },
      { label: '규제', value: '필드 규정 확인', detail: '실내/실외 필드마다 허용 탄속이 달라요.', tone: 'warn' },
      { label: '관리', value: '홉업 초기화', detail: '첫 게임 전에는 기본값에서 조금씩 조절하세요.', tone: 'info' },
    ],
  },
  {
    title: '초보자 맞춤 장비 코칭',
    confidence: '추천 생성 완료',
    summary: '현재 장비는 시작용으로 충분해 보여요. 안전 장비 우선순위를 높이고, 소모품은 여유 있게 준비하는 구성이 좋습니다.',
    items: [
      { label: '보호장비', value: '상체 보호 보완', detail: '얇은 긴팔이나 패딩감 있는 의류가 도움이 돼요.', tone: 'info' },
      { label: '안전', value: '고글 필수', detail: '일반 안경은 보호장비로 충분하지 않아요.', tone: 'warn' },
      { label: '추천', value: '메쉬 마스크 추천', detail: '입문자에게 체감 만족도가 높은 장비예요.', tone: 'good' },
      { label: '규제', value: '칼라파트 유지', detail: '외관 규정은 이동 중에도 유지하는 편이 안전해요.', tone: 'warn' },
      { label: '관리', value: '탄창 청소', detail: '먼지와 BB탄 잔여물을 가볍게 제거하세요.', tone: 'info' },
    ],
  },
]

const quickAnswerMap: Record<string, string> = {
  '초보 장비 추천해줘':
    '처음이라면 안전 장비부터 준비하는 걸 추천해요 👍\n\n• 보호 고글\n• 하관 보호 마스크\n• 장갑\n• 긴팔 복장\n\n이 4가지는 거의 필수에 가까워요.\n총기 성능보다 안전 장비가 훨씬 중요합니다.',
  '보호장비는 뭐가 필요해?':
    '에어소프트에서는 눈 보호가 가장 중요해요 👀\n\n추천 보호 장비:\n• 고글\n• 하관 마스크\n• 장갑\n• 무릎 보호대\n\n특히 CQB 실내 필드는 얼굴 보호 장비를 필수로 요구하는 경우가 많아요.',
  '배터리 관리 방법':
    '배터리는 완전 방전 상태로 오래 두지 않는 게 좋아요 🔋\n\n사용 후 체크하면 좋은 것:\n• 발열 여부 확인\n• 커넥터 상태 점검\n• 충전 후 바로 분리\n\n리포 배터리는 전용 충전기 사용을 추천해요.',
  '국내 규제에서 확인할 점':
    '국내에서는 탄속 제한과 칼라파트 유지 여부를 꼭 확인해야 해요 ⚠️\n\n필드마다 규정이 조금씩 다를 수 있어서,\n방문 전 공지사항 확인도 추천해요.\n\n무리한 개조는 필드 입장이 제한될 수 있어요.',
  '첫 게임 전 체크리스트':
    '첫 게임 전에는 이것만 체크해도 훨씬 편해져요 ✅\n\n• 고글/마스크 챙기기\n• 여분 BB탄 준비\n• 물과 장갑 챙기기\n• 필드 규칙 미리 확인\n\n처음이라면 렌탈 장비로 먼저 경험해보는 것도 좋아요.',
}

const fallbackQuickAnswers = Object.values(quickAnswerMap)

const MAX_UPLOAD_IMAGE_SIDE = 1400
const MAX_UPLOAD_IMAGE_BYTES = 1.4 * 1024 * 1024

const welcomeMessage: TimedChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: '',
  time: '오전 10:30',
}

const welcomeMessageText =
  '건잇 AI 챗봇 가이입니다. 장비 사진 분석을 통해 안전 체크와 장비 진단을 도와드려요. 입문자 장비 추천, 세팅, 수리·커스텀 가이드까지 지원합니다.'

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function getTypingDelay(character: string) {
  if (/\s/.test(character)) return 16
  if (/[.!?。！？]/.test(character)) return 90
  if (character === '\n') return 110

  return 16
}

function getCurrentTime() {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Seoul',
  }).format(new Date())
}

function createMessage(
  role: ChatMessage['role'],
  text: string,
  attachments?: ChatAttachment[],
  analysis?: AnalysisResult,
): TimedChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    text,
    attachments,
    analysis,
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

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('사진을 불러오지 못했어요. 다른 사진으로 다시 시도해주세요.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('사진을 처리하지 못했어요. 다른 사진으로 다시 시도해주세요.'))
    image.src = dataUrl
  })
}

function getDataUrlBytes(dataUrl: string) {
  return Math.round((dataUrl.length * 3) / 4)
}

function drawCompressedImage(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  initialQuality = 0.82,
) {
  const scale = Math.min(1, MAX_UPLOAD_IMAGE_SIDE / Math.max(sourceWidth, sourceHeight))
  const width = Math.max(1, Math.round(sourceWidth * scale))
  const height = Math.max(1, Math.round(sourceHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('사진을 압축하지 못했어요. 다시 시도해주세요.')
  }

  context.drawImage(source, 0, 0, width, height)

  let quality = initialQuality
  let dataUrl = canvas.toDataURL('image/jpeg', quality)

  while (getDataUrlBytes(dataUrl) > MAX_UPLOAD_IMAGE_BYTES && quality > 0.54) {
    quality -= 0.08
    dataUrl = canvas.toDataURL('image/jpeg', quality)
  }

  return dataUrl
}

async function readCompressedImageAsDataUrl(file: File) {
  const dataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(dataUrl)
  return drawCompressedImage(image, image.naturalWidth || image.width, image.naturalHeight || image.height)
}

function renderMessageText(text: string) {
  return (
    <div className="chat_text">
      {text.split('\n').map((line, index) => {
        const trimmedLine = line.trim()

        if (!trimmedLine) {
          return <span className="chat_text_spacer" key={`spacer-${index}`} aria-hidden="true" />
        }

        return (
          <span className="chat_text_line" key={`${trimmedLine}-${index}`}>
            {trimmedLine}
          </span>
        )
      })}
    </div>
  )
}

function renderAnalysisCard(analysis: AnalysisResult) {
  return (
    <section className="chat_result_card" aria-label="AI 분석 결과 카드">
      <div className="chat_result_card_head">
        <div>
          <span className="chat_result_badge">AI 분석 결과</span>
          <strong>{analysis.title}</strong>
        </div>
        <span className="chat_result_confidence">{analysis.confidence}</span>
      </div>
      <p>{analysis.summary}</p>
      <div className="chat_result_grid">
        {analysis.items.map((item, index) => (
          <article
            className={`chat_result_item is_${item.tone}`}
            key={item.label}
            style={{ '--result-index': index } as CSSProperties}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
          </article>
        ))}
      </div>
      <LoginButton className="chat_result_cta" variant="accent">
        상세 결과 보기
      </LoginButton>
    </section>
  )
}

function renderAnalysisThinkingState(currentStep: number, loadingText: string) {
  return (
    <div className="chat_analysis_state chat_analysis_state_steps">
      <div className="chat_analysis_state_header">
        <span className="chat_analysis_orbit" aria-hidden="true" />
        <div>
          <strong>AI가 분석 중이에요</strong>
          <span>{loadingText}</span>
        </div>
      </div>
      <div className="chat_analysis_progress" aria-label="AI 분석 진행 단계">
        {analysisThinkingSteps.map((step, index) => {
          const isDone = index < currentStep
          const isActive = index === currentStep

          return (
            <div
              className={`chat_analysis_progress_item${isDone ? ' is_done' : ''}${isActive ? ' is_active' : ''}`}
              key={step}
            >
              <span aria-hidden="true">{isDone ? '✓' : index + 1}</span>
              <p>{step}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ChatbotPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuestionSent = useRef(false)
  const chatScrollRef = useRef<HTMLElement | null>(null)
  const pageRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const threadEndRef = useRef<HTMLDivElement | null>(null)
  const scrollFrameRef = useRef<number | null>(null)
  const scrollTimerRef = useRef<number | null>(null)
  const typingTimerRef = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<TimedChatMessage[]>(() => [
    {
      ...welcomeMessage,
      time: getCurrentTime(),
    },
  ])
  const [isIntroComplete, setIsIntroComplete] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [loadingIndex, setLoadingIndex] = useState(0)
  const [loadingMode, setLoadingMode] = useState<'analysis' | 'typing'>('analysis')
  const [analysisThinkingStep, setAnalysisThinkingStep] = useState(0)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const loadingText = useMemo(() => {
    const labels = loadingMode === 'analysis' ? analysisLoadingLabels : typingLoadingLabels
    return labels[loadingIndex % labels.length]
  }, [loadingIndex, loadingMode])

  const scrollToLatestMessage = () => {
    if (scrollFrameRef.current) {
      window.cancelAnimationFrame(scrollFrameRef.current)
    }
    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current)
    }

    const pinToBottom = () => {
      const chat = chatScrollRef.current

      if (!chat) {
        return
      }

      chat.scrollTo({
        top: chat.scrollHeight,
        behavior: 'auto',
      })
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      pinToBottom()

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        pinToBottom()
        scrollFrameRef.current = null
      })
    })

    scrollTimerRef.current = window.setTimeout(() => {
      pinToBottom()
      threadEndRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' })
      scrollTimerRef.current = null
    }, 180)
  }

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

  const typeExistingAssistantMessage = (messageId: string, answer: string) =>
    new Promise<void>((resolve) => {
      const characters = Array.from(answer)
      let index = 0

      setTypingMessageId(messageId)

      const typeNextCharacter = () => {
        index += 1
        const nextText = characters.slice(0, index).join('')

        setMessages((current) =>
          current.map((message) =>
            message.id === messageId
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

  const appendAnalysisCard = (analysis: AnalysisResult) => {
    setMessages((current) => [...current, createMessage('assistant', '', undefined, analysis)])
  }

  const sendEquipmentPhoto = async (attachment: ChatAttachment) => {
    if (isSending) {
      return
    }

    const userMessage = createMessage(
      'user',
      '장비 사진을 보냈어요. 초보자 기준으로 추천 장비와 안전 체크를 해주세요.',
      [attachment],
    )
    setMessages((current) => [...current, userMessage])
    setIsSending(true)
    setLoadingIndex(0)
    setLoadingMode('analysis')
    setAnalysisThinkingStep(0)

    const analysis = pickRandom(mockAnalysisResults)

    for (let stepIndex = 0; stepIndex < analysisThinkingSteps.length; stepIndex += 1) {
      setAnalysisThinkingStep(stepIndex)
      await wait(900 + stepIndex * 170)
    }

    setAnalysisThinkingStep(analysisThinkingSteps.length)
    await wait(520)
    setIsSending(false)
    await typeAssistantAnswer('사진 확인했어요. 장비 구성과 안전 포인트를 기준으로 빠르게 정리해드릴게요.')
    await wait(620)
    appendAnalysisCard(analysis)
  }

  const sendText = async (text = input) => {
    const trimmed = text.trim()
    if (!trimmed || isSending) {
      return
    }

    const userMessage = createMessage('user', trimmed)
    setMessages((current) => [...current, userMessage])
    setInput('')
    setIsSending(true)
    setLoadingIndex(0)
    setLoadingMode('typing')
    setAnalysisThinkingStep(0)

    const answer = quickAnswerMap[trimmed] ?? pickRandom(fallbackQuickAnswers)

    await wait(1200 + Math.floor(Math.random() * 800))
    setIsSending(false)
    await typeAssistantAnswer(answer)
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
      setCameraError('카메라 권한을 사용할 수 없어 사진 선택으로 전환했어요.')
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
    const dataUrl = drawCompressedImage(video, width, height, 0.82)
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

    try {
      const dataUrl = await readCompressedImageAsDataUrl(file)
      closeCamera()
      await sendEquipmentPhoto(dataUrlToAttachment(dataUrl, file.name))
    } catch {
      await typeAssistantAnswer('사진을 처리하지 못했어요. 다른 사진을 선택해주시면 바로 다시 분석해볼게요.')
    }
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
    if (!question || initialQuestionSent.current || !isIntroComplete) {
      return
    }

    initialQuestionSent.current = true
    void sendText(question)
  }, [searchParams, isIntroComplete])

  useEffect(() => {
    let isCancelled = false

    const timer = window.setTimeout(() => {
      void typeExistingAssistantMessage(welcomeMessage.id, welcomeMessageText).then(() => {
        if (!isCancelled) {
          setIsIntroComplete(true)
        }
      })
    }, 760)

    return () => {
      isCancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!isSending) {
      return
    }

    const timer = window.setInterval(() => {
      setLoadingIndex((current) => current + 1)
    }, 620)

    return () => {
      window.clearInterval(timer)
    }
  }, [isSending])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current)
      }
      if (scrollFrameRef.current) {
        window.cancelAnimationFrame(scrollFrameRef.current)
      }
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current)
      }
      stopCamera()
    }
  }, [])

  useLayoutEffect(() => {
    scrollToLatestMessage()
  }, [messages, isSending, loadingText, typingMessageId, analysisThinkingStep])

  useEffect(() => {
    const page = pageRef.current
    const bottom = bottomRef.current

    if (!page || !bottom) {
      return
    }

    const updateBottomSpace = () => {
      const height = Math.ceil(bottom.getBoundingClientRect().height + 44)
      page.style.setProperty('--chat-bottom-height', `${height}px`)

      scrollToLatestMessage()
    }

    updateBottomSpace()

    const observer = new ResizeObserver(updateBottomSpace)
    observer.observe(bottom)
    window.addEventListener('resize', updateBottomSpace)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateBottomSpace)
    }
  }, [])

  return (
    <div className="chat_page" ref={pageRef}>
      <div className="chat_con">
        <PageHeader title="AI 챗봇 가이" onBack={goBack} />

        <main className="chat" ref={chatScrollRef}>
          <section className="chat_thread" aria-live="polite">
            <div className="chat_day_marker">
              <img src={chatbotCalendarIcon} alt="" aria-hidden="true" />
              오늘
            </div>

            {messages.map((message, index) => {
              const isTyping = message.id === typingMessageId

              return (
                <Fragment key={message.id}>
                  <article className={`chat_message_frame ${message.role} is_entering`}>
                  {message.role === 'assistant' ? (
                    <img className="chat_gai" src={gaiImage} alt="" aria-hidden="true" />
                  ) : null}
                  <div className="chat_message_stack">
                    <div className={`chat_bubble${isTyping ? ' is_typing' : ''}${message.analysis ? ' has_result_card' : ''}`}>
                      {message.attachments?.map((attachment) => (
                        <img
                          className="chat_uploaded_image"
                          key={attachment.id}
                          src={attachment.dataUrl}
                          alt={attachment.name}
                        />
                      ))}
                      {message.text ? renderMessageText(message.text) : null}
                      {isTyping && !message.text ? (
                        <span className="chat_inline_typing" aria-label="AI가 입력 중">
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : null}
                      {message.analysis ? renderAnalysisCard(message.analysis) : null}
                    </div>
                    <time>{message.time}</time>
                  </div>
                  </article>
                  {index === 0 ? (
                    <div className="chat_scan_prompt">
                      <img src={gaiImage} alt="" aria-hidden="true" />
                      <div>
                        <strong>장비 전체 사진을 보내주세요</strong>
                        <span>정면이 잘 보이게 촬영하면 더 정확하게 분석할 수 있어요</span>
                      </div>
                      <button type="button" onClick={openCamera} disabled={isSending}>
                        <img src={imageIcon} alt="" aria-hidden="true" />
                        사진 촬영하기
                      </button>
                    </div>
                  ) : null}
                </Fragment>
              )
            })}

            {isSending && !typingMessageId ? (
              <article className="chat_message_frame assistant is_entering">
                <img className="chat_gai" src={gaiImage} alt="" aria-hidden="true" />
                <div className="chat_message_stack">
                  {loadingMode === 'analysis' ? (
                    renderAnalysisThinkingState(analysisThinkingStep, loadingText)
                  ) : (
                    <div className="chat_analysis_state">
                      <span className="chat_analysis_orbit" aria-hidden="true" />
                      <span>{loadingText}</span>
                      <span className="chat_typing_dots" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  )}
                </div>
              </article>
            ) : null}
            <div className="chat_thread_end" ref={threadEndRef} aria-hidden="true" />
          </section>
        </main>

        <div className="chat_bottom chat_bottom_scan" ref={bottomRef}>
          <div className="chat_faq">
            <p className="body_m_14">자주 묻는 질문</p>
            <div className="chat_faq_tags">
              <div className="chat_faq_track">
                <div className="chat_faq_group">
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
                <div className="chat_faq_group" aria-hidden="true">
                  {frequentQuestions.map((question) => (
                    <button
                      className="chat_faq_tag"
                      key={`loop-${question}`}
                      type="button"
                      onClick={() => void sendText(question)}
                      disabled={isSending}
                      tabIndex={-1}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form className="post_detail_comment_input" onSubmit={submit}>
            <div className={`chat_input_bar${input.trim() ? ' is_ready' : ''}`}>
              <button
                className="chat_capture_inline"
                type="button"
                onClick={openCamera}
                disabled={isSending}
                aria-label="장비 사진 보내기"
              >
                <img src={aiIcon} alt="" aria-hidden="true" />
              </button>
              <input
                value={input}
                placeholder="장비 추천이 궁금한가요?"
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
                ×
              </button>
              <strong>장비 스캔</strong>
            </div>
            <div className="gai_camera_hint">
              <strong>장비가 프레임 안에 들어오게 맞춰주세요</strong>
              <span>안전 장비와 관리 포인트를 함께 체크할게요.</span>
            </div>
            <div className="gai_scan_frame" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            {cameraError ? <p className="gai_camera_error">{cameraError}</p> : null}
            {!isCameraReady && !cameraError ? (
              <p className="gai_camera_error">카메라를 준비하고 있어요.</p>
            ) : null}
            <div className="gai_camera_actions">
              <LoginButton
                className="gai_camera_capture_button"
                variant="accent"
                onClick={capturePhoto}
                disabled={!isCameraReady}
              >
                사진 촬영하기
              </LoginButton>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
