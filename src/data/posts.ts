import type { CommunityPost } from '../types'

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-001',
    category: 'beginner',
    title: '첫 경기 때 꼭 챙겨야 할 장비가 있나요?',
    author: '처음참가',
    createdAt: '12분 전',
    commentCount: 8,
    tags: ['초보', '장비'],
  },
  {
    id: 'post-002',
    category: 'team',
    title: '수도권 팀 정기전 후기와 다음 일정 공유',
    author: '팀리더K',
    createdAt: '1시간 전',
    commentCount: 4,
    tags: ['팀게시판', '일정'],
  },
  {
    id: 'post-003',
    category: 'recruit',
    title: '일요일 CQB 팀원 1명 모집합니다',
    author: '어반러너',
    createdAt: '3시간 전',
    commentCount: 11,
    tags: ['팀원모집', 'CQB'],
  },
  {
    id: 'post-004',
    category: 'reviews',
    title: '포레스트 아레나 초보전 참가 후기',
    author: '라이트기어',
    createdAt: '어제',
    commentCount: 6,
    tags: ['경기후기', '야외전'],
  },
]
