interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-red-400 text-xl">⚠️</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onRetry && (
          <div className="ml-4">
            <button
              onClick={onRetry}
              className="text-sm font-medium text-red-700 hover:text-red-900 underline"
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <ErrorMessage message={message} />
      </div>
    </div>
  )
}
