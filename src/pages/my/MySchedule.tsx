import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import arrowRIcon from '../../asset/icons/arrow_r.svg'
import matchPencilIcon from '../../asset/icons/match_pencil.svg'
import { getMyMatches, type MyMatchStatus } from './myMatchData'
import './my.css'

type ScheduleStatus = Extract<MyMatchStatus, 'applied' | 'confirmed'>

type ScheduleTab = {
  label: string
  value: ScheduleStatus
}

const tabs: ScheduleTab[] = [
  { label: '신청 중', value: 'applied' },
  { label: '확정', value: 'confirmed' },
]

export function MySchedule() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'confirmed' ? 'confirmed' : 'applied'
  const [selectedTab, setSelectedTab] = useState<ScheduleStatus>(initialTab)

  const schedules = useMemo(() => getMyMatches().filter((match) => match.status !== 'past'), [])

  const filteredSchedules = useMemo(
    () => schedules.filter((schedule) => schedule.status === selectedTab),
    [schedules, selectedTab],
  )

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/my')
  }

  return (
    <div className="my_schedule_page">
      <header className="my_schedule_top">
        <div className="my_schedule_tit">
          <button className="my_schedule_back" type="button" aria-label="뒤로가기" onClick={goBack}>
            <img src={arrowLIcon} alt="" aria-hidden="true" />
          </button>
          <h1 className="body_b_28">내 매치 현황</h1>
        </div>
      </header>

      <section className="my_schedule_tabs" aria-label="매치 현황 상태">
        {tabs.map((tab) => (
          <button
            className={`my_schedule_tab body_m_16 ${selectedTab === tab.value ? 'is_active' : ''}`}
            type="button"
            key={tab.value}
            onClick={() => setSelectedTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="my_schedule_list_section" aria-live="polite">
        {filteredSchedules.length > 0 ? (
          <div className="my_schedule_match_list">
            {filteredSchedules.map((match) => {
              const actionTo = match.isMine ? '/match/manage' : `/match/detail/${match.matchId}`
              const actionLabel = match.isMine ? `${match.title} 관리하기` : `${match.title} 상세 보기`
              const actionIcon = match.isMine ? matchPencilIcon : arrowRIcon

              return (
                <Link className="my_schedule_match_item" to={actionTo} aria-label={actionLabel} key={match.id}>
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
                      <img
                        className={`my_schedule_match_arrow ${match.isMine ? 'is_pencil' : ''}`}
                        src={actionIcon}
                        alt=""
                        aria-hidden="true"
                      />
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
      </section>
    </div>
  )
}
