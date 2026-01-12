import { Link } from 'react-router-dom'
import { useBridges } from '@/features/bridge/hooks'
import { BridgeCard } from '@/features/bridge/components'
import { LoadingSpinner, ErrorMessage } from '@/shared/ui'

export function BridgeListPage() {
  const { bridges, loading, error } = useBridges()

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-500">교량 목록을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage message={`교량 목록을 불러올 수 없습니다: ${error.message}`} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6 sm:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-6 transition-colors font-semibold text-lg"
          >
            <span className="mr-2 text-xl">←</span>
            대시보드로 돌아가기
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              교량 목록
            </h1>
            <p className="text-gray-700 text-xl leading-relaxed">
              총 <span className="font-bold text-blue-700 text-2xl">{bridges.length}</span>개의 교량이 등록되어 있습니다.
            </p>
          </div>
        </div>

        {bridges.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="text-7xl mb-6">🌉</div>
            <p className="text-gray-700 text-xl font-semibold mb-2">등록된 교량이 없습니다.</p>
            <p className="text-gray-500 text-base">새로운 교량을 등록해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bridges.map((bridge) => (
              <Link
                key={bridge.id}
                to={`/bridges/${bridge.id}`}
                className="block transform transition-transform hover:scale-[1.02]"
              >
                <BridgeCard bridge={bridge} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
