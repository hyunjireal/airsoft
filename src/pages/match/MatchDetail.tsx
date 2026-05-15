import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import refreshIcon from '../../asset/icons/match_new.svg'
import { matches } from '../../data/mockData'
import { RequireLoginModal } from '../../layout/RequireLoginModal'
import './match.css'

const JOINED_MATCH_IDS_KEY = 'joinedMatchIds'
const CANCELED_MATCH_IDS_KEY = 'airsoft:canceled-match-ids'
const CREATED_MATCHES_KEY = 'airsoft:created-matches'
const DEFAULT_APPLIED_MATCH_IDS = ['match-003', 'match-002']

type CreatedMatchDetail = {
  id: string
  type?: 'personal' | 'team' | 'mercenary'
  title?: string
  date?: string
  time?: string
  region?: string
  fieldName?: string
  difficulty?: string
  currentParticipants?: number
  maxParticipants?: number
  body?: string
}

const detailApplicants = [
  { name: '에어솔져', role: '팀장 / 중급', status: 'confirmed' },
  { name: '블랙호크', role: '용병 / 중급', status: 'confirmed' },
  { name: '스나이퍼윤', role: '용병 / 고급', status: 'waiting' },
  { name: '건맨', role: '용병 / 고급', status: 'waiting' },
  { name: '김루키', role: '용병 / 중급', status: 'waiting' },
]

function readStringList(key: string) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function writeStringList(key: string, value: string[]) {
  localStorage.setItem(key, JSON.stringify(Array.from(new Set(value))))
}

function readCreatedMatches(): CreatedMatchDetail[] {
  try {
    const value = JSON.parse(localStorage.getItem(CREATED_MATCHES_KEY) ?? '[]')
    return Array.isArray(value) ? value.filter((item): item is CreatedMatchDetail => Boolean(item) && typeof item === 'object') : []
  } catch {
    return []
  }
}

function getRecruitTypeLabel(type?: CreatedMatchDetail['type']) {
  if (type === 'personal') return '개인'
  if (type === 'mercenary') return '용병'

  return '팀 / 용병 가능'
}

