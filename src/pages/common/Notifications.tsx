import { notifications } from '../../data/mockData'

export function Notifications() {
  return (
    <div className="page">
      <h1 className="page-title">알림</h1>
      <section className="section">
        {notifications.map((notification) => <article className="card" key={notification}>{notification}</article>)}
      </section>
    </div>
  )
}
