import { useParams, Link } from 'react-router-dom'
import { useBridge } from '@/features/bridge/hooks'
import { BIMViewer, BIMProperties } from '@/features/bim-viewer'
import { useState } from 'react'
import type { BIMComponent } from '@bridge-bim-platform/shared'
import { LoadingSpinner, ErrorMessage } from '@/shared/ui'

export function BridgeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { bridge, loading, error } = useBridge(id || '')
  const [selectedComponent, setSelectedComponent] =
    useState<BIMComponent | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-500">교량 정보를 불러오는 중...</p>
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
          <ErrorMessage message={`교량 정보를 불러올 수 없습니다: ${error.message}`} />
        </div>
      </div>
    )
  }

  if (!bridge) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-800 font-medium">교량을 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = {
    SAFE: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      label: '안전',
    },
    WARNING: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      label: '주의',
    },
    DANGER: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      label: '위험',
    },
  }

  const config = statusConfig[bridge.status]

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-white border-b-2 border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto p-6 sm:p-8">
          <Link
            to="/bridges"
            className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-6 transition-colors font-semibold text-lg"
          >
            <span className="mr-2 text-xl">←</span>
            교량 목록으로 돌아가기
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">{bridge.name}</h1>
              <p className="text-gray-700 text-lg flex items-center font-medium">
                <span className="mr-2 text-xl">📍</span>
                {bridge.location}
              </p>
            </div>
            <span
              className={`px-6 py-3 rounded-xl text-base font-bold border-2 self-start sm:self-auto ${config.bg} ${config.text} ${config.border}`}
            >
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BIM Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[600px] border-2 border-gray-100">
              {id && (
                <BIMViewer
                  bridgeId={id}
                  selectedComponent={selectedComponent}
                  onComponentSelect={setSelectedComponent}
                />
              )}
            </div>
          </div>

          {/* 속성 패널 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl h-[600px] overflow-y-auto border-2 border-gray-100">
              <BIMProperties component={selectedComponent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
