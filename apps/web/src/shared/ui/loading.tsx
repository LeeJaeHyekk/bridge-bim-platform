import styles from './loading.module.css'
import { clsx } from 'clsx'

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={styles.spinnerContainer}>
      <div
        className={clsx(
          styles.spinner,
          size === 'sm' && styles.spinnerSmall,
          size === 'md' && styles.spinnerMedium,
          size === 'lg' && styles.spinnerLarge
        )}
      />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.loadingPageContent}>
        <LoadingSpinner size="lg" />
        <p className={styles.loadingPageMessage}>로딩 중...</p>
      </div>
    </div>
  )
}
