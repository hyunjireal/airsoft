import { useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoginButton } from '../../components/LoginButton'
import arrowDownIcon from '../../asset/icons/arrow_down.svg'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import matchAlertIcon from '../../asset/icons/match_alert.svg'
import matchCalendarIcon from '../../asset/icons/match_calendar.svg'
import matchClockIcon from '../../asset/icons/match_clock.svg'
import matchImgIcon from '../../asset/icons/match_img.svg'
import matchPinIcon from '../../asset/icons/match_pin.svg'
import matchXCircleIcon from '../../asset/icons/match_x_circle.svg'
import './match.css'

type MatchKind = 'personal' | 'team' | 'guest'

type CreatedMatch = {
  id: string
  type?: string
  title?: string
  date?: string
  time?: string
  region?: string
  fieldName?: string
  difficulty?: string
  currentParticipants?: number
  maxParticipants?: number
  action?: string
  body?: string
  recruitType?: string
  deadlineDate?: string
  deadlineTime?: string
}

const CREATED_MATCHES_KEY = 'airsoft:created-matches'
const CREATED_MATCH_FOCUS_DATE_KEY = 'airsoft:created-match-focus-date'

const matchKinds: Array<{ label: string; value: MatchKind }> = [
  { label: '개인전', value: 'personal' },
  { label: '팀전', value: 'team' },
  { label: '게스트', value: 'guest' },
]

const submitLabels: Record<MatchKind, string> = {
  personal: '개인 태그 추가',
  team: '팀 태그 추가',
  guest: '용병 태그 추가',
}

const timeOptions = ['10:30', '12:00', '14:00', '16:00', '18:00', '19:00', '23:00']

function resolveKind(raw: string | null): MatchKind {
  if (raw === 'team' || raw === 'guest') return raw
  return 'personal'
}

function resolveMatchDate(rawDate: string | null) {
  if (!rawDate) return '2026-05-18'

  const date = new Date(`${rawDate}T00:00:00`)
  return Number.isNaN(date.getTime()) ? '2026-05-18' : rawDate
}

function formatPickerDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value.replaceAll('-', '/')

  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} (${weekdays[date.getDay()]})`
}

function readCreatedMatches(): CreatedMatch[] {
  try {
    const value = JSON.parse(localStorage.getItem(CREATED_MATCHES_KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function readCreatedMatch(matchId: string | null) {
  if (!matchId) return null
  return readCreatedMatches().find((match) => match && typeof match === 'object' && match.id === matchId) ?? null
}

function resolveEditedType(recruitType: string) {
  if (recruitType === 'mercenary') return 'mercenary'
  if (recruitType === 'team') return 'team'
  return 'personal'
}

function resolveDifficulty(recruitType: string) {
  if (recruitType === 'mercenary') return '용병'
  if (recruitType === 'team') return '팀'
  return '개인'
}

export function MatchCreateHome() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editMatchId = searchParams.get('edit')
  const isEditMode = Boolean(editMatchId)
  const editingMatch = useMemo(() => readCreatedMatch(editMatchId), [editMatchId])

  const [matchKind, setMatchKind] = useState<MatchKind>(() => resolveKind(searchParams.get('kind')))
  const [region, setRegion] = useState('경기도')
  const [time, setTime] = useState('주말 오후')
  const [fieldName, setFieldName] = useState('실내 OOO 구장')
  const [difficulty, setDifficulty] = useState('초급')
  const [matchDate, setMatchDate] = useState(() => resolveMatchDate(searchParams.get('date')))
  const [maxParticipants, setMaxParticipants] = useState('16')
  const [title, setTitle] = useState('초보 환영 CQB 모집')
  const [body, setBody] = useState(
    '처음 오시는 분도 편하게 참여할 수 있는 분위기로 진행합니다. 안전 수칙을 지키면서 즐겁게 뛰실 분을 모집해요.',
  )

  const [editTitle, setEditTitle] = useState(
    typeof editingMatch?.title === 'string' ? editingMatch.title : '서울 CQB 입문 스크림',
  )
  const [editDate, setEditDate] = useState(
    typeof editingMatch?.date === 'string' ? editingMatch.date : '2026-05-11',
  )
  const [editTime, setEditTime] = useState(
    typeof editingMatch?.time === 'string' && /^\d{2}:\d{2}$/.test(editingMatch.time) ? editingMatch.time : '12:00',
  )
  const [editPlace, setEditPlace] = useState(
    typeof editingMatch?.fieldName === 'string' ? editingMatch.fieldName : '어반CQB',
  )
  const [editHeadcount, setEditHeadcount] = useState(Number(editingMatch?.maxParticipants) || 12)
  const [editRecruitType, setEditRecruitType] = useState(
    typeof editingMatch?.recruitType === 'string' ? editingMatch.recruitType : 'team',
  )
  const [editDescription, setEditDescription] = useState(typeof editingMatch?.body === 'string' ? editingMatch.body : '')
  const [deadlineDate, setDeadlineDate] = useState(
    typeof editingMatch?.deadlineDate === 'string' ? editingMatch.deadlineDate : '2026-05-10',
  )
  const [deadlineTime, setDeadlineTime] = useState(
    typeof editingMatch?.deadlineTime === 'string' ? editingMatch.deadlineTime : '18:00',
  )
  const editDateRef = useRef<HTMLInputElement>(null)
  const deadlineDateRef = useRef<HTMLInputElement>(null)

  const createMatch = () => {
    const savedMatches = readCreatedMatches()
    const createdMatch: CreatedMatch = {
      id: `created-match-${Date.now()}`,
      type: matchKind === 'guest' ? 'mercenary' : matchKind,
      title: title.trim() || `${matchKind === 'team' ? '팀전' : '개인전'} 모집`,
      time: time === '평일 저녁' ? '19:00' : time === '주말 오전' ? '10:30' : '14:00',
      region,
      fieldName,
      difficulty: matchKind === 'team' ? '팀' : matchKind === 'guest' ? '용병' : difficulty,
      currentParticipants: 1,
      maxParticipants: Number(maxParticipants) || 16,
      action: '상세 보기',
      body,
      date: matchDate,
    }

    localStorage.setItem(CREATED_MATCHES_KEY, JSON.stringify([createdMatch, ...savedMatches]))
    localStorage.setItem(CREATED_MATCH_FOCUS_DATE_KEY, matchDate)
    navigate('/match')
  }

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/my/schedule')
  }

  const decreaseHeadcount = () => {
    setEditHeadcount((count) => Math.max(1, count - 1))
  }

  const increaseHeadcount = () => {
    setEditHeadcount((count) => count + 1)
  }

  const completeEdit = () => {
    try {
      const savedMatches = readCreatedMatches()
      if (editMatchId) {
        const editedMatch: CreatedMatch = {
          id: editMatchId,
          type: resolveEditedType(editRecruitType),
          title: editTitle.trim() || '매치 제목',
          date: editDate,
          time: editTime,
          region: '서울',
          fieldName: editPlace,
          difficulty: resolveDifficulty(editRecruitType),
          currentParticipants: Number(editingMatch?.currentParticipants) || 1,
          maxParticipants: editHeadcount,
          action: '상세 보기',
          body: editDescription,
          recruitType: editRecruitType,
          deadlineDate,
          deadlineTime,
        }
        const hasSavedMatch = savedMatches.some((match) => match && typeof match === 'object' && match.id === editMatchId)
        const nextMatches = hasSavedMatch
          ? savedMatches.map((match) => (match && typeof match === 'object' && match.id === editMatchId ? { ...match, ...editedMatch } : match))
          : [editedMatch, ...savedMatches]

        localStorage.setItem(CREATED_MATCHES_KEY, JSON.stringify(nextMatches))
        localStorage.setItem(CREATED_MATCH_FOCUS_DATE_KEY, editDate)
      }
    } catch {
      // 저장 실패 시에도 목록으로 복귀해 흐름을 막지 않습니다.
    }

    navigate('/my/schedule')
  }

  const deleteMatch = () => {
    try {
      const savedMatches = readCreatedMatches()
      if (editMatchId) {
        const nextMatches = savedMatches.filter((match) => !match || typeof match !== 'object' || match.id !== editMatchId)
        localStorage.setItem(CREATED_MATCHES_KEY, JSON.stringify(nextMatches))

        if (editingMatch?.date === localStorage.getItem(CREATED_MATCH_FOCUS_DATE_KEY)) {
          localStorage.removeItem(CREATED_MATCH_FOCUS_DATE_KEY)
        }
      }
    } catch {
      // 삭제 실패 시에도 목록으로 복귀해 흐름을 막지 않습니다.
    }

    navigate('/my/schedule')
  }

  if (isEditMode) {
    return (
      <div className="match_edit_form_page">
        <header className="match_edit_detail_top">
          <button className="match_edit_back" type="button" aria-label="뒤로가기" onClick={goBack}>
            <img src={arrowLIcon} alt="" aria-hidden="true" />
          </button>
          <h1 className="body_b_28">매치 수정</h1>
        </header>

        <section className="match_edit_alert_section" aria-label="수정 안내">
          <div className="match_edit_alert_box">
            <img src={matchAlertIcon} alt="" aria-hidden="true" />
            <p className="body_m_14">
              매치 정보를 수정하고 저장하면
              <br />
              참가자들에게 변경 사항이 안내됩니다.
            </p>
          </div>
        </section>

        <section className="match_edit_form_section">
          <h2 className="body_sb_20">기본 정보</h2>
          <div className="match_edit_info_list">
            <label className="match_edit_field">
              <span className="body_sb_16">매치 제목</span>
              <div className="match_edit_text_input">
                <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                <button type="button" aria-label="매치 제목 지우기" onClick={() => setEditTitle('')}>
                  <img src={matchXCircleIcon} alt="" aria-hidden="true" />
                </button>
              </div>
            </label>

            <div className="match_edit_field">
              <span className="body_sb_16">일시</span>
              <div className="match_edit_datetime_row">
                <label className="match_edit_select_box match_edit_hug_box" onClick={() => editDateRef.current?.showPicker?.()}>
                  <span className="match_edit_picker_value">
                    <img className="match_edit_icon_15" src={matchCalendarIcon} alt="" aria-hidden="true" />
                    <span>{formatPickerDate(editDate)}</span>
                  </span>
                  <input ref={editDateRef} className="match_edit_hidden_picker" type="date" value={editDate} onChange={(event) => setEditDate(event.target.value)} />
                  <img className="match_edit_icon_15" src={arrowDownIcon} alt="" aria-hidden="true" />
                </label>
                <label className="match_edit_select_box match_edit_hug_box match_edit_time_box">
                  <span className="match_edit_picker_value">
                    <img className="match_edit_icon_15" src={matchClockIcon} alt="" aria-hidden="true" />
                    <select className="match_edit_time_select" value={editTime} onChange={(event) => setEditTime(event.target.value)}>
                      {timeOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </span>
                  <img className="match_edit_icon_15" src={arrowDownIcon} alt="" aria-hidden="true" />
                </label>
              </div>
            </div>

            <label className="match_edit_field">
              <span className="body_sb_16">장소</span>
              <div className="match_edit_text_input match_edit_place_input">
                <img className="match_edit_place_icon" src={matchPinIcon} alt="" aria-hidden="true" />
                <select value={editPlace} onChange={(event) => setEditPlace(event.target.value)}>
                  <option>어반CQB</option>
                  <option>강남 CQB</option>
                  <option>포레스트 아레나</option>
                  <option>택티쿨 필드</option>
                </select>
                <img src={arrowDownIcon} alt="" aria-hidden="true" />
              </div>
            </label>

            <div className="match_edit_field">
              <span className="body_sb_16">인원</span>
              <div className="match_edit_count_row">
                <div className="mgc_count_control" aria-label="인원 선택">
                  <button type="button" onClick={decreaseHeadcount} aria-label="인원 줄이기">-</button>
                  <span>{editHeadcount}</span>
                  <button type="button" onClick={increaseHeadcount} aria-label="인원 늘리기">+</button>
                </div>
                <span className="match_edit_count_hint body_m_14">최대 16명</span>
              </div>
            </div>

            <div className="match_edit_field">
              <span className="body_sb_16">모집 유형</span>
              <div className="match_edit_radio_group" role="radiogroup" aria-label="모집 유형">
                <label className="body_m_14">
                  <input type="radio" name="recruitType" value="team" checked={editRecruitType === 'team'} onChange={(event) => setEditRecruitType(event.target.value)} />
                  팀(용병가능)
                </label>
                <label className="body_m_14">
                  <input type="radio" name="recruitType" value="personal" checked={editRecruitType === 'personal'} onChange={(event) => setEditRecruitType(event.target.value)} />
                  개인
                </label>
                <label className="body_m_14">
                  <input type="radio" name="recruitType" value="mercenary" checked={editRecruitType === 'mercenary'} onChange={(event) => setEditRecruitType(event.target.value)} />
                  용병
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="match_edit_description_section">
          <div className="match_edit_description_head">
            <div className="match_edit_optional_title">
              <h2 className="body_sb_20">상세 설명</h2>
              <span className="body_m_14">(선택)</span>
            </div>
            <span className="body_m_14">{editDescription.length} / 200</span>
          </div>
          <textarea
            maxLength={200}
            value={editDescription}
            onChange={(event) => setEditDescription(event.target.value)}
            placeholder="매치에 대한 상세 내용을 입력하세요."
          />
        </section>

        <section className="match_edit_extra_section">
          <h2 className="body_sb_20">추가 설정</h2>
          <div className="match_edit_deadline">
            <h3 className="body_sb_16">모집 마감</h3>
            <div className="match_edit_deadline_inputs">
              <label className="match_edit_select_box" onClick={() => deadlineDateRef.current?.showPicker?.()}>
                <span className="match_edit_picker_value">
                  <img className="match_edit_icon_15" src={matchCalendarIcon} alt="" aria-hidden="true" />
                  <span>{formatPickerDate(deadlineDate)}</span>
                </span>
                <input ref={deadlineDateRef} className="match_edit_hidden_picker" type="date" value={deadlineDate} onChange={(event) => setDeadlineDate(event.target.value)} />
                <img className="match_edit_icon_15" src={arrowDownIcon} alt="" aria-hidden="true" />
              </label>
              <label className="match_edit_select_box match_edit_time_box">
                <span className="match_edit_picker_value">
                  <img className="match_edit_icon_15" src={matchClockIcon} alt="" aria-hidden="true" />
                  <select className="match_edit_time_select" value={deadlineTime} onChange={(event) => setDeadlineTime(event.target.value)}>
                    {timeOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </span>
                <img className="match_edit_icon_15" src={arrowDownIcon} alt="" aria-hidden="true" />
              </label>
            </div>
          </div>

          <div className="match_edit_image_field">
            <h3 className="body_sb_16">매치 이미지</h3>
            <div className="match_edit_image_row">
              <div className="match_edit_image_thumb" aria-hidden="true">
                <img src={matchImgIcon} alt="" />
              </div>
              <div className="match_edit_image_actions">
                <button className="body_sb_14" type="button">이미지 변경</button>
                <p className="body_m_14">권장 사이즈: 16:9 / 최대 5MB</p>
              </div>
            </div>
          </div>
        </section>

        <div className="match_edit_form_cta">
          <LoginButton
            style={{
              background: '#FFFFFF',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D9D9',
              color: '#000000',
              WebkitTextFillColor: '#000000',
            }}
            onClick={deleteMatch}
          >
            삭제
          </LoginButton>
          <LoginButton
            style={{
              background: '#000000',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              WebkitTextFillColor: '#FFFFFF',
            }}
            onClick={completeEdit}
          >
            수정 완료
          </LoginButton>
        </div>
      </div>
    )
  }

  return (
    <div className="match_create_page match_preference_page">
      <h1>
        선호 조건을
        <br />
        설정해 주세요
      </h1>

      <div className="match_create_tabs" aria-label="모집 유형">
        {matchKinds.map((kind) => (
          <button
            className={matchKind === kind.value ? 'is_active' : ''}
            type="button"
            key={kind.value}
            onClick={() => setMatchKind(kind.value)}
          >
            {kind.label}
          </button>
        ))}
      </div>

      <section className="match_preference_form" aria-label="모집 조건">
        <label>
          지역
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            <option>경기도</option>
            <option>서울</option>
            <option>인천</option>
          </select>
        </label>
        <label>
          시간
          <select value={time} onChange={(event) => setTime(event.target.value)}>
            <option>주말 오후</option>
            <option>평일 저녁</option>
            <option>주말 오전</option>
          </select>
        </label>
        <label>
          게임 선택
          <select value={fieldName} onChange={(event) => setFieldName(event.target.value)}>
            <option>실내 OOO 구장</option>
            <option>야외 포레스트 필드</option>
            <option>CQB 입문 스크림</option>
          </select>
        </label>
        <label>
          실력
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option>초급</option>
            <option>입문자</option>
            <option>경험자</option>
          </select>
        </label>
        <label>
          일정
          <input type="date" value={matchDate} onChange={(event) => setMatchDate(event.target.value)} />
        </label>
        <label>
          모집 인원
          <input type="number" min="2" max="50" value={maxParticipants} onChange={(event) => setMaxParticipants(event.target.value)} />
        </label>
        <label>
          제목
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          모집 글 본문
          <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={6} />
        </label>
      </section>

      <button className="match_create_primary" type="button" onClick={createMatch}>
        {submitLabels[matchKind]}
      </button>
    </div>
  )
}
