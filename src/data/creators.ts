import type { CreatorContent, MvpCandidate } from '../types'

export const creatorContents: CreatorContent[] = [
  {
    id: 'creator-001',
    title: '수도권 CQB 라이브 관전',
    creator: '필드캠',
    type: 'live',
    status: '라이브 중',
    summary: '팀 이동과 라운드별 포인트를 실시간 해설합니다.',
  },
  {
    id: 'creator-002',
    title: '초보용 보호장비 체크리스트',
    creator: '세이프기어',
    type: 'video',
    status: '업로드됨',
    summary: '첫 참가 전 챙기면 좋은 기본 장비를 정리했습니다.',
  },
  {
    id: 'creator-003',
    title: '주말 토너먼트 프리뷰',
    creator: '매치노트',
    type: 'post',
    status: '예정',
    summary: '참가 팀 전력과 관전 포인트를 미리 소개합니다.',
  },
]

export const mvpCandidates: MvpCandidate[] = [
  {
    id: 'mvp-001',
    name: '블루윈',
    team: '알파 택티컬',
    voteRate: 42,
    highlight: '최종 라운드 엄폐 이동과 팀 커버',
  },
  {
    id: 'mvp-002',
    name: '노마드',
    team: '리버 사이드',
    voteRate: 35,
    highlight: '초보 팀원 리드와 안전 브리핑',
  },
]
