import matchList01 from '../../asset/images/match_list01.jpg'
import matchList02 from '../../asset/images/match_list02.jpg'
import matchList03 from '../../asset/images/match_list03.jpg'
import { matches } from '../../data/mockData'

export type MyMatchStatus = 'applied' | 'confirmed' | 'past'
export type MyMatchType = 'personal' | 'team' | 'mercenary'

export type MyMatchItem = {
  id: string
  matchId: string
  status: MyMatchStatus
  type: MyMatchType
  title: string
  time: string
  detail: string
  region: string
  fieldName: string
  currentParticipants: number
  maxParticipants: number
  imageSrc: string
  tagLabel: string
  to: string
  isMine?: boolean
}

const JOINED_MATCH_IDS_KEY = 'joinedMatchIds'
const CANCELED_MATCH_IDS_KEY = 'airsoft:canceled-match-ids'
const CREATED_MATCHES_KEY = 'airsoft:created-matches'

const defaultMyMatches: MyMatchItem[] = [
  {
    id: 'default-applied-001',
    matchId: 'match-003',
    status: 'applied',
    type: 'personal',
    title: '서울 CQB 입문 스크림',
    time: '2026.05.10 · 12:00',
    detail: '5/10 (일) 12:00 I 어반 CQB',
    region: '서울',
    fieldName: '어반 CQB',
    currentParticipants: 14,
    maxParticipants: 16,
    imageSrc: matchList01,
    tagLabel: 'D-22',
    to: '/match/detail/match-003',
  },
  {
    id: 'default-applied-002',
    matchId: 'match-002',
    status: 'applied',
    type: 'team',
    title: '주말 포레스트 매치',
    time: '2026.05.09 · 10:30',
    detail: '5/9 (토) 10:30 I 포레스트 아레나',
    region: '경기 북부',
    fieldName: '포레스트 아레나',
    currentParticipants: 22,
    maxParticipants: 30,
    imageSrc: matchList02,
    tagLabel: 'D-21',
    to: '/match/detail/match-002',
  },
  {
    id: 'default-confirmed-001',
    matchId: 'match-001',
    status: 'confirmed',
    type: 'personal',
    title: '초보 환영 야외전',
    time: '2026.05.23 · 14:00',
    detail: '5/23 (토) 14:00 I 택티컬 필드',
    region: '경기 남부',
    fieldName: '택티컬 필드',
    currentParticipants: 18,
    maxParticipants: 24,
    imageSrc: matchList03,
    tagLabel: 'D-14',
    to: '/match/detail/match-001',
  },
  {
    id: 'default-past-001',
    matchId: 'past-001',
    status: 'past',
    type: 'personal',
    title: '2026 5월 입문전 경기',
    time: '2026.05.02 · 10:00',
    detail: '5/2 (토) 10:00 I 하남 실내 필드',
    region: '경기 하남',
    fieldName: '하남 실내 필드',
    currentParticipants: 12,
    maxParticipants: 12,
    imageSrc: matchList01,
    tagLabel: '종료',
    to: '/my/schedule',
  },
]

function readStringList(key: string) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function readCreatedMatches(): MyMatchItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(CREATED_MATCHES_KEY) ?? '[]')
    if (!Array.isArray(value)) return []

    return value
      .filter((match) => match && typeof match === 'object' && typeof match.id === 'string')
      .map((match): MyMatchItem => {
        const type: MyMatchType = match.type === 'team' || match.type === 'mercenary' ? match.type : 'personal'
        const imageSrc =
          typeof match.imageSrc === 'string' && match.imageSrc
            ? match.imageSrc
            : type === 'team'
              ? matchList02
              : type === 'mercenary'
                ? matchList03
                : matchList01
        const rawDate = typeof match.date === 'string' ? match.date : '2026-05-18'
        const dateLabel = rawDate.replaceAll('-', '.')
        const time = typeof match.time === 'string' ? match.time : '14:00'
        const region = typeof match.region === 'string' ? match.region : '서울'
        const fieldName = typeof match.fieldName === 'string' ? match.fieldName : '어반 CQB'
        const title = typeof match.title === 'string' ? match.title : '내가 만든 매치'

        return {
          id: `created-${match.id}`,
          matchId: match.id,
          status: 'applied',
          type,
          title,
          time: `${dateLabel} · ${time}`,
          detail: `${dateLabel} ${time} I ${fieldName}`,
          region,
          fieldName,
          currentParticipants: Number(match.currentParticipants) || 1,
          maxParticipants: Number(match.maxParticipants) || 12,
          imageSrc,
          tagLabel: '모집 중',
          to: '/match/manage',
          isMine: true,
        }
      })
  } catch {
    return []
  }
}

function createJoinedMatches(canceledIds: string[], existingMatchIds: string[]) {
  return readStringList(JOINED_MATCH_IDS_KEY)
    .filter((id) => !canceledIds.includes(id) && !existingMatchIds.includes(id))
    .map((matchId) => matches.find((match) => match.id === matchId))
    .filter((match): match is NonNullable<typeof match> => Boolean(match))
    .map((match): MyMatchItem => ({
      id: `joined-${match.id}`,
      matchId: match.id,
      status: 'applied',
      type: 'personal',
      title: match.title,
      time: `${match.dateValue?.replaceAll('-', '.') ?? match.date} · ${match.time}`,
      detail: `${match.date} ${match.time} I ${match.fieldName}`,
      region: match.region,
      fieldName: match.fieldName,
      currentParticipants: match.currentParticipants,
      maxParticipants: match.maxParticipants,
      imageSrc: matchList01,
      tagLabel: '신청 중',
      to: `/match/detail/${match.id}`,
    }))
}

export function getMyMatches() {
  const canceledIds = readStringList(CANCELED_MATCH_IDS_KEY)
  const baseMatches = defaultMyMatches.filter((match) => !canceledIds.includes(match.matchId))
  const joinedMatches = createJoinedMatches(
    canceledIds,
    baseMatches.map((match) => match.matchId),
  )
  const createdMatches = readCreatedMatches()

  return [...baseMatches, ...joinedMatches, ...createdMatches]
}

export function getMyMatchGroups() {
  const all = getMyMatches()
  const applied = all.filter((match) => match.status === 'applied')
  const confirmed = all.filter((match) => match.status === 'confirmed')
  const past = all.filter((match) => match.status === 'past')
  const created = all.filter((match) => match.isMine)

  return {
    all,
    applied,
    confirmed,
    past,
    created,
  }
}
