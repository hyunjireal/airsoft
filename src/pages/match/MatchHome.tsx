import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { consumeMatchRegistrationToastPending, MatchRegistrationToast } from './MatchRegistrationToast'
import { MatchTypeSheet } from './MatchTypeSheet'
import AnimatedList from '../../components/AnimatedList'
import KeywordTag from '../../components/KeywordTag'
import MainTag from '../../components/MainTag'
import More from '../../components/More'
import { PageHeader } from '../../components/PageHeader'
import matchPlusIcon from '../../asset/icons/match_plus.svg'
import matchPresetIcon from '../../asset/icons/match_preset.svg'
import matchNewIcon from '../../asset/icons/match_new.svg'
import presetCheckIcon from '../../asset/icons/preset_check.svg'
import presetPlusIcon from '../../asset/icons/preset_plus.svg'
import matchNolistImage from '../../asset/images/match_nolist01.png'
import mainUserImage from '../../asset/images/main_user01.png'
import matchList01 from '../../asset/images/match_list01.jpg'
import matchList02 from '../../asset/images/match_list02.jpg'
import matchList03 from '../../asset/images/match_list03.jpg'
import matchList04 from '../../asset/images/match_list04.jpg'
import matchList05 from '../../asset/images/match_list05.jpg'
import { LoginButton } from '../../components/LoginButton'
import { getMyMatchGroups } from '../my/myMatchData'
import { cacheMatchSnapshot } from './matchApplicationStorage'
import {
  readAppliedMatchPresetId,
  readMatchPresets,
  writeAppliedMatchPresetId,
  type MatchPresetItem,
} from './matchPresetStorage'
import './match.css'

type MatchType = 'personal' | 'team' | 'mercenary'

type MatchSchedule = {
  id: string
  type: MatchType
  title: string
  time: string
  region: string
  fieldName: string
  difficulty: string
  currentParticipants: number
  maxParticipants: number
  action: string
  body?: string
  date?: string
  imageSrc?: string
}

type MatchTypeFilter = 'all' | MatchType
type MatchPresetId = string
type WeekSlideDirection = 'prev' | 'next' | null

type AiRecommendedMatch = {
  id: string
  title: string
  time: string
  region: string
  matchRate: number
  currentMembers: number
  maxMembers: number
  imageSrc: string
}

const CREATED_MATCHES_KEY = 'airsoft:created-matches'
const CREATED_MATCH_FOCUS_DATE_KEY = 'airsoft:created-match-focus-date'

const typeFilters: Array<{ label: string; value: MatchTypeFilter }> = [
  { label: '전체', value: 'all' },
  { label: '개인', value: 'personal' },
  { label: '팀', value: 'team' },
  { label: '용병', value: 'mercenary' },
]

type MatchPresetOption = MatchPresetItem & {
  icon: string
  isCreateAction?: boolean
}

function createMatchPresetOptions(): MatchPresetOption[] {
  return [
    ...readMatchPresets().map((preset) => ({
      ...preset,
      icon: preset.isCustom ? presetPlusIcon : presetCheckIcon,
    })),
    {
      id: 'custom',
      title: '커스텀 프리셋',
      description: '직접 설정하는 맞춤 프리셋',
      level: [],
      distance: [],
      distanceValue: 10,
      time: [],
      weekdays: [],
      playStyle: [],
      gameTone: [],
      teamwork: [],
      priority: [],
      purpose: [],
      icon: presetPlusIcon,
      isCreateAction: true,
    },
  ]
}

const homeMatchMoreStyle = {
  gap: 4,
  color: '#9f9f9f',
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '130%',
  letterSpacing: '-0.02em',
} as const

const aiRecommendedMatches: AiRecommendedMatch[] = [
  {
    id: 'match-003',
    title: '하남시 몬드필드\n주말 정기전',
    time: '5.17 (토) 12:00',
    region: '경기도 하남시',
    matchRate: 100,
    currentMembers: 17,
    maxMembers: 20,
    imageSrc: matchList01,
  },
  {
    id: 'match-011',
    title: '파주 택티컬 필드\n입문 환영전',
    time: '5.18 (일) 10:30',
    region: '경기도 파주시',
    matchRate: 94,
    currentMembers: 12,
    maxMembers: 16,
    imageSrc: matchList02,
  },
  {
    id: 'match-018',
    title: '인천 CQB 아레나\n근거리 스크림',
    time: '5.21 (수) 19:00',
    region: '인천 서구',
    matchRate: 88,
    currentMembers: 9,
    maxMembers: 12,
    imageSrc: matchList03,
  },
  {
    id: 'match-024',
    title: '용인 워게임 파크\n팀플 매치',
    time: '5.24 (토) 14:00',
    region: '경기도 용인시',
    matchRate: 97,
    currentMembers: 22,
    maxMembers: 28,
    imageSrc: matchList04,
  },
  {
    id: 'match-031',
    title: '김포 서바이벌존\n캐주얼 오픈전',
    time: '5.25 (일) 13:30',
    region: '경기도 김포시',
    matchRate: 91,
    currentMembers: 15,
    maxMembers: 20,
    imageSrc: matchList05,
  },
]

