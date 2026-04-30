export interface User {
  id: string
  nickname: string
  level: string
  teamId?: string
  badgeIds: string[]
  playStyle: string
  region: string
  beginnerGuideProgress: number
}

export interface Team {
  id: string
  name: string
  region: string
  memberCount: number
  description: string
}

export interface Badge {
  id: string
  label: string
  description: string
}

export interface Match {
  id: string
  title: string
  date: string
  time: string
  fieldName: string
  region: string
  level: string
  status: string
  capacity: string
  description: string
}

export interface RecruitPost {
  id: string
  title: string
  matchId?: string
  role: string
  needed: number
  region: string
  status: string
}

export interface CommunityPost {
  id: string
  category: 'beginner' | 'team' | 'recruit' | 'reviews'
  title: string
  author: string
  createdAt: string
  commentCount: number
  tags: string[]
}

export interface CreatorContent {
  id: string
  title: string
  creator: string
  type: 'live' | 'video' | 'post'
  status: '라이브 중' | '업로드됨' | '예정'
  summary: string
}

export interface MvpCandidate {
  id: string
  name: string
  team: string
  voteRate: number
  highlight: string
}

export interface ScheduleItem {
  id: string
  matchId: string
  date: string
  time: string
  fieldName: string
  status: string
}
