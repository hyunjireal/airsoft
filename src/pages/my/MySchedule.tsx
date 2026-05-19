import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import arrowRIcon from '../../asset/icons/arrow_r.svg'
import matchPencilIcon from '../../asset/icons/preset_pencil.svg'
import presetTrashIcon from '../../asset/icons/preset_trash.svg'
import { getMyMatches, type MyMatchStatus } from './myMatchData'
import './my.css'

type ScheduleStatus = Extract<MyMatchStatus, 'applied' | 'confirmed'>

type ScheduleTab = {
  label: string
  value: ScheduleStatus
}

const CREATED_MATCHES_KEY = 'airsoft:created-matches'

const tabs: ScheduleTab[] = [
  { label: '신청 중', value: 'applied' },
  { label: '확정', value: 'confirmed' },
]

export function MySchedule() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'confirmed' ? 'confirmed' : 'applied'
  const [selectedTab, setSelectedTab] = useState<ScheduleStatus>(initialTab)
  const [scheduleRevision, setScheduleRevision] = useState(0)

  const schedules = useMemo(() => getMyMatches().filter((match) => match.status !== 'past'), [scheduleRevision])

  const filteredSchedules = useMemo(
    () => schedules.filter((schedule) => schedule.status === selectedTab),
    [schedules, selectedTab],
  )

  const goBack = () => {
    navigate('/match')
  }

  const deleteMyMatch = (matchId: string, title: string) => {
    const shouldDelete = window.confirm(`"${title}" 모집글을 삭제할까요?`)
    if (!shouldDelete) return

    try {
      const savedMatches = JSON.parse(localStorage.getItem(CREATED_MATCHES_KEY) ?? '[]')
      const nextMatches = Array.isArray(savedMatches)
        ? savedMatches.filter((match) => !match || typeof match !== 'object' || match.id !== matchId)
        : []

      localStorage.setItem(CREATED_MATCHES_KEY, JSON.stringify(nextMatches))
      setScheduleRevision((value) => value + 1)
    } catch {
      localStorage.setItem(CREATED_MATCHES_KEY, '[]')
      setScheduleRevision((value) => value + 1)
    }
  }

  return (
    <div className="my_schedule_page">
      <PageHeader
        className="my_schedule_top"
        groupClassName="my_schedule_tit"
        backButtonClassName="my_schedule_back"
        layout="standard"
        title="내 매치 현황"
        titleClassName="body_b_28"
        onBack={goBack}
      />

      <section className="my_schedule_tabs" aria-label="매치 현황 상태">
        {tabs.map((tab) => (
          <button
            className={`my_schedule_tab body_m_16 ${selectedTab === tab.value ? 'is_active' : ''}`}
            type="button"
            key={tab.value}
            onClick={() => {
              setSelectedTab(tab.value)
              setSearchParams({ tab: tab.value })
            }}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="my_schedule_list_section" aria-live="polite">
        <div
          className={`my_schedule_tab_panel my_schedule_tab_panel_${selectedTab}`}
          key={selectedTab}
        >
        {filteredSchedules.length > 0 ? (
          <div className="my_schedule_match_list">
            {filteredSchedules.map((match) => {
              if (match.isMine) {
                return (
                  <article className="my_schedule_match_item my_schedule_match_item_mine" key={match.id}>
                    <div className="my_schedule_match_bottom">
                      <div className="my_schedule_match_media">
                        <img className="my_schedule_match_thumb" src={match.imageSrc} alt="" aria-hidden="true" />
                        <div className="my_schedule_match_info">
                          <strong className="my_schedule_match_title">{match.title}</strong>
                          <div className="my_schedule_match_meta">
                            <p className="my_schedule_match_meta_row">
                              <span className="my_schedule_match_meta_label">시간</span>
                              <span className="my_schedule_match_meta_value">{match.time}</span>
                            </p>
                            <p className="my_schedule_match_meta_row">
                              <span className="my_schedule_match_meta_label">장소</span>
                              <span className="my_schedule_match_meta_value">
                                {match.region} · {match.fieldName}
                              </span>
                            </p>
                            <p className="my_schedule_match_meta_row">
                              <span className="my_schedule_match_meta_label">인원</span>
                              <span className="my_schedule_match_meta_value">
                                {match.currentParticipants} / {match.maxParticipants}명
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="my_schedule_match_mine_actions">
                        <button
                          className="my_schedule_match_mine_action"
                          type="button"
                          aria-label={`${match.title} 수정`}
                          onClick={() => navigate(`/match/edit/${match.matchId}`)}
                        >
                          <img src={matchPencilIcon} alt="" aria-hidden="true" />
                        </button>
                        <button
                          className="my_schedule_match_mine_action"
                          type="button"
                          aria-label={`${match.title} 삭제`}
                          onClick={() => deleteMyMatch(match.matchId, match.title)}
                        >
                          <img src={presetTrashIcon} alt="" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              }

              return (
                <Link
                  className="my_schedule_match_item"
                  to={`/match/detail/${match.matchId}`}
                  state={{ hideCancelApplication: selectedTab === 'confirmed', returnTo: '/my/schedule' }}
                  aria-label={`${match.title} 상세 보기`}
                  key={match.id}
                >
                  <div className="my_schedule_match_bottom">
                    <div className="my_schedule_match_media">
                      <img className="my_schedule_match_thumb" src={match.imageSrc} alt="" aria-hidden="true" />
                      <div className="my_schedule_match_info">
                        <strong className="my_schedule_match_title">{match.title}</strong>
                        <div className="my_schedule_match_meta">
                          <p className="my_schedule_match_meta_row">
                            <span className="my_schedule_match_meta_label">시간</span>
                            <span className="my_schedule_match_meta_value">{match.time}</span>
                          </p>
                          <p className="my_schedule_match_meta_row">
                            <span className="my_schedule_match_meta_label">장소</span>
                            <span className="my_schedule_match_meta_value">
                              {match.region} · {match.fieldName}
                            </span>
                          </p>
                        </div>
                        <p className="my_schedule_match_meta_row">
                          <span className="my_schedule_match_meta_label">인원</span>
                          <span className="my_schedule_match_meta_value">
                            {match.currentParticipants}/{match.maxParticipants}명
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="my_schedule_match_arrow_link" aria-hidden="true">
                      <img className="my_schedule_match_arrow" src={arrowRIcon} alt="" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <article className="my_schedule_empty">
            <strong>{tabs.find((tab) => tab.value === selectedTab)?.label} 매치가 없어요</strong>
            <p>매치 페이지에서 새로운 일정을 찾아보세요.</p>
          </article>
        )}
        </div>
      </section>
    </div>
  )
}
