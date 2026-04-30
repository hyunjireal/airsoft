import type { Match, RecruitPost } from '../types'

export const matches: Match[] = [
  {
    id: 'match-001',
    title: '초보 환영 야외전',
    date: '토요일',
    time: '14:00',
    fieldName: '택티컬 필드',
    region: '경기 남부',
    level: '입문/초급',
    status: '모집 중',
    capacity: '18/24명',
    description: '안전 브리핑과 장비 점검을 함께 진행하는 입문자 친화 매치입니다.',
  },
  {
    id: 'match-002',
    title: 'CQB 팀 스크림',
    date: '일요일',
    time: '12:00',
    fieldName: '어반 CQB',
    region: '서울',
    level: '중급',
    status: '마감 임박',
    capacity: '14/16명',
    description: '팀 단위 전술 이동과 짧은 라운드 중심의 실내전입니다.',
  },
  {
    id: 'match-003',
    title: '주말 포레스트 매치',
    date: '다음 주 일요일',
    time: '10:30',
    fieldName: '포레스트 아레나',
    region: '경기 북부',
    level: '초급 이상',
    status: '신청 가능',
    capacity: '22/30명',
    description: '장거리 교전 없이 안전거리와 매너 플레이를 강조하는 야외전입니다.',
  },
]

export const recruitPosts: RecruitPost[] = [
  {
    id: 'recruit-001',
    title: '용병 2명 모집 중',
    matchId: 'match-001',
    role: '게스트',
    needed: 2,
    region: '경기 남부',
    status: '모집 중',
  },
  {
    id: 'recruit-002',
    title: '초보 동행 버디 찾습니다',
    role: '버디',
    needed: 1,
    region: '서울',
    status: '대화 가능',
  },
]
