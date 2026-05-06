import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loadingChar from '../../asset/images/loading_char.png'
import beginnerChar from '../../asset/images/com_beginner_char01.png'
import './match.css'

type CreateStep = 'form' | 'loading' | 'recommendation' | 'complete'
type MatchKind = 'personal' | 'team' | 'guest'

const matchKinds: Array<{ label: string; value: MatchKind }> = [
  { label: '개인전', value: 'personal' },
  { label: '팀전', value: 'team' },
  { label: '게스트', value: 'guest' },
]

export function MatchCreateHome() {
  const navigate = useNavigate()
  const [step, setStep] = useState<CreateStep>('form')
  const [matchKind, setMatchKind] = useState<MatchKind>('team')

  useEffect(() => {
    if (step !== 'loading') {
      return
    }

    const timer = window.setTimeout(() => setStep('recommendation'), 1400)

    return () => window.clearTimeout(timer)
  }, [step])

  if (step === 'loading') {
    return (
      <div className="match_create_page match_ai_loading_page">
        <h1>AI가 최적의 팀을<br />찾고 있어요</h1>
        <img src={loadingChar} alt="" />
        <section className="match_ai_progress_card" aria-label="AI 매칭 진행 상태">
          <p>사용자 정보 분석 <span aria-hidden="true">✓</span></p>
          <p>선호 조건 분석 <span aria-hidden="true">✓</span></p>
          <p>적합한 팀 탐색중 <span className="match_spinner" aria-hidden="true" /></p>
          <p>매칭 점수 계산중</p>
          <p>팀 제안 준비중</p>
        </section>
        <button className="match_create_primary" type="button" onClick={() => setStep('form')}>취소</button>
      </div>
    )
  }

  if (step === 'recommendation') {
    return (
      <div className="match_recommend_page">
        <header className="match_recommend_hero">
          <img src={loadingChar} alt="" />
          <div>
            <h1>추천 1팀</h1>
            <div className="match_recommend_tags">
              <span>#초보 환영</span>
              <span>#서울</span>
              <span>#주말</span>
            </div>
          </div>
        </header>

        <section className="match_recommend_section">
          <h2>팀원 <span>6 / 8</span></h2>
          <div className="match_member_row">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="match_member" key={index}>
                <img src={index % 2 === 0 ? loadingChar : beginnerChar} alt="" />
                <span>팀원{index + 1}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="match_recommend_section">
          <h2>플레이 위치</h2>
          <p>서울 OO 사격장</p>
          <div className="match_map_mock" aria-label="서울 사격장 시설 안내도">
            <strong>OO서울사격장 시설 안내도</strong>
            <div className="match_map_grid">
              <span>입구</span>
              <span>안내실</span>
              <span>휴게실</span>
              <span>화장실</span>
              <span>제1필드 A</span>
              <span>제1필드 B</span>
              <span>주차장</span>
              <span>장비 대여</span>
            </div>
          </div>
        </section>

        <section className="match_recommend_section">
          <h2>플레이 시간</h2>
          <p>2026-05-03<br />15:00 ~ 17:00</p>
        </section>

        <section className="match_recommend_section">
          <h2>팀 메세지</h2>
          <article className="match_team_message">
            <img src={loadingChar} alt="" />
            <div>
              <p>함께 열심히 해봐요</p>
              <time>2026.05.03</time>
            </div>
          </article>
        </section>

        <button className="match_create_primary" type="button" onClick={() => setStep('complete')}>이 팀으로 확정</button>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="match_create_page match_complete_flow_page">
        <img src={beginnerChar} alt="" />
        <h1>매칭이 확정되었어요!</h1>
        <p>추천 1팀!!</p>
        <section className="match_confirm_card">
          <span aria-hidden="true">▣</span>
          <div>
            <h2>다음 경기 일정</h2>
            <p>2026-05-03<br />15:00 ~ 17:00</p>
          </div>
        </section>
        <h2 className="match_chat_title">팀 채팅</h2>
        <button className="match_chat_entry" type="button">채팅방 입장하기</button>
        <button className="match_create_primary" type="button" onClick={() => navigate('/my/schedule')}>예약 확인</button>
      </div>
    )
  }

  return (
    <div className="match_create_page match_preference_page">
      <h1>선호 조건을<br />설정해 주세요</h1>

      <div className="match_create_tabs" aria-label="매치 유형">
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

      <section className="match_preference_form">
        <label>
          지역
          <select defaultValue="경기도">
            <option>경기도</option>
            <option>서울</option>
            <option>인천</option>
          </select>
        </label>
        <label>
          시간
          <select defaultValue="주말 오후">
            <option>주말 오후</option>
            <option>평일 저녁</option>
            <option>주말 오전</option>
          </select>
        </label>
        <label>
          게임 선택
          <select defaultValue="실내 OOO 구장">
            <option>실내 OOO 구장</option>
            <option>야외 포레스트 필드</option>
            <option>CQB 입문 스크림</option>
          </select>
        </label>
        <label>
          실력
          <select defaultValue="초급">
            <option>초급</option>
            <option>입문자</option>
            <option>경험자</option>
          </select>
        </label>
      </section>

      <button className="match_create_primary" type="button" onClick={() => setStep('loading')}>다음</button>
    </div>
  )
}
