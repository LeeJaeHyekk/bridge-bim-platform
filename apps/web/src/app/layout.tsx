import { Outlet } from 'react-router-dom'
import { Navigation } from '@/shared/ui'
import styles from './layout.module.css'

export function AppLayout() {
  return (
    <div className={styles.container}>
      <Navigation />
      <Outlet />
    </div>
  )
}
