import styles from './error.module.css'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className={styles.errorMessage}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>
          <span className={styles.errorIconText}>⚠️</span>
        </div>
        <div className={styles.errorText}>
          <p className={styles.errorMessageText}>{message}</p>
        </div>
        {onRetry && (
          <div className={styles.errorActions}>
            <button
              onClick={onRetry}
              className={styles.retryButton}
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function ErrorPage({ message }: { message: string }) {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorPageContent}>
        <ErrorMessage message={message} />
      </div>
    </div>
  )
}
