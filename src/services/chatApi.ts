export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
}

export interface ChatApiMessage {
  role: ChatRole
  content: string
}

type ChatApiResponse = {
  message?: {
    role?: 'assistant'
    content?: string
  }
  answer?: string
  error?: string
}

function toApiMessages(messages: ChatMessage[]): ChatApiMessage[] {
  return messages
    .filter((message) => message.text.trim().length > 0)
    .map((message) => ({
      role: message.role,
      content: message.text,
    }))
}

export async function requestChatAnswer(messages: ChatMessage[]) {
  const endpoint = import.meta.env.VITE_CHAT_API_URL || '/api/chat'

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content:
            '당신은 에어소프트 입문자를 돕는 친절한 한국어 챗봇입니다. 안전 수칙, 장비 준비, 매치 참여, 커뮤니티 이용 방법을 짧고 정확하게 안내하세요.',
        },
        ...toApiMessages(messages),
      ],
    }),
  })

  const data = (await response.json().catch(() => ({}))) as ChatApiResponse

  if (!response.ok) {
    throw new Error(data.error || '챗봇 API 요청에 실패했습니다.')
  }

  const content = data.message?.content || data.answer

  if (!content) {
    throw new Error('챗봇 응답이 비어 있습니다.')
  }

  return content
}
