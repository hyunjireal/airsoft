import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KeywordTag from '../../components/KeywordTag'
import { LoginButton } from '../../components/LoginButton'
import arrowLIcon from '../../asset/icons/arrow_l.svg'
import arrowRIcon from '../../asset/icons/arrow_r.svg'
import guestLocaIcon from '../../asset/icons/guest_loca.svg'
import guestScheduleIcon from '../../asset/icons/guest_schedule.svg'
import './match.css'

const difficultyOptions = ['초보', '숙련자', '상관없음']

export function MatchGuestWantedCreate() {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState('초보')
  const [headcount, setHeadcount] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/match')
  }

  const decreaseHeadcount = () => {
    setHeadcount((count) => Math.max(1, count - 1))
  }

  const increaseHeadcount = () => {
    setHeadcount((count) => count + 1)
  }

  return (
    <div className="match_guest_create_page">
      <header className="match_page_header">
        <button className="match_page_back_button" type="button" aria-label="뒤로가기" onClick={goBack}>
          <img src={arrowLIcon} alt="" aria-hidden="true" />
        </button>
        <h1 className="match_page_title match_guest_create_title">용병 모집글</h1>
      </header>

      <main className="match_guest_create_body">
        <section className="mgc_level_card" aria-labelledby="mgc-level-1">
          <div className="mgc_level_title">
            <span className="mgc_level_number">1</span>
            <h2 id="mgc-level-1" className="body_m_20">장소와 시간을 선택해주세요.</h2>
          </div>
          <div className="mgc_menu_group">
            <button className="mgc_menu" type="button">
              <span className="mgc_menu_left">
                <img src={guestLocaIcon} alt="" aria-hidden="true" />
                <span>지역/필드 선택</span>
              </span>
              <img className="mgc_menu_arrow" src={arrowRIcon} alt="" aria-hidden="true" />
            </button>
            <button className="mgc_menu" type="button">
              <span className="mgc_menu_left">
                <img src={guestScheduleIcon} alt="" aria-hidden="true" />
                <span>날짜/시간 선택</span>
              </span>
              <img className="mgc_menu_arrow" src={arrowRIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="mgc_level_card" aria-labelledby="mgc-level-2">
          <div className="mgc_level_title">
            <span className="mgc_level_number">2</span>
            <h2 id="mgc-level-2" className="body_m_20">필요한 용병 정보를 입력해주세요.</h2>
          </div>
          <article className="mgc_form_card">
            <span className="mgc_form_label body_m_16">난이도</span>
            <div className="mgc_tag_group" aria-label="난이도 선택">
              {difficultyOptions.map((option) => (
                <button
                  className="mgc_tag_button"
                  type="button"
                  key={option}
                  onClick={() => setDifficulty(option)}
                >
                  <KeywordTag className={difficulty === option ? 'mgc_tag is_active' : 'mgc_tag'}>
                    {option}
                  </KeywordTag>
                </button>
              ))}
            </div>
          </article>
          <article className="mgc_form_card mgc_count_card">
            <span className="mgc_count_label body_m_16">참여 인원</span>
            <div className="mgc_count_control" aria-label="인원 선택">
              <button type="button" onClick={decreaseHeadcount} aria-label="인원 줄이기">-</button>
              <span>{headcount}</span>
              <button type="button" onClick={increaseHeadcount} aria-label="인원 늘리기">+</button>
            </div>
          </article>
        </section>

        <section className="mgc_level_card" aria-labelledby="mgc-level-3">
          <div className="mgc_level_title">
            <span className="mgc_level_number">3</span>
            <h2 id="mgc-level-3" className="body_m_20">제목과 내용을 입력해주세요.</h2>
          </div>
          <label className="mgc_form_card">
            <span className="mgc_form_label body_m_16">제목</span>
            <input
              className="mgc_text_field"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력하세요."
            />
          </label>
          <label className="mgc_form_card">
            <span className="mgc_form_label body_m_16">본문</span>
            <textarea
              className="mgc_text_field mgc_text_area"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="본문을 입력하세요."
            />
          </label>
        </section>
      </main>

      <div className="mgc_submit_wrap">
        <LoginButton
          style={{ background: '#676b5d', backgroundColor: '#676b5d', color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
          onClick={() => navigate('/match')}
        >
          등록하기
        </LoginButton>
      </div>
    </div>
  )
}
