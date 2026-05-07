import { Link, useParams } from 'react-router-dom'
import { matches } from '../../data/mockData'
import './match.css'

export function MatchApplyComplete() {
  const { id } = useParams()
  const match = matches.find((item) => item.id === id)

  return (
    <div className="page match_flow_page">
      <section className="match_complete_panel">
        <span aria-hidden="true">✓</span>
        <h1>참가 신청이 완료되었습니다</h1>
        <p>팀장의 승낙 여부를 기다려주세요. 승인 또는 조율이 필요하면 등록한 연락처로 안내가 전달됩니다.</p>
      </section>

      <section className="match_notice_panel">
        <h2>숙지해야 할 정보</h2>
        <ul>
          <li>{match ? `${match.date} ${match.time}까지 ${match.fieldName}에 도착해주세요.` : '신청한 경기의 날짜와 장소를 다시 확인해주세요.'}</li>
          <li>현장에서는 고글을 벗지 않고, 세이프존 규칙을 먼저 확인해주세요.</li>
          <li>참석이 어려워지면 팀장 승인 전이라도 빠르게 취소 연락을 남겨주세요.</li>
          <li>{match?.rentalAvailable ? '렌탈을 신청했다면 신분증과 렌탈 비용을 준비해주세요.' : '이 일정은 장비 렌탈이 제공되지 않으니 개인 장비를 준비해주세요.'}</li>
        </ul>
      </section>

      {match ? (
        <section className="match_apply_summary">
          <strong>{match.title}</strong>
          <p>{match.region} · {match.fieldName} · {match.fee}</p>
        </section>
      ) : null}

      <div className="list">
        <Link className="button primary_button" to="/my/schedule">내 경기 일정 보기</Link>
        <Link className="button" to="/home">홈으로</Link>
      </div>
    </div>
  )
}
