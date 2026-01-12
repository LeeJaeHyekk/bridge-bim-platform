import { Outlet } from 'react-router-dom'
import { Navigation } from '@/shared/ui'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Outlet />
    </div>
  )
}
