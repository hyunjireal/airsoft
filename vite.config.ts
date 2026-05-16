import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

type ChatRole = 'system' | 'user' | 'assistant'

type ChatRequestMessage = {
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

      if (body.length > 1024 * 1024) {
        reject(new Error('요청 본문이 너무 큽니다.'))
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

function isChatMessage(value: unknown): value is ChatRequestMessage {
  if (!value || typeof value !== 'object') {
    return false
  }

  const message = value as Partial<ChatRequestMessage>
  return (
    (message.role === 'system' || message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string' &&
    message.content.trim().length > 0
  )
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
                  'X-Title': 'Airsoft Chatbot',
                },
                body: JSON.stringify({
                  model: OPENROUTER_MODEL,
                  messages,
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
