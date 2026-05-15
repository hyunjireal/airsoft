import { useNavigate, useParams } from 'react-router-dom'
import { LoginButton } from '../../components/LoginButton'
import { PageHeader } from '../../components/PageHeader'
import matchCheckIcon from '../../asset/icons/match_check.svg'
import './match.css'

const noticeItems = [
  '이번 주 일요일 12:00까지 어반 CQB에 도착해주세요.',
  '현장에서는 고글을 벗지 않고, 세이프존 규칙을 먼저 확인해주세요.',
  '참석이 어려워지면 팀장 승인 전이라도 빠르게 취소 연락을 남겨주세요.',
  '렌탈을 신청했다면 신분증과 렌탈 비용을 준비해주세요.',
]

export function MatchApplyComplete() {
  const { id } = useParams()
  const navigate = useNavigate()

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(`/match/${id ?? 'match-003'}/apply`)
  }

  return (
    <div className="match_apply_complete_page match_flow_page">
      <PageHeader
        className="schedule_join_top match_apply_top"
        groupClassName="schedule_join_tit"
        backButtonClassName="schedule_join_back"
        title="신청 완료"
        titleClassName="schedule_join_header_title"
        onBack={goBack}
      />

      <main className="match_apply_complete_main">
        <section className="match_complete_panel">
          <div className="match_complete_success_circle_mark" aria-hidden="true">
            <div className="match_complete_success_background" />
            <div className="match_complete_success_draw" />
          </div>
          <h1>참가 신청이 완료되었습니다</h1>
          <div className="match_complete_copy">
            <p>팀장의 승낙 여부를 기다려주세요.</p>
            <p>승인 또는 조율 시 등록한 연락처로 안내가 전달됩니다.</p>
          </div>
        </section>

        <section className="match_notice_panel match_complete_notice">
          <h2>숙지해야할 정보</h2>
          <ul>
            {noticeItems.map((item) => (
              <li key={item}>
                <img src={matchCheckIcon} alt="" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="match_apply_summary match_complete_summary">
          <strong>서울 CQB 입문 경기</strong>
          <p>서울 · 어반 CQB · 40,000원</p>
        </section>

        <div className="match_complete_actions">
          <LoginButton
            className="match_complete_schedule_button"
            onClick={() => navigate('/my/schedule')}
            style={{
              background: '#111111',
              backgroundColor: '#111111',
              color: 'var(--color-white)',
              WebkitTextFillColor: 'var(--color-white)',
            }}
          >
            내 경기 일정 보기
          </LoginButton>
          <LoginButton
            className="match_complete_home_button"
            onClick={() => navigate('/home')}
            style={{
              border: '1px solid #111111',
              background: 'var(--color-white)',
              backgroundColor: 'var(--color-white)',
              color: '#111111',
              WebkitTextFillColor: '#111111',
            }}
          >
            홈으로
          </LoginButton>
        </div>
      </main>
    </div>
  )
}
