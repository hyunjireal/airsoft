import { useNavigate } from 'react-router-dom'

export function PostCreate() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <h1 className="page-title">글쓰기</h1>
      <section className="section">
        <label className="field">게시판 선택<select className="select"><option>자유 게시판</option><option>질문</option><option>후기</option><option>팁</option></select></label>
        <label className="field">제목<input className="input" /></label>
        <label className="field">내용<textarea className="textarea" /></label>
        <label className="field">태그<input className="input" /></label>
        <button className="button" type="button">임시저장</button>
        <button className="button primary-button" type="button" onClick={() => navigate('/community/free')}>등록하기</button>
      </section>
    </div>
  )
}