function formatMatchDetailDate(match: { date: string; dateValue?: string }) {
  if (!match.dateValue) return match.date

  const date = new Date(`${match.dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) return match.date

  return `${date.getMonth() + 1}/${date.getDate()}`
}

export function MatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)
  const [isApplicantsRefreshing, setIsApplicantsRefreshing] = useState(false)
  const hideCancelApplication = Boolean(
    (location.state as { hideCancelApplication?: boolean } | null)?.hideCancelApplication,
  )
  const createdMatch = readCreatedMatches().find((item) => item.id === id)
  const defaultMatch = matches.find((item) => item.id === id)
  const match = createdMatch
    ? {
        id: createdMatch.id,
        title: createdMatch.title ?? '새 매치',
        date: createdMatch.date ?? '2026-05-18',
        dateValue: createdMatch.date,
        time: createdMatch.time ?? '14:00',
        region: createdMatch.region ?? '서울',
        fieldName: createdMatch.fieldName ?? '필드 미정',
        difficulty: createdMatch.difficulty ?? getRecruitTypeLabel(createdMatch.type),
        currentParticipants: Number(createdMatch.currentParticipants) || 1,
        maxParticipants: Number(createdMatch.maxParticipants) || 12,
        body: createdMatch.body,
        recruitTypeLabel: getRecruitTypeLabel(createdMatch.type),
      }
    : defaultMatch

  const isApplied = useMemo(() => {
    if (!id) return false

    const joinedIds = readStringList(JOINED_MATCH_IDS_KEY)
    const canceledIds = readStringList(CANCELED_MATCH_IDS_KEY)

    return !canceledIds.includes(id) && (joinedIds.includes(id) || DEFAULT_APPLIED_MATCH_IDS.includes(id))
  }, [id])

  if (!match) {
    return (
      <div className="match_detail_page">
        <PageHeader
          className="match_detail_top"
          groupClassName="match_detail_top_title"
          backIcon={arrowLIcon}
          backButtonClassName="match_detail_back"
          title="매치 상세"
          onBack={() => navigate('/my/schedule')}
          hideRight
        />
        <div className="match_detail_empty">경기를 찾을 수 없어요.</div>
      </div>
    )
  }

  const remainingSeats = Math.max(match.maxParticipants - match.currentParticipants, 0)
  const isFull = remainingSeats === 0

  const apply = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate(`/match/${match.id}/apply`)
      return
    }
    setModalOpen(true)
  }

  const cancelApplication = () => {
    const joinedIds = readStringList(JOINED_MATCH_IDS_KEY).filter((matchId) => matchId !== match.id)
    const canceledIds = readStringList(CANCELED_MATCH_IDS_KEY)

    writeStringList(JOINED_MATCH_IDS_KEY, joinedIds)
    writeStringList(CANCELED_MATCH_IDS_KEY, [...canceledIds, match.id])
    navigate('/my/schedule')
  }

  const refreshApplicants = () => {
    if (isApplicantsRefreshing) return

    setIsApplicantsRefreshing(true)
    window.setTimeout(() => {
      setIsApplicantsRefreshing(false)
    }, 800)
  }

  return (
    <div className="match_detail_page">
      <PageHeader
        className="match_detail_top"
        groupClassName="match_detail_top_title"
        backIcon={arrowLIcon}
        backButtonClassName="match_detail_back"
        title="매치 상세"
        onBack={() => navigate('/my/schedule')}
        hideRight
      />

      <section className="match_detail_summary" aria-labelledby="match-detail-title">
        <div className="match_detail_title_row">
          <h1 id="match-detail-title">{match.title}</h1>
          <span className={`match_detail_status_tag ${isFull ? 'is_closed' : ''}`}>
            {isFull ? '모집 마감' : '모집 중'}
          </span>
        </div>

        <dl className="match_detail_info_list">
          <div className="match_detail_info_row">
            <dt>일시</dt>
            <dd>{formatMatchDetailDate(match)}</dd>
          </div>
          <div className="match_detail_info_row">
            <dt>장소</dt>
            <dd>{match.region} · {match.fieldName}</dd>
          </div>
          <div className="match_detail_info_row">
            <dt>모집 유형</dt>
            <dd>팀 / 용병 가능</dd>
          </div>
          <div className="match_detail_info_row">
            <dt>실력</dt>
            <dd>{match.difficulty}</dd>
          </div>
          <div className="match_detail_info_row">
            <dt>인원</dt>
            <dd>{match.maxParticipants}명 모집 중 (현재 {match.currentParticipants}/{match.maxParticipants})</dd>
          </div>
        </dl>
      </section>

      <main className="match_detail_content">
        <section className="match_detail_section" aria-labelledby="match-detail-applicants">
          <div className="match_detail_section_title_row">
            <h2 id="match-detail-applicants">신청자 현황 ({match.currentParticipants}/{match.maxParticipants})</h2>
            <button
              className={`match_detail_refresh_button${isApplicantsRefreshing ? ' is_refreshing' : ''}`}
              type="button"
              onClick={refreshApplicants}
              aria-label="신청자 현황 새로고침"
              aria-busy={isApplicantsRefreshing}
            >
              <img src={refreshIcon} alt="" aria-hidden="true" />
            </button>
          </div>
          <div className={`match_detail_applicant_list${isApplicantsRefreshing ? ' is_refreshing' : ''}`}>
            {detailApplicants.map((applicant) => (
              <article className="match_detail_applicant" key={applicant.name}>
                <div className="match_detail_applicant_name">
                  <span className="match_detail_applicant_avatar" aria-hidden="true" />
                  <strong>{applicant.name}</strong>
                </div>
                <span className="match_detail_applicant_role">{applicant.role}</span>
                <span className={`match_detail_applicant_state ${applicant.status === 'confirmed' ? 'is_confirmed' : 'is_waiting'}`}>
                  {applicant.status === 'confirmed' ? '확정' : '대기'}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="match_detail_section" aria-labelledby="match-detail-memo">
          <h2 id="match-detail-memo">메모 / 안내사항</h2>
          <div className="match_detail_memo_box">
            <p>
              일요일 오전 매치입니다. 안전 수칙 준수 부탁드려요! 주차는 필드 내 주차장 이용, 점심은 간단히 제공됩니다.
            </p>
          </div>
        </section>
      </main>

      {hideCancelApplication ? null : isApplied ? (
        <button className="match_detail_action_button" type="button" onClick={cancelApplication}>
          신청 취소
        </button>
      ) : (
        <button className="match_detail_action_button" type="button" onClick={apply} disabled={isFull}>
          {isFull ? '모집 마감' : '참가 신청하기'}
        </button>
      )}
      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
