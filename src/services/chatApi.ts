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

const fallbackAnswers = [
  '처음이라면 고글, 장갑, 편한 신발, 물을 먼저 챙기고 현장 안전 브리핑을 꼭 들으면 좋아요. 필드마다 규정이 다르니 매치 상세의 필드 정보를 함께 확인해주세요.',
  '혼자 가도 개인 참가 매치나 용병 모집을 통해 참여할 수 있어요. 매치 메뉴에서 참가 방식 필터를 개인 또는 용병으로 바꿔보세요.',
  '앱 사용이 궁금하다면 홈에서는 추천 콘텐츠를 보고, 매치에서는 일정과 참가 신청, 커뮤니티에서는 초보 질문방을 이용하면 됩니다.',
]

function toApiMessages(messages: ChatMessage[]): ChatApiMessage[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.text,
  }))
}

function getFallbackAnswer(question: string) {
  const normalized = question.replace(/\s/g, '')
  if (normalized.includes('혼자') || normalized.includes('용병')) {
    return fallbackAnswers[1]
  }
  if (normalized.includes('앱') || normalized.includes('사용') || normalized.includes('메뉴')) {
    return fallbackAnswers[2]
  }

  return fallbackAnswers[0]
}

export async function requestChatAnswer(messages: ChatMessage[]) {
  const latestQuestion = [...messages].reverse().find((message) => message.role === 'user')?.text ?? ''
  const endpoint = import.meta.env.VITE_CHAT_API_URL || '/api/chat'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: toApiMessages(messages),
        context: {
          appName: '삼삼오오',
          audience: '에어소프트 입문자와 앱 사용자',
          scope: ['입문자 질문', '안전 수칙', '장비 준비', '매치 참여', '앱 사용법'],
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Chat API request failed')
    }

    const data = (await response.json()) as { answer?: string; message?: string }
    return data.answer || data.message || getFallbackAnswer(latestQuestion)
  } catch {
    return getFallbackAnswer(latestQuestion)
  }
}
