import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

type ChatRole = 'system' | 'user' | 'assistant'

type ChatAttachment = {
  id?: string
  name?: string
  type?: string
  size?: number
  dataUrl?: string
}

type ClientChatMessage = {
  role: Exclude<ChatRole, 'system'>
  content: string
  attachments?: ChatAttachment[]
}

type OpenRouterMessage = {
  role: ChatRole
  content: string
}

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      role?: string
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'deepseek/deepseek-chat:free'

const GAI_SYSTEM_PROMPT = `
당신은 건잇(GUNIT)의 AI 챗봇 가이(GAI)입니다.
역할은 "이미지 분석 기반 에어소프트 장비 코치"입니다.

말투:
- 친절한 한국인 에어소프트 선배처럼 자연스럽게 말합니다.
- 입문자가 이해하기 쉽게 짧은 문단과 체크리스트로 설명합니다.
- 너무 기술적인 표현은 풀어서 설명합니다.

코칭 원칙:
- 한국 에어소프트 규제와 현장 안전 기준을 우선 고려합니다.
- 보호안경, 얼굴 보호, 장갑, 복장, 신발, 탄창/배터리 관리 등 안전 요소를 중요하게 확인합니다.
- 위험하거나 불법적인 개조, 파워 상승, 규제 회피, 식별이 어려운 외형 개조는 절대 권장하지 않습니다.
- 사진만으로 확정하기 어려운 내용은 "사진상으로는" 또는 "추가 확인이 필요해요"라고 말합니다.
- 현재 MVP는 정밀 vision 판독 단계가 아니므로, 첨부된 이미지 정보와 사용자의 설명을 바탕으로 입문자용 점검 경험을 제공합니다.

답변 형식:
1. 먼저 한 줄로 전체 평가를 말합니다.
2. "사진 기준 체크"에서 보이는/확인해야 할 항목을 정리합니다.
3. "안전/규제 주의"에서 한국 기준으로 조심할 점을 강조합니다.
4. "다음 액션"에서 입문자가 바로 할 일을 2~4개 제안합니다.
`.trim()

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(body))
}

function readJsonBody(request: IncomingMessage) {
  return new Promise<unknown>((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk

      if (body.length > 4 * 1024 * 1024) {
        reject(new Error('요청 본문이 너무 큽니다. 이미지를 더 작게 업로드해주세요.'))
        request.destroy()
      }
    })

    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('JSON 형식이 올바르지 않습니다.'))
      }
    })

    request.on('error', reject)
  })
}

function isChatMessage(value: unknown): value is ClientChatMessage {
  if (!value || typeof value !== 'object') {
    return false
  }

  const message = value as Partial<ClientChatMessage>
  return (
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string' &&
    (message.content.trim().length > 0 || Array.isArray(message.attachments))
  )
}

function formatAttachmentForPrompt(attachment: ChatAttachment, index: number) {
  const sizeKb = typeof attachment.size === 'number' ? Math.round(attachment.size / 1024) : 0
  return [
    `이미지 ${index + 1}`,
    `파일명: ${attachment.name || '장비 사진'}`,
    `형식: ${attachment.type || 'image/*'}`,
    `크기: 약 ${sizeKb}KB`,
  ].join(', ')
}

function toOpenRouterMessages(messages: ClientChatMessage[]): OpenRouterMessage[] {
  return [
    {
      role: 'system',
      content: GAI_SYSTEM_PROMPT,
    },
    ...messages.map((message) => {
      const attachments = message.attachments ?? []
      const attachmentContext = attachments.length
        ? `\n\n[첨부 이미지 정보]\n${attachments.map(formatAttachmentForPrompt).join('\n')}\n현재 모델은 텍스트 기반 MVP이므로, 이미지가 첨부된 장비 점검 상황으로 보고 보호장비/안전/규제/관리 체크리스트 중심으로 코칭하세요.`
        : ''

      return {
        role: message.role,
        content: `${message.content || '장비 사진을 올렸어요. 입문자 기준으로 점검해주세요.'}${attachmentContext}`,
      }
    }),
  ]
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const chatApiKey = env.CHAT_API_KEY || env.OPENROUTER_API_KEY

  return {
    plugins: [
      react(),
      {
        name: 'openrouter-chat-api',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (request, response) => {
            if (request.method !== 'POST') {
              sendJson(response, 405, { error: 'POST 요청만 사용할 수 있습니다.' })
              return
            }

            if (!chatApiKey) {
              sendJson(response, 500, { error: 'CHAT_API_KEY가 설정되어 있지 않습니다.' })
              return
            }

            try {
              const body = await readJsonBody(request)
              const messages = (body as { messages?: unknown }).messages

              if (!Array.isArray(messages) || !messages.every(isChatMessage)) {
                sendJson(response, 400, { error: 'messages 배열이 필요합니다.' })
                return
              }

              const openRouterResponse = await fetch(OPENROUTER_CHAT_URL, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${chatApiKey}`,
                  'Content-Type': 'application/json',
                  'HTTP-Referer': request.headers.origin || 'http://localhost:5173',
                  'X-Title': 'GUNIT GAI',
                },
                body: JSON.stringify({
                  model: OPENROUTER_MODEL,
                  messages: toOpenRouterMessages(messages),
                  temperature: 0.7,
                }),
              })

              const data = (await openRouterResponse.json()) as OpenRouterResponse

              if (!openRouterResponse.ok) {
                sendJson(response, openRouterResponse.status, {
                  error: data?.error?.message || 'OpenRouter 요청에 실패했습니다.',
                })
                return
              }

              const message = data?.choices?.[0]?.message
              const content = typeof message?.content === 'string' ? message.content : ''

              if (!content) {
                sendJson(response, 502, { error: 'OpenRouter 응답에 message.content가 없습니다.' })
                return
              }

              sendJson(response, 200, {
                message: {
                  role: message?.role || 'assistant',
                  content,
                },
                answer: content,
              })
            } catch (error) {
              sendJson(response, 500, {
                error: error instanceof Error ? error.message : '챗봇 API 처리 중 오류가 발생했습니다.',
              })
            }
          })
        },
      },
    ],
  }
})
