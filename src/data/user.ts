import type { ScheduleItem, User } from '../types'

export const currentUser: User = {
  id: 'user-001',
  nickname: '라이트기어',
  level: 'Lv.2 입문자',
  teamId: 'team-alpha',
  badgeIds: ['safe-player', 'rookie'],
  playStyle: '초보 환영전 선호',
  region: '수도권',
  beginnerGuideProgress: 62,
}

export const mySchedules: ScheduleItem[] = [
  {
    id: 'schedule-001',
    matchId: 'match-001',
    date: '토요일',
    time: '14:00',
    fieldName: '택티컬 필드',
    status: '참가 확정',
  },
  {
    id: 'schedule-002',
    matchId: 'match-003',
    date: '다음 주 일요일',
    time: '10:30',
    fieldName: '포레스트 아레나',
    status: '승인 대기',
  },
]
