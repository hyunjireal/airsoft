import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="page">
      <section className="home-summary">
        <article className="card">
          <span className="badge">입문자</span>
          <h1 className="page-title">안전제일 뉴비 '삼삼오오'님, 오늘도 안전한 슈팅 하세요!</h1>
          <div className="chip-row" aria-label="보유 뱃지">
            <span className="chip">🔰 첫 AI 질문 완료</span>
            <span className="chip">🌿 친환경 바이오탄 지식인</span>
          </div>
        </article>

        <article className="card upcoming-match-card">
          <div className="card-row">
            <span className="badge">D-3</span>
            <strong>다가오는 경기</strong>
          </div>
          <p>이번 주 토요일 오후 2시 / 하남 OOO 야외 필드 / 🚨 주의: 해당 필드는 친환경 바이오 BB탄 필수 사용 구역입니다.</p>
          <Link className="button" to="/my/schedule">더보기</Link>
        </article>
      </section>

      <section className="section">
        <article className="card buddy-card">
          <span className="badge">상태 B</span>
          <p className="muted">버디 매칭 완료 (멘토 정보 노출 상태)</p>
          <h2>나의 밀착 가이드 멘토</h2>
          <strong>🏅 캡틴_서울 (숙련자 / 필드 경력 5년)</strong>
          <p>"전동건(AEG) 렌탈 및 CQB 필드 가이드 전문입니다. 편하게 물어보세요!"</p>
          <p className="status-text">이번 주 토요일 동행이 확정되었습니다.</p>
          <Link className="button primary-button" to="/chat">버디와 채팅하기</Link>
        </article>
      </section>

      <section className="section">
        <div className="card-row">
          <span className="badge">추천</span>
          <h2 className="section-title">사용자에게 맞는 경기/모집공고</h2>
        </div>
        <Link className="card recommendation-card" to="/match/match-003">
          <span className="badge">뉴비/렌탈 환영</span>
          <h2>[뉴비/렌탈 환영] 토요일 오전 실내 CQB 가벼운 교전 모임</h2>
          <p>초보자와 렌탈 이용자를 우선 고려한 실내 CQB 추천 경기입니다.</p>
          <span className="button">자세히 보러가기</span>
        </Link>
        <Link className="card recommendation-card" to="/mercenary/merc-003">
          <span className="badge">밀심/하드코어</span>
          <h2>[밀심/하드코어] 40시간 야외 전술 플레이, 장비 필수 지참팀 모집</h2>
          <p>장비 지참과 긴 플레이 타임이 필요한 하드코어 팀 모집공고입니다.</p>
          <span className="button">자세히 보러가기</span>
        </Link>
      </section>

      <section className="section">
        <article className="card guide-quiz-card">
          <span className="badge">상태 A</span>
          <p className="muted">퀴즈 시작 전 (신규 유저)</p>
          <h2>에어소프트건 안전 튜토리얼</h2>
          <p>안전한 슈팅의 첫걸음! 5분 만에 끝내는 필수 안전 수칙 퀴즈 풀고 첫 뱃지를 획득해 보세요.</p>
          <Link className="button primary-button" to="/guide/quiz">첫 퀴즈 시작하기</Link>
        </article>
      </section>

      <section className="section">
        <div className="card-row">
          <span className="badge">Q&A</span>
          <h2 className="section-title">인기 질문</h2>
        </div>
        <article className="card qna-card">
          <h2>총열 끝에 주황색 칼라파트, 제가 직접 래커로 도색해도 불법 아닌가요?</h2>
          <div className="chip-row">
            <span className="chip">#AI가_답변완료</span>
            <span className="chip">#뉴비필독</span>
          </div>
        </article>
        <article className="card qna-card">
          <h2>겨울철 야외에서 가스건(GBB) 쏠 때 탄창 온도는 어떻게 유지하나요?</h2>
          <div className="chip-row">
            <span className="chip">#AI가_답변완료</span>
            <span className="chip">#뉴비필독</span>
          </div>
        </article>
        <Link className="button primary-button" to="/community/tip">팁 게시판으로 이동</Link>
      </section>

      <section className="section">
        <div className="card-row">
          <span className="badge">미디어</span>
          <h2 className="section-title">하이라이트 & MVP 투표</h2>
        </div>
        <Link className="card media-card" to="/tournament/highlights">
          <div className="placeholder-image">영상/이미지 썸네일</div>
          <h2>이번 주말 OOO 필드 치열했던 스피드소프트 하이라이트 모음.zip</h2>
        </Link>
        <article className="card media-card">
          <p>가장 완벽한 엄폐물 핑(Ping)을 찍어준 이번 주 최고의 버디를 뽑아주세요! 🏆</p>
          <Link className="button primary-button" to="/tournament/mvp-vote">투표하러 가기</Link>
        </article>
      </section>
    </div>
  )
}
