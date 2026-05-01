import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { FloatingAiButton } from './FloatingAiButton'
import { Header } from './Header'

export function AppShell() {
  return (
    <div className="mobile-frame">
      <Header />
      <main>
        <Outlet />
      </main>
      <FloatingAiButton />
      <BottomNav />
    </div>
  )
}
