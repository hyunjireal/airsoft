import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import arrowLeftIcon from '../../asset/icons/arrow_l.svg'
import buddyCalendarIcon from '../../asset/icons/buddy_cal.png'
import buddyHeroMain from '../../asset/images/buddy_hero_main.png'
import { PageHeader } from '../../components/PageHeader'
import './BuddyFind.css'

type ScheduleItem = {
  id: number
  date: string
  place: string
  memberCount: string
  summaryLabel?: string
}

type FilterOption = {
  id: string
  label: string
}

const MOCK_SCHEDULES: ScheduleItem[] = [
  {
    id: 1,
    date: '5/23 (토) 13:00',
    place: '서울 CQB 아레나',
    memberCount: '8 / 12명',
    summaryLabel: '5/23 (토) 13:30 서울 CQB 아레나',
  },
  {
    id: 2,
    date: '5/24 (일) 15:00',
    place: '인천 필드 전장',
    memberCount: '5 / 10명',
  },
  {
    id: 3,
    date: '5/26 (화) 18:30',
    place: '송파 택티컬존',
    memberCount: '10 / 14명',
  },
  {
    id: 4,
    date: '5/27 (수) 14:00',
    place: '수원 밀심 필드',
    memberCount: '4 / 8명',
  },
]

const HELP_OPTIONS: FilterOption[] = [
  { id: 'equipment', label: '장비' },
  { id: 'rules', label: '룰·안전' },
  { id: 'adaptation', label: '적응 도움' },
  { id: 'position', label: '포지션 추천' },
  { id: 'teamplay', label: '팀플레이' },
  { id: 'solo', label: '개인전' },
]

const EXP_OPTIONS: FilterOption[] = [
  { id: 'first', label: '처음 참여' },
  { id: 'one-two', label: '1~2회 참여' },
  { id: 'three-plus', label: '3회 이상' },
]

