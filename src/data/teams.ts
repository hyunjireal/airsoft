import type { Badge, Team } from '../types'

export const teams: Team[] = [
  {
    id: 'team-alpha',
    name: '알파 택티컬',
    region: '서울/경기',
    memberCount: 18,
    description: '초보와 숙련자가 함께 뛰는 주말 중심 팀',
  },
  {
    id: 'team-river',
    name: '리버 사이드',
    region: '인천',
    memberCount: 11,
    description: '실내 CQB와 야간전 연습을 즐기는 팀',
  },
]

export const badges: Badge[] = [
  { id: 'safe-player', label: '안전 우선', description: '안전수칙 퀴즈 완료' },
  { id: 'rookie', label: '루키', description: '첫 경기 참가 완료' },
  { id: 'buddy', label: '버디', description: '초보 동행 매칭 참여' },
]
