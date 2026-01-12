import { Link, useLocation } from 'react-router-dom'
import styles from '@/shared/styles/navigation.module.css'

export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.left}>
            <Link to="/" className={styles.logo}>
              🌉 Bridge BIM Platform
            </Link>
            <div className={styles.menu}>
              <Link
                to="/"
                className={`${styles.menuItem} ${
                  isActive('/') ? styles.menuItemActive : styles.menuItemInactive
                }`}
              >
                대시보드
              </Link>
              <Link
                to="/bridges"
                className={`${styles.menuItem} ${
                  isActive('/bridges') ? styles.menuItemActive : styles.menuItemInactive
                }`}
              >
                교량 목록
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