export function BuddyFind() {
  const navigate = useNavigate()
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(1)
  const [selectedHelpIds, setSelectedHelpIds] = useState<string[]>(['equipment', 'rules'])
  const [selectedExpId, setSelectedExpId] = useState<string>('first')

  const selectedSchedule =
    MOCK_SCHEDULES.find((schedule) => schedule.id === selectedScheduleId) ?? null
  const selectedHelpOptions = HELP_OPTIONS.filter((option) => selectedHelpIds.includes(option.id))
  const selectedExpOption =
    EXP_OPTIONS.find((option) => option.id === selectedExpId) ?? null
  const isReadyToStart =
    selectedSchedule !== null && selectedHelpOptions.length > 0 && selectedExpOption !== null

  const toggleHelpOption = (targetId: string) => {
    setSelectedHelpIds((currentIds) =>
      currentIds.includes(targetId)
        ? currentIds.filter((id) => id !== targetId)
        : [...currentIds, targetId],
    )
  }

  const toggleExpOption = (targetId: string) => {
    setSelectedExpId(targetId)
  }

  return (
    <article className="buddy_find_page">
      <PageHeader
        variant="dark"
        className="buddy_find_header"
        onBack={() => navigate(-1)}
        backLabel="뒤로 가기"
        title="버디 찾기"
      />

      <section className="buddy_find_hero" aria-label="버디 매칭 소개">
        <img className="buddy_find_hero__art" src={buddyHeroMain} alt="" aria-hidden="true" />
        <div className="buddy_find_hero__info">
          <p className="buddy_find_hero__title">
            같은 게임 참가자와
            <br />
            버디 매칭을 시작해보세요
          </p>
        </div>
      </section>

      <section className="buddy_find_section" aria-labelledby="buddy_find_step_01">
        <div className="buddy_find_section__header">
          <span className="buddy_find_section__badge" aria-hidden="true">
            1
          </span>
          <h2 className="buddy_find_section__title" id="buddy_find_step_01">
            다가오는 매치 선택
          </h2>
        </div>
        <p className="buddy_find_section__desc">
          일정 예약 시 <span>버디 필요를 체크</span>하면 함께할 버디를 연결해드려요
        </p>

        <div className="buddy_find_schedule_list" aria-label="다가오는 매치 목록">
          {MOCK_SCHEDULES.map((schedule) => {
            const isSelected = schedule.id === selectedScheduleId

            return (
              <article
                key={schedule.id}
                className={[
                  'buddy_find_schedule_card',
                  isSelected ? 'buddy_find_schedule_card--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="buddy_find_schedule_card__content">
                  <div className="buddy_find_schedule_card__icon_wrap" aria-hidden="true">
                    <img src={buddyCalendarIcon} alt="" />
                  </div>
                  <div className="buddy_find_schedule_card__text">
                    <p className="buddy_find_schedule_card__date">{schedule.date}</p>
                    <p className="buddy_find_schedule_card__place">{schedule.place}</p>
                    <p className="buddy_find_schedule_card__count">{schedule.memberCount}</p>
                  </div>
                </div>
                <div className="buddy_find_schedule_card__divider" role="separator" />
                <button
                  className="buddy_find_schedule_card__action"
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedScheduleId(schedule.id)}
                >
                  일정 선택
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <div className="buddy_find_more">
        <button
          className="buddy_find_more__button"
          type="button"
          onClick={() => navigate('/match')}
        >
          <div className="buddy_find_more__left">
            <span className="buddy_find_more__icon_wrap" aria-hidden="true">
              <img src={buddyCalendarIcon} alt="" />
            </span>
            <span className="buddy_find_more__label">다른 날짜의 게임 찾기</span>
          </div>
          <img
            className="buddy_find_more__arrow"
            src={arrowLeftIcon}
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>

      <section
        className="buddy_find_section buddy_find_section--filters"
        aria-labelledby="buddy_find_step_02"
      >
        <div className="buddy_find_section__header">
          <span className="buddy_find_section__badge" aria-hidden="true">
            2
          </span>
          <h2 className="buddy_find_section__title" id="buddy_find_step_02">
            버디 매칭 설정
          </h2>
        </div>
        <p className="buddy_find_section__desc buddy_find_section__desc--stacked">
          도움이 필요한 항목과 경험 수준을 입력하면
          <br />
          더 잘 맞는 버디를 추천해드려요
        </p>

        <div className="buddy_find_filter_card">
          <div className="buddy_find_filter_group">
            <h3 className="buddy_find_filter_title">
              도움이 필요한 부분 <span>(복수 선택)</span>
            </h3>
            <div className="buddy_find_filter_grid">
              {HELP_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={[
                    'buddy_find_filter_button',
                    selectedHelpIds.includes(option.id) ? 'buddy_find_filter_button--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={selectedHelpIds.includes(option.id)}
                  onClick={() => toggleHelpOption(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="buddy_find_filter_card">
          <div className="buddy_find_filter_group">
            <h3 className="buddy_find_filter_title">플레이 경험 수준</h3>
            <div className="buddy_find_filter_grid">
              {EXP_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={[
                    'buddy_find_filter_button',
                    selectedExpId === option.id ? 'buddy_find_filter_button--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={selectedExpId === option.id}
                  onClick={() => toggleExpOption(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="buddy_find_section buddy_find_section--summary"
        aria-labelledby="buddy_find_step_03"
      >
        <div className="buddy_find_section__header">
          <span className="buddy_find_section__badge" aria-hidden="true">
            3
          </span>
          <h2 className="buddy_find_section__title" id="buddy_find_step_03">
            선택 요약
          </h2>
        </div>

        <div className="buddy_find_summary_card">
          {selectedSchedule ? (
            <button
              className="buddy_find_summary_chip buddy_find_summary_chip--schedule"
              type="button"
              onClick={() => setSelectedScheduleId(null)}
            >
              <span className="buddy_find_summary_chip__left">
                <img src={buddyCalendarIcon} alt="" aria-hidden="true" />
                <span>
                  {selectedSchedule.summaryLabel ??
                    `${selectedSchedule.date} ${selectedSchedule.place}`}
                </span>
              </span>
              <span className="buddy_find_summary_chip__close" aria-hidden="true">
                ×
              </span>
            </button>
          ) : null}

          <div className="buddy_find_summary_row">
            {selectedHelpOptions.map((option) => (
              <button
                key={option.id}
                className="buddy_find_summary_chip"
                type="button"
                onClick={() =>
                  setSelectedHelpIds((currentIds) =>
                    currentIds.filter((id) => id !== option.id),
                  )
                }
              >
                <span>{option.label}</span>
                <span className="buddy_find_summary_chip__close" aria-hidden="true">
                  ×
                </span>
              </button>
            ))}

            {selectedExpOption ? (
              <button
                key={selectedExpOption.id}
                className="buddy_find_summary_chip"
                type="button"
                onClick={() => setSelectedExpId('')}
              >
                <span>{selectedExpOption.label}</span>
                <span className="buddy_find_summary_chip__close" aria-hidden="true">
                  ×
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <div className="buddy_find_footer">
        <button
          className="buddy_find_start_button"
          type="button"
          disabled={!isReadyToStart}
          onClick={() => navigate('/my/schedule')}
        >
          버디 추천 시작
        </button>
      </div>
    </article>
  )
}