const calendarDays: Array<{ label: string; muted?: boolean; types?: MatchType[] }> = [
  { label: '27', muted: true },
  { label: '28', muted: true },
  { label: '29', muted: true },
  { label: '30', muted: true },
  { label: '1' },
  { label: '2', types: ['personal', 'team'] },
  { label: '3', types: ['mercenary'] },
  { label: '4' },
  { label: '5' },
  { label: '6' },
  { label: '7' },
  { label: '8' },
  { label: '9', types: ['personal'] },
  { label: '10', types: ['team'] },
  { label: '11' },
  { label: '12', types: ['personal'] },
  { label: '13' },
  { label: '14' },
  { label: '15', types: ['mercenary'] },
  { label: '16', types: ['team'] },
  { label: '17', types: ['personal'] },
  { label: '18', types: ['personal', 'team', 'mercenary'] },
  { label: '19' },
  { label: '20' },
  { label: '21', types: ['team'] },
  { label: '22' },
  { label: '23', types: ['personal', 'team'] },
  { label: '24', types: ['mercenary'] },
  { label: '25' },
  { label: '26', types: ['team'] },
  { label: '27' },
  { label: '28' },
  { label: '29' },
  { label: '30', types: ['personal', 'team', 'mercenary'] },
  { label: '31', types: ['team'] },
]

const defaultMatchByType: Record<MatchType, Omit<MatchSchedule, 'id' | 'type'>> = {
  personal: {
    title: '초보 환영 야외전',
    time: '14:00',
    region: '경기 남부',
    fieldName: '택티쿨 필드',
    difficulty: '입문자',
    currentParticipants: 18,
    maxParticipants: 24,
    action: '상세 보기',
    imageSrc: matchList01,
  },
  team: {
    title: '팀 단위 전술 스크림',
    time: '15:30',
    region: '경기 북부',
    fieldName: '포레스트 아레나',
    difficulty: '팀',
    currentParticipants: 12,
    maxParticipants: 16,
    action: '상세 보기',
    imageSrc: matchList02,
  },
  mercenary: {
    title: '용병 조인 야외전',
    time: '17:00',
    region: '경기 남부',
    fieldName: '택티쿨 필드',
    difficulty: '용병',
    currentParticipants: 8,
    maxParticipants: 10,
    action: '참가 신청',
    imageSrc: matchList04,
  },
}

const matchesByDay: Record<string, MatchSchedule[]> = {
  '2': [
    {
      id: 'match-002',
      type: 'personal',
      title: '주말 포레스트 매치',
      time: '10:30',
      region: '경기 북부',
      fieldName: '포레스트 아레나',
      difficulty: '초보',
      currentParticipants: 22,
      maxParticipants: 30,
      action: '상세 보기',
      imageSrc: matchList03,
    },
    {
      id: 'match-002-team',
      type: 'team',
      title: '포레스트 팀전',
      time: '15:30',
      region: '경기 북부',
      fieldName: '포레스트 아레나',
      difficulty: '팀',
      currentParticipants: 10,
      maxParticipants: 14,
      action: '상세 보기',
      imageSrc: matchList02,
    },
  ],
  '18': [
    {
      id: 'match-003',
      type: 'personal',
      title: '서울 CQB 입문 스크림',
      time: '12:00',
      region: '서울',
      fieldName: '어반 CQB',
      difficulty: '초보',
      currentParticipants: 14,
      maxParticipants: 16,
      action: '상세 보기',
      imageSrc: matchList05,
    },
    {
      id: 'match-002',
      type: 'team',
      title: '주말 포레스트 매치',
      time: '15:30',
      region: '경기 북부',
      fieldName: '포레스트 아레나',
      difficulty: '팀',
      currentParticipants: 22,
      maxParticipants: 30,
      action: '상세 보기',
      imageSrc: matchList03,
    },
    {
      id: 'match-001',
      type: 'mercenary',
      title: '용병 조인 야외전',
      time: '17:00',
      region: '경기 남부',
      fieldName: '택티쿨 필드',
      difficulty: '용병',
      currentParticipants: 8,
      maxParticipants: 10,
      action: '참가 신청',
      imageSrc: matchList04,
    },
  ],
  '23': [
    {
      id: 'match-001',
      type: 'personal',
      title: '초보 환영 야외전',
      time: '14:00',
      region: '경기 남부',
      fieldName: '택티쿨 필드',
      difficulty: '입문자',
      currentParticipants: 18,
      maxParticipants: 24,
      action: '상세 보기',
      imageSrc: matchList01,
    },
    {
      id: 'match-023-team',
      type: 'team',
      title: '남부 팀 매치',
      time: '16:00',
      region: '경기 남부',
      fieldName: '택티쿨 필드',
      difficulty: '팀',
      currentParticipants: 12,
      maxParticipants: 18,
      action: '상세 보기',
      imageSrc: matchList02,
    },
  ],
  '30': [
    {
      id: 'match-004',
      type: 'team',
      title: '월말 팀 스크림',
      time: '18:00',
      region: '서울',
      fieldName: '어반 CQB',
      difficulty: '팀',
      currentParticipants: 12,
      maxParticipants: 16,
      action: '상세 보기',
      imageSrc: matchList05,
    },
    {
      id: 'match-030-personal',
      type: 'personal',
      title: '월말 개인 CQB',
      time: '12:00',
      region: '서울',
      fieldName: '어반 CQB',
      difficulty: '초보',
      currentParticipants: 9,
      maxParticipants: 16,
      action: '상세 보기',
      imageSrc: matchList03,
    },
    {
      id: 'match-030-mercenary',
      type: 'mercenary',
      title: '월말 용병 조인',
      time: '19:00',
      region: '서울',
      fieldName: '어반 CQB',
      difficulty: '용병',
      currentParticipants: 6,
      maxParticipants: 10,
      action: '참가 신청',
      imageSrc: matchList04,
    },
  ],
}

