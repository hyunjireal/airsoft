import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { FloatingAiButton } from './FloatingAiButton'

export function AppShell() {
  return (
    <div className="mobile_frame">
      <main>
        <Outlet />
      </main>
      <FloatingAiButton />
      <BottomNav />
    </div>
  )
}
