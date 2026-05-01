import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { highlights } from '../../data/mockData'
import { RequireLoginModal } from '../../layout/RequireLoginModal'

export function MvpVote() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  const vote = (id: string) => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      setModalOpen(true)
      return
    }
    localStorage.setItem('votedMvpId', id)
    navigate('/tournament/mvp-complete')
  }

  return (
    <div className="page">
      <h1 className="page-title">MVP 투표</h1>
      <section className="section">
        {highlights.map((candidate) => (
          <article className="card" key={candidate.id}>
            <h2>{candidate.playerName}</h2>
            <p>{candidate.teamName}</p>
            <p>{candidate.description}</p>
            <p>현재 투표수 {candidate.votes}</p>
            <button className="button primary-button" type="button" onClick={() => vote(candidate.id)}>투표하기</button>
          </article>
        ))}
      </section>
      <RequireLoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