function createMatchesForDay(dayLabel: string) {
  const day = calendarDays.find((item) => item.label === dayLabel && !item.muted)

  return (day?.types ?? []).map((type, index) => ({
    id: `match-${dayLabel}-${type}`,
    type,
    ...defaultMatchByType[type],
    time: index === 0 ? defaultMatchByType[type].time : `${15 + index}:30`,
  }))
}

function filterMatches(matches: MatchSchedule[], filter: MatchTypeFilter) {
  if (filter === 'all') {
    return matches
  }

  return matches.filter((match) => match.type === filter)
}

function formatCalendarTitle(month: Date) {
  return `${month.getFullYear()}. ${String(month.getMonth() + 1).padStart(2, '0')}`
}

const weekDayLabels = ['일', '월', '화', '수', '목', '금', '토']
const WEEK_SWIPE_THRESHOLD = 48

function getWeekDates(date: Date) {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())

  return Array.from({ length: 7 }, (_, index) => {
    const nextDate = new Date(start)
    nextDate.setDate(start.getDate() + index)
    return nextDate
  })
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isPastDate(date: Date) {
  return getStartOfDay(date).getTime() < getStartOfDay(new Date()).getTime()
}

function isPastSchedule(match: Pick<MatchSchedule, 'time'>, date: Date) {
  const [hourText, minuteText] = match.time.split(':')
  const hour = Number(hourText)
  const minute = Number(minuteText)

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return isPastDate(date)
  }

  const scheduleDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute)
  return scheduleDate.getTime() < Date.now()
}

function getMatchTypeLabel(match: MatchSchedule) {
  if (match.type === 'personal') return '개인'
  if (match.type === 'team') return '팀'

  return match.difficulty
}

function getAiMatchFieldName(match: AiRecommendedMatch) {
  return match.title.split('\n')[0] || match.region
}

function getAiMatchDateValue(match: AiRecommendedMatch) {
  const dateMatch = match.time.match(/(\d{1,2})\.(\d{1,2})/)
  if (!dateMatch) return undefined

  return `2026-${dateMatch[1].padStart(2, '0')}-${dateMatch[2].padStart(2, '0')}`
}

function getAiMatchTime(match: AiRecommendedMatch) {
  return match.time.match(/\d{1,2}:\d{2}/)?.[0] ?? match.time
}

const matchTypeColor: Record<MatchType, string> = {
  team: 'var(--color-navy)',
  personal: 'var(--color-teal)',
  mercenary: 'var(--color-khaki)',
}

function isMatchType(type: unknown): type is MatchType {
  return type === 'personal' || type === 'team' || type === 'mercenary'
}

function isMyCreatedMatch(match: MatchSchedule) {
  return match.id.startsWith('created-')
}

function readCreatedMatches() {
  if (typeof window === 'undefined') {
    return []
  }

  const savedMatches = (() => {
    try {
      return JSON.parse(localStorage.getItem(CREATED_MATCHES_KEY) ?? '[]')
    } catch {
      return []
    }
  })()

  if (!Array.isArray(savedMatches)) {
    return []
  }

  return savedMatches
    .filter((match): match is MatchSchedule => {
      return (
        typeof match === 'object' &&
        match !== null &&
        'type' in match &&
        isMatchType(match.type)
      )
    })
    .map((match) => ({
      ...match,
      imageSrc: match.imageSrc ?? (match.type === 'team' ? matchList02 : match.type === 'mercenary' ? matchList04 : matchList01),
    }))
}

function readFocusedMatchDate() {
  const today = new Date()
  const defaultDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  if (typeof window === 'undefined') {
    return defaultDate
  }

  const savedDate = localStorage.getItem(CREATED_MATCH_FOCUS_DATE_KEY)
  localStorage.removeItem(CREATED_MATCH_FOCUS_DATE_KEY)

  if (!savedDate) {
    return defaultDate
  }

  const date = new Date(`${savedDate}T00:00:00`)
  return Number.isNaN(date.getTime()) ? defaultDate : date
}

