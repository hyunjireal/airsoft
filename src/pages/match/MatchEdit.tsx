import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoginButton } from '../../components/LoginButton'
import { PageHeader } from '../../components/PageHeader'
import matchAlertIcon from '../../asset/icons/match_alert.svg'
import matchCalendarIcon from '../../asset/icons/match_calendar.svg'
import matchImgIcon from '../../asset/icons/match_img.svg'
import matchPinIcon from '../../asset/icons/match_pin.svg'
import './match.css'

type CreatedMatch = {
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
  action?: string
  body?: string
  imageSrc?: string
}

const CREATED_MATCHES_KEY = 'airsoft:created-matches'
const CREATED_MATCH_FOCUS_DATE_KEY = 'airsoft:created-match-focus-date'

const regionOptions = ['서울', '경기 남부', '경기 북부', '인천']
const timeOptions = ['10:30', '14:00', '16:00', '19:00']
const typeLabels = {
  personal: '개인',
  team: '팀',
  mercenary: '용병',
} as const

function readCreatedMatches(): CreatedMatch[] {
  try {
    const value = JSON.parse(localStorage.getItem(CREATED_MATCHES_KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function writeCreatedMatches(matches: CreatedMatch[]) {
  localStorage.setItem(CREATED_MATCHES_KEY, JSON.stringify(matches))
}

function getMatchTypeLabel(type?: CreatedMatch['type']) {
  if (!type) return '일정'

  return typeLabels[type]
}

export function MatchEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const createdMatches = useMemo(() => readCreatedMatches(), [])
  const match = createdMatches.find((item) => item.id === id)

  const [title, setTitle] = useState(match?.title ?? '')
  const [region, setRegion] = useState(match?.region ?? '서울')
  const [fieldName, setFieldName] = useState(match?.fieldName ?? '')
  const [date, setDate] = useState(match?.date ?? '2026-05-18')
  const [time, setTime] = useState(match?.time ?? '14:00')
  const [maxParticipants, setMaxParticipants] = useState(match?.maxParticipants ?? 8)
  const [body, setBody] = useState(match?.body ?? '')

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/match')
  }

  const updateMaxParticipants = (nextValue: number) => {
    setMaxParticipants(Math.max(1, nextValue))
  }

  const saveMatch = () => {
    if (!match) return

    const updatedMatches = createdMatches.map((item) => {
      if (item.id !== match.id) return item

      return {
        ...item,
        title: title.trim() || item.title || '내가 만든 일정',
        region,
        fieldName: fieldName.trim() || item.fieldName || '필드 미정',
        date,
        time,
        maxParticipants,
        body,
      }
    })

    writeCreatedMatches(updatedMatches)
    localStorage.setItem(CREATED_MATCH_FOCUS_DATE_KEY, date)
    navigate('/match')
  }

  if (!match) {
    return (
      <div className="match_edit_form_page">
        <PageHeader
          className="match_page_header"
          backButtonClassName="match_page_back_button"
          layout="standard"
          title="매치 수정"
          titleClassName="match_page_title"
          onBack={goBack}
        />
        <section className="match_edit_alert_section">
          <div className="match_edit_alert_box">
            <img src={matchAlertIcon} alt="" aria-hidden="true" />
            <p className="body_m_14">수정할 수 있는 내 일정이 없어요.</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="match_edit_form_page">
      <PageHeader
        className="match_page_header"
        backButtonClassName="match_page_back_button"
        layout="standard"
        title="매치 수정"
        titleClassName="match_page_title"
        onBack={goBack}
      />

      <section className="match_edit_alert_section">
        <div className="match_edit_alert_box">
          <img src={matchAlertIcon} alt="" aria-hidden="true" />
          <p className="body_m_14">내가 올린 일정은 내용 변경 후 다시 저장할 수 있어요.</p>
        </div>
      </section>

      <main>
        <section className="match_edit_form_section">
          <h2 className="body_sb_22">일정 정보</h2>
          <div className="match_edit_info_list">
            <label className="match_edit_field">
              <span className="body_m_16">유형</span>
              <div className="match_edit_text_input">
                <input value={getMatchTypeLabel(match.type)} readOnly aria-label="일정 유형" />
              </div>
            </label>

            <label className="match_edit_field">
              <span className="body_m_16">제목</span>
              <div className="match_edit_text_input">
                <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="일정 제목" />
              </div>
            </label>

            <label className="match_edit_field">
              <span className="body_m_16">장소</span>
              <div className="match_edit_text_input match_edit_place_input">
                <img className="match_edit_place_icon" src={matchPinIcon} alt="" aria-hidden="true" />
                <select value={region} onChange={(event) => setRegion(event.target.value)}>
                  {regionOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </label>

            <label className="match_edit_field">
              <span className="body_m_16">필드</span>
              <div className="match_edit_text_input">
                <input value={fieldName} onChange={(event) => setFieldName(event.target.value)} placeholder="필드명" />
              </div>
            </label>

            <div className="match_edit_field">
              <span className="body_m_16">일정</span>
              <div className="match_edit_datetime_row">
                <label className="match_edit_select_box">
                  <span className="match_edit_picker_value">
                    <img className="match_edit_icon_15" src={matchCalendarIcon} alt="" aria-hidden="true" />
                    <input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="일정 날짜" />
                  </span>
                </label>
                <label className="match_edit_select_box match_edit_time_box">
                  <select className="match_edit_time_select" value={time} onChange={(event) => setTime(event.target.value)} aria-label="일정 시간">
                    {timeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="match_edit_field">
              <span className="body_m_16">인원</span>
              <div className="match_edit_count_row">
                <div className="mgc_count_control" aria-label="모집 인원 조절">
                  <button type="button" onClick={() => updateMaxParticipants(maxParticipants - 1)}>-</button>
                  <span>{maxParticipants}</span>
                  <button type="button" onClick={() => updateMaxParticipants(maxParticipants + 1)}>+</button>
                </div>
                <span className="match_edit_count_hint body_m_14">명 모집</span>
              </div>
            </div>
          </div>
        </section>

        <section className="match_edit_description_section">
          <div className="match_edit_description_head">
            <div className="match_edit_optional_title">
              <h2 className="body_sb_22">상세 설명</h2>
              <span className="body_m_16">선택</span>
            </div>
            <span className="body_m_14">{body.length}/120</span>
          </div>
          <textarea
            value={body}
            maxLength={120}
            onChange={(event) => setBody(event.target.value)}
            placeholder="참가자에게 알려줄 내용을 적어주세요."
          />
        </section>

        <section className="match_edit_extra_section">
          <div className="match_edit_image_field">
            <h3 className="body_sb_20">대표 이미지</h3>
            <div className="match_edit_image_row">
              <div className="match_edit_image_thumb">
                <img src={matchImgIcon} alt="" aria-hidden="true" />
              </div>
              <div className="match_edit_image_actions">
                <button type="button">이미지 변경</button>
                <p className="body_m_13">현재는 기본 이미지로 표시됩니다.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="match_edit_form_cta">
          <LoginButton className="match_edit_cancel_button" onClick={goBack}>
            취소
          </LoginButton>
          <LoginButton
            className="match_edit_submit_button"
            style={{ background: 'var(--color-black)', color: 'var(--color-white)', WebkitTextFillColor: 'var(--color-white)' }}
            onClick={saveMatch}
          >
            저장하기
          </LoginButton>
        </div>
      </main>
    </div>
  )
}