export function MatchHome() {
  const navigate = useNavigate()
  const location = useLocation()
  const scheduleSectionRef = useRef<HTMLElement | null>(null)
  const aiSectionRef = useRef<HTMLElement | null>(null)
  const weekDragRef = useRef<{ pointerId: number; startX: number; startY: number } | null>(null)
  const suppressWeekDayClickRef = useRef(false)
  const [selectedDate, setSelectedDate] = useState<Date>(() => readFocusedMatchDate())
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  )
  const [matchTypeFilter, setMatchTypeFilter] = useState<MatchTypeFilter>('all')
  const [createdMatches] = useState<MatchSchedule[]>(readCreatedMatches)
  const [registrationToastOpen, setRegistrationToastOpen] = useState(false)
  const [showPresetSheet, setShowPresetSheet] = useState(false)
  const [matchPresetOptions, setMatchPresetOptions] = useState(createMatchPresetOptions)
  const [appliedPresetId, setAppliedPresetId] = useState<MatchPresetId>(readAppliedMatchPresetId)
  const [selectedPresetId, setSelectedPresetId] = useState<MatchPresetId>(readAppliedMatchPresetId)
  const [weekSlideDirection, setWeekSlideDirection] = useState<WeekSlideDirection>(null)
  const [weekDragOffset, setWeekDragOffset] = useState(0)
  const [isWeekDragging, setIsWeekDragging] = useState(false)
  const [aiMatchIndex, setAiMatchIndex] = useState(0)
  const [isAiMatchRefreshing, setIsAiMatchRefreshing] = useState(false)
  const myMatchGroups = getMyMatchGroups()
  const presetSelectionOptions = matchPresetOptions.filter((preset) => !preset.isCreateAction)
  const appliedPreset = presetSelectionOptions.find((preset) => preset.id === appliedPresetId) ?? presetSelectionOptions[0]
  const appliedPresetTitle = appliedPreset?.title ?? '프리셋 없음'
  const appliedPresetSummary = appliedPreset
    ? `${appliedPreset.distance[0] ?? '거리 미정'} · ${appliedPreset.weekdays.join(', ') || '요일 미정'} · ${appliedPreset.level[0] ?? '숙련도 미정'}`
    : '프리셋을 만들어 추천 조건을 설정하세요'
  const aiRecommendedMatch = aiRecommendedMatches[aiMatchIndex]
  const hiddenAiMemberCount = Math.max(aiRecommendedMatch.currentMembers - 3, 0)
  const selectedDay = String(selectedDate.getDate())
  const selectedDateLabel = `${selectedDate.getMonth() + 1}월 ${selectedDay}일`
  const isSelectedMatchMonth = selectedDate.getFullYear() === 2026 && selectedDate.getMonth() === 4
  const selectedDateKey = [
    selectedDate.getFullYear(),
    String(selectedDate.getMonth() + 1).padStart(2, '0'),
    String(selectedDate.getDate()).padStart(2, '0'),
  ].join('-')
  const isSelectedDatePast = isPastDate(selectedDate)
  const selectedDayCreatedMatches = createdMatches.filter((match) => match.date === selectedDateKey)
  const selectedDayMatches = isSelectedMatchMonth
    ? [...(matchesByDay[selectedDay] ?? createMatchesForDay(selectedDay)), ...selectedDayCreatedMatches]
    : selectedDayCreatedMatches
  const selectedMatches = filterMatches(selectedDayMatches, matchTypeFilter)
  const filteredDefaultMatchDates = calendarDays
    .filter((day) => {
      if (day.muted) return false

      const dayMatches = matchesByDay[day.label] ?? createMatchesForDay(day.label)
      return filterMatches(dayMatches, matchTypeFilter).length > 0
    })
    .map((day) => new Date(2026, 4, Number(day.label)))
  const filteredCreatedMatchDates = createdMatches
    .filter((match) => filterMatches([match], matchTypeFilter).length > 0 && match.date)
    .map((match) => new Date(`${match.date}T00:00:00`))
    .filter((date) => !Number.isNaN(date.getTime()))
  const filteredMatchDates = [...filteredDefaultMatchDates, ...filteredCreatedMatchDates]
  const weekDates = getWeekDates(selectedDate)
  const selectedWeekDayIndex = Math.max(weekDates.findIndex((date) => isSameDay(date, selectedDate)), 0)
  const moveWeek = (direction: Exclude<WeekSlideDirection, null>) => {
    setWeekSlideDirection(direction)
    setSelectedDate((date) => {
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + (direction === 'next' ? 7 : -7))
      setCalendarMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1))
      return nextDate
    })
  }
  const goPrevWeek = () => {
    moveWeek('prev')
  }
  const goNextWeek = () => {
    moveWeek('next')
  }
  const handleWeekPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    weekDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  const handleWeekPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = weekDragRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY
    const isHorizontalDrag = Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)

    if (!isHorizontalDrag) return

    event.preventDefault()
    setIsWeekDragging(true)
    setWeekDragOffset(Math.max(-72, Math.min(72, deltaX * 0.45)))
  }
  const handleWeekPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = weekDragRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return

    weekDragRef.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    setIsWeekDragging(false)
    setWeekDragOffset(0)

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY
    const isHorizontalSwipe = Math.abs(deltaX) >= WEEK_SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.2

    if (!isHorizontalSwipe) return

    suppressWeekDayClickRef.current = true
    moveWeek(deltaX < 0 ? 'next' : 'prev')
    window.setTimeout(() => {
      suppressWeekDayClickRef.current = false
    }, 350)
  }
  const handleWeekPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (weekDragRef.current?.pointerId === event.pointerId) {
      weekDragRef.current = null
      setIsWeekDragging(false)
      setWeekDragOffset(0)
    }
  }
  const goBack = () => {
    navigate('/home')
  }

  const [showTypeSheet, setShowTypeSheet] = useState(false)

  useEffect(() => {
    if (consumeMatchRegistrationToastPending()) {
      setRegistrationToastOpen(true)
      window.setTimeout(() => {
        scheduleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 180)
    }
  }, [])

  useEffect(() => {
    const syncPresets = () => {
      const nextOptions = createMatchPresetOptions()
      const nextAppliedPresetId = readAppliedMatchPresetId()

      setMatchPresetOptions(nextOptions)
      setAppliedPresetId(nextAppliedPresetId)
      setSelectedPresetId((currentId) => {
        return nextOptions.some((preset) => preset.id === currentId) ? currentId : nextAppliedPresetId
      })
    }

    window.addEventListener('focus', syncPresets)
    window.addEventListener('storage', syncPresets)

    return () => {
      window.removeEventListener('focus', syncPresets)
      window.removeEventListener('storage', syncPresets)
    }
  }, [])

  useEffect(() => {
    if ((location.state as { scrollTo?: string } | null)?.scrollTo === 'ai-recommend') {
      window.setTimeout(() => {
        aiSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }
  }, [location.state])

  const handleTypeSelect = (kind: 'personal' | 'team' | 'guest', guestFlow?: 'wanted' | 'join') => {
    if (kind !== 'guest') {
      return
    }

    setShowTypeSheet(false)
    if (guestFlow === 'wanted') {
      navigate(`/match/create/guest-wanted?date=${selectedDateKey}`)
      return
    }

    if (guestFlow === 'join') {
      navigate(`/match/create/guest-join?date=${selectedDateKey}`)
      return
    }
  }

  const openPresetSheet = () => {
    setSelectedPresetId(appliedPresetId)
    setShowPresetSheet(true)
  }

  const applyPreset = () => {
    writeAppliedMatchPresetId(selectedPresetId)
    setAppliedPresetId(selectedPresetId)
    setShowPresetSheet(false)
  }

  const refreshAiRecommendedMatch = () => {
    if (isAiMatchRefreshing) return

    setIsAiMatchRefreshing(true)
    window.setTimeout(() => {
      setAiMatchIndex((currentIndex) => {
        if (aiRecommendedMatches.length <= 1) return currentIndex

        let nextIndex = currentIndex

        while (nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * aiRecommendedMatches.length)
        }

        return nextIndex
      })
    }, 160)
    window.setTimeout(() => {
      setIsAiMatchRefreshing(false)
    }, 420)
  }

  const cacheScheduleMatch = (match: MatchSchedule) => {
    cacheMatchSnapshot({
      id: match.id,
      type: match.type,
      title: match.title,
      date: selectedDateKey,
      dateValue: selectedDateKey,
      time: match.time,
      region: match.region,
      fieldName: match.fieldName,
      difficulty: match.difficulty,
      currentParticipants: match.currentParticipants,
      maxParticipants: match.maxParticipants,
      imageSrc: match.imageSrc,
    })
  }

  return (
    <div className="match_page">
      <PageHeader
        className="match_page_header"
        backButtonClassName="match_page_back_button"
        layout="standard"
        title="매치"
        titleClassName="match_page_title"
        onBack={goBack}
      />

      <section className="match_home_my_matches" aria-labelledby="match-status-title">
        <div className="my_matches_heading">
          <h2 id="match-status-title" className="my_section_title">내 매치</h2>
          <More
            className="my_matches_more"
            style={homeMatchMoreStyle}
            state={{ from: '/match' }}
            to="/my/schedule"
          />
        </div>

        <div className="match_status_list">
          <Link className="match_status_summary_card is_waiting" to="/my/schedule?tab=applied" state={{ from: '/match' }}>
            <span>
              <strong>승인대기 일정</strong>
              <small>참가 신청한 매치를 확인하세요</small>
            </span>
            <b>{myMatchGroups.applied.length}건</b>
          </Link>
          <Link className="match_status_summary_card is_confirmed" to="/my/schedule?tab=confirmed" state={{ from: '/match' }}>
            <span>
              <strong>확정 일정</strong>
              <small>확정된 매치 일정을 확인하세요</small>
            </span>
            <b>{myMatchGroups.confirmed.length}건</b>
          </Link>
        </div>
      </section>

      <section className="match_section match_ai_recommend_section" aria-labelledby="match-ai-title" ref={aiSectionRef}>
        <div className="match_ai_heading">
          <h2 id="match-ai-title" className="match_section_title">AI 추천 매치</h2>
          <button className="match_ai_preset_button" type="button" onClick={openPresetSheet}>
            <img src={matchPresetIcon} alt="" aria-hidden="true" />
            <span>프리셋</span>
          </button>
        </div>

        <div className="match_ai_recommend_group">
          <div className="match_ai_preset_card">
            <strong>적용된 프리셋</strong>
            <p>
              <span>{appliedPresetTitle}</span>
              {appliedPresetSummary}
            </p>
          </div>

          <article className={`match_ai_match_card${isAiMatchRefreshing ? ' is_refreshing' : ''}`} key={aiRecommendedMatch.id}>
            <img className="match_ai_match_bg" src={aiRecommendedMatch.imageSrc} alt="" aria-hidden="true" />
            <div className="match_ai_match_top">
              <div>
                <h3>
                  {aiRecommendedMatch.title.split('\n').map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p className="match_ai_match_meta">
                  <span>{aiRecommendedMatch.time}</span>
                  <span>{aiRecommendedMatch.region}</span>
                </p>
              </div>
              <button
                className="match_ai_percent"
                type="button"
                aria-label="AI 추천 매치 새로고침"
                disabled={isAiMatchRefreshing}
                onClick={refreshAiRecommendedMatch}
              >
                <img src={matchNewIcon} alt="" aria-hidden="true" />
                <div>
                  <span>매칭률</span>
                  <strong>{aiRecommendedMatch.matchRate}%</strong>
                </div>
              </button>
            </div>
            <div className="match_ai_match_bottom">
              <div className="match_ai_members">
                <div className="match_ai_member_avatars" aria-hidden="true">
                  <img src={mainUserImage} alt="" />
                  <img src={mainUserImage} alt="" />
                  <img src={mainUserImage} alt="" />
                </div>
                <span>+{hiddenAiMemberCount}명</span>
              </div>
              <strong>{aiRecommendedMatch.currentMembers} <small>/ {aiRecommendedMatch.maxMembers}</small></strong>
            </div>
          </article>
          <Link
            className="match_full_button match_dark_button match_ai_join_button"
            to={`/match/schedule/${aiRecommendedMatch.id}/join`}
            onClick={() =>
              cacheMatchSnapshot({
                id: aiRecommendedMatch.id,
                type: 'personal',
                title: aiRecommendedMatch.title.replace(/\n/g, ' '),
                date: getAiMatchDateValue(aiRecommendedMatch) ?? selectedDateKey,
                dateValue: getAiMatchDateValue(aiRecommendedMatch) ?? selectedDateKey,
                time: getAiMatchTime(aiRecommendedMatch),
                region: aiRecommendedMatch.region,
                fieldName: getAiMatchFieldName(aiRecommendedMatch),
                difficulty: 'AI 추천',
                currentParticipants: aiRecommendedMatch.currentMembers,
                maxParticipants: aiRecommendedMatch.maxMembers,
                imageSrc: aiRecommendedMatch.imageSrc,
              })
            }
          >
            참가하기
          </Link>
        </div>
      </section>

      <section ref={scheduleSectionRef} className="match_section match_schedule_section" aria-labelledby="match-schedule-title">
        <div>
          <h2 id="match-schedule-title" className="match_section_title">매치 일정 탐색</h2>
          <p className="match_section_description">참가 방식을 고르고 날짜를 선택하면 해당 일정이 바로 이어져요.</p>
        </div>

        <div className="match_type_filters" aria-label="참가 방식 필터">
          {typeFilters.map((filter) => (
            <button
              className={`match_type_filter ${matchTypeFilter === filter.value ? 'is_active' : ''}`}
              type="button"
              key={filter.value}
              data-type={filter.value}
              onClick={() => setMatchTypeFilter(filter.value)}
            >
              <KeywordTag className="match_type_filter_tag">{filter.label}</KeywordTag>
            </button>
          ))}
        </div>

        <div className="match_calendar_view">
          <article className="match_month_card">
            <div className="match_month_header">
              <button type="button" aria-label="이전 주" onClick={goPrevWeek}>&lt;</button>
              <h3>{formatCalendarTitle(calendarMonth)}</h3>
              <button type="button" aria-label="다음 주" onClick={goNextWeek}>&gt;</button>
            </div>

            <div className="match_week_calendar_view">
              <div
                className={[
                  'match_week_calendar',
                  weekSlideDirection === 'prev' ? 'is_sliding_prev' : '',
                  weekSlideDirection === 'next' ? 'is_sliding_next' : '',
                  isWeekDragging ? 'is_dragging' : '',
                ].filter(Boolean).join(' ')}
                style={{
                  '--selected-day-index': selectedWeekDayIndex,
                  '--week-drag-offset': `${weekDragOffset}px`,
                } as CSSProperties}
                role="list"
                aria-label="주간 매치 일정 달력"
                onPointerDown={handleWeekPointerDown}
                onPointerMove={handleWeekPointerMove}
                onPointerUp={handleWeekPointerUp}
                onPointerCancel={handleWeekPointerCancel}
                onAnimationEnd={() => setWeekSlideDirection(null)}
              >
              {weekDates.map((date) => {
                const isSelected = isSameDay(date, selectedDate)
                const hasMatch = filteredMatchDates.some((matchDate) => isSameDay(matchDate, date))
                const day = date.getDay()
                const isPast = isPastDate(date)

                return (
                  <button
                    className={[
                      'match_week_day',
                      isSelected ? 'is_selected' : '',
                      hasMatch ? 'has_match' : '',
                      isPast ? 'is_past' : '',
                      day === 0 ? 'is_sunday' : '',
                      day === 6 ? 'is_saturday' : '',
                    ].filter(Boolean).join(' ')}
                    type="button"
                    key={date.toISOString()}
                    onClick={() => {
                      if (suppressWeekDayClickRef.current) {
                        suppressWeekDayClickRef.current = false
                        return
                      }
                      setSelectedDate(date)
                      setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1))
                    }}
                    aria-pressed={isSelected}
                    aria-label={`${date.getMonth() + 1}월 ${date.getDate()}일 ${weekDayLabels[day]}요일`}
                  >
                    <i aria-hidden="true" />
                    <strong>{date.getDate()}</strong>
                    <span>{weekDayLabels[day]}</span>
                  </button>
                )
              })}
              </div>
            </div>
          </article>

          <article className={`match_selected_schedule${isSelectedDatePast ? ' is_past' : ''}`}>
            <div className="match_selected_schedule_header">
              <h3 aria-label={`${selectedDateLabel} 일정 ${selectedMatches.length}건`}>{selectedDateLabel}</h3>
              {isSelectedDatePast ? (
                <span className="match_past_date_label">지난 날짜</span>
              ) : (
                <button
                  className="match_manage_button"
                  type="button"
                  aria-label="일정 만들기"
                  onClick={() => setShowTypeSheet(true)}
                >
                  <img src={matchPlusIcon} alt="" aria-hidden="true" />
                  <span>일정 만들기</span>
                </button>
              )}
            </div>
            {selectedMatches.length > 0 ? (
              <>
                <div className="match_selected_list">
                  {selectedMatches.map((match) => {
                    const isMine = isMyCreatedMatch(match)
                    const isPastMatch = isPastSchedule(match, selectedDate)

                    return (
                      <Link
                        className={[
                          'match_selected_item',
                          isMine ? 'is_mine' : '',
                          isPastMatch ? 'is_past' : '',
                        ].filter(Boolean).join(' ')}
                        to={isPastMatch ? '#' : isMine ? `/match/edit/${match.id}` : `/match/schedule/${match.id}/join`}
                        aria-label={isPastMatch ? `${match.title} 지난 일정` : isMine ? `${match.title} 수정하기` : `${match.title} 참가 안내 보기`}
                        aria-disabled={isPastMatch}
                        tabIndex={isPastMatch ? -1 : undefined}
                        onClick={(event) => {
                          if (isPastMatch) {
                            event.preventDefault()
                            return
                          }

                          if (!isMine) {
                            cacheScheduleMatch(match)
                          }
                        }}
                        key={match.id}
                      >
                        <div className="match_selected_item_main">
                          <MainTag
                            className="match_item_tag"
                            style={{ padding: '3px 10px', backgroundColor: matchTypeColor[match.type], color: 'var(--color-white)' }}
                          >
                            {getMatchTypeLabel(match)}
                          </MainTag>
                          {isPastMatch || isMine ? (
                            <div className="match_schedule_badge_stack" aria-hidden="true">
                              {isMine ? <span className="match_my_schedule_badge">내가 올린 일정</span> : null}
                              {isPastMatch ? <span className="match_past_schedule_badge">지난 일정</span> : null}
                            </div>
                          ) : null}
                          <div className="match_item_media">
                            <img className="match_selected_thumb" src={match.imageSrc ?? matchList01} alt="" aria-hidden="true" />
                            <div className="match_selected_info">
                              <strong className="match_item_title">{match.title}</strong>
                              <div className="match_item_meta">
                                <p className="match_meta_row">
                                  <span className="match_meta_label">시간</span>
                                  <span className="match_meta_value">{match.time}</span>
                                </p>
                                <p className="match_meta_row">
                                  <span className="match_meta_label">장소</span>
                                  <span className="match_meta_value">{match.region} · {match.fieldName}</span>
                                </p>
                              </div>
                              <p className="match_meta_row">
                                <span className="match_meta_label">인원</span>
                                <span className="match_meta_value">{match.currentParticipants}/{match.maxParticipants}명</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                <Link className="match_full_button match_dark_button" to="/match">
                  전체 보기
                </Link>
              </>
            ) : (
              <article className="match_empty_recommend_card">
                <div className="match_empty_recommend_copy">
                  {isSelectedDatePast ? (
                    <>
                      <h3>지난 날짜예요</h3>
                      <p>이 날짜에는<br />확인할 수 있는<br />일정이 없어요.</p>
                    </>
                  ) : (
                    <>
                      <h3>일정이 없나요?</h3>
                      <p>다른 날짜를 보거나<br />AI가 추천하는<br />맞춤 일정을 찾아보세요.</p>
                    </>
                  )}
                </div>
                <img className="match_empty_recommend_img" src={matchNolistImage} alt="" aria-hidden="true" />
                {!isSelectedDatePast ? (
                  <div className="match_empty_recommend_actions">
                    <LoginButton
                      className="match_empty_login_btn"
                      style={{ background: 'rgba(0,0,0,0.55)', color: 'var(--color-white)', fontSize: 16, fontWeight: 500 }}
                      onClick={() => setShowTypeSheet(true)}
                    >
                      일정 만들러 가기
                    </LoginButton>
                  </div>
                ) : null}
              </article>
            )}
          </article>
        </div>
      </section>

      <section className="match_section match_tournament_section" aria-labelledby="match-tournament-title">
        <Link className="match_tournament_card" to="/tournament" aria-labelledby="match-tournament-title">
          <MainTag className="match_tournament_tag" style={{ padding: '3px 8px', background: 'var(--color-orange-red)' }}>
            <span className="match_tournament_tag_dot" aria-hidden="true" />
            <span>토너먼트 진행중</span>
          </MainTag>

          <div className="match_tournament_textbox">
            <div className="match_tournament_titlebox">
              <h2 id="match-tournament-title" className="match_tournament_title">
                곧 시작되는 <span>4강전</span>
              </h2>
              <p className="match_tournament_desc">치열한 승부가 펼쳐집니다!</p>
            </div>
            <div className="match_tournament_info">
              <p className="match_tournament_time">오늘 18:00</p>
              <p className="match_tournament_matchup">바주카 VS 블랙워터</p>
            </div>
          </div>
        </Link>
      </section>

      <MatchTypeSheet
        open={showTypeSheet}
        onClose={() => setShowTypeSheet(false)}
        onSelect={handleTypeSelect}
      />

      {showPresetSheet ? (
        <div className="match_preset_sheet_layer" role="presentation">
          <div className="match_preset_sheet_backdrop" onClick={() => setShowPresetSheet(false)} aria-hidden="true" />
          <section
            className="match_preset_sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="match-preset-sheet-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="match_preset_sheet_top">
              <span className="match_preset_sheet_handle" aria-hidden="true" />
              <h2 id="match-preset-sheet-title" className="match_preset_sheet_title">
                프리셋 변경
              </h2>
            </div>

            <div className="match_preset_sheet_body">
              <AnimatedList
                items={matchPresetOptions}
                className="match_preset_option_list"
                displayScrollbar={false}
                showGradients={false}
                enableArrowNavigation={false}
                initialSelectedIndex={matchPresetOptions.findIndex((preset) => preset.id === selectedPresetId)}
                onItemSelect={(preset) => {
                  if (preset.isCreateAction) {
                    setShowPresetSheet(false)
                    navigate('/match/presets/create')
                    return
                  }

                  setSelectedPresetId(preset.id)
                }}
                renderItem={(preset) => {
                  const isSelected = selectedPresetId === preset.id
                  return (
                    <button
                      className={`match_preset_option${isSelected ? ' is_selected' : ''}`}
                      type="button"
                    >
                      <span className="match_preset_option_text">
                        <strong>{preset.title}</strong>
                        <span>{preset.description}</span>
                      </span>
                      <span className="match_preset_option_icon_wrap" aria-hidden="true">
                        {isSelected || preset.isCreateAction ? (
                          <img
                            src={preset.icon}
                            alt=""
                            className={`match_preset_option_icon${preset.isCreateAction ? ' is_plus' : ''}`}
                          />
                        ) : (
                          <span className="match_preset_option_empty_icon" />
                        )}
                      </span>
                    </button>
                  )
                }}
              />

              <div className="match_preset_sheet_bottom">
                <LoginButton className="match_preset_apply_button" onClick={applyPreset}>
                  적용하기
                </LoginButton>
                <button
                  className="match_preset_manage_text"
                  type="button"
                  onClick={() => {
                    setShowPresetSheet(false)
                    navigate('/match/presets')
                  }}
                >
                  프리셋 관리
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <MatchRegistrationToast open={registrationToastOpen} onClose={() => setRegistrationToastOpen(false)} />
    </div>
  )
}

