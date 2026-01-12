import { useState } from 'react'
import type { BIMFilter, BIMComponentType } from '@bridge-bim-platform/shared'
import { BIMComponentTypeEnum } from '@bridge-bim-platform/shared'

interface BIMFilterProps {
  onFilterChange: (filter: BIMFilter) => void
}

export function BIMFilter({ onFilterChange }: BIMFilterProps) {
  const [selectedTypes, setSelectedTypes] = useState<BIMComponentType[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<
    ('SAFE' | 'WARNING' | 'DANGER')[]
  >([])

  const handleTypeToggle = (type: BIMComponentType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type]

    setSelectedTypes(newTypes)
    updateFilter(newTypes, selectedStatuses)
  }

  const handleStatusToggle = (
    status: 'SAFE' | 'WARNING' | 'DANGER',
  ) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]

    setSelectedStatuses(newStatuses)
    updateFilter(selectedTypes, newStatuses)
  }

  const updateFilter = (
    types: BIMComponentType[],
    statuses: ('SAFE' | 'WARNING' | 'DANGER')[],
  ) => {
    const filter: BIMFilter = {}
    if (types.length > 0) {
      filter.componentType = types
    }
    if (statuses.length > 0) {
      filter.status = statuses
    }
    onFilterChange(filter)
  }

  const resetFilter = () => {
    setSelectedTypes([])
    setSelectedStatuses([])
    onFilterChange({})
  }

  return (
    <div className="p-4 border-b space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">필터</h3>
        <button
          onClick={resetFilter}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          초기화
        </button>
      </div>

      {/* 부재 타입 필터 */}
      <div>
        <label className="block text-sm font-medium mb-2">부재 타입</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(BIMComponentTypeEnum).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={`px-3 py-1 rounded text-sm ${
                selectedTypes.includes(type)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 상태 필터 */}
      <div>
        <label className="block text-sm font-medium mb-2">상태</label>
        <div className="flex flex-wrap gap-2">
          {(['SAFE', 'WARNING', 'DANGER'] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusToggle(status)}
              className={`px-3 py-1 rounded text-sm ${
                selectedStatuses.includes(status)
                  ? status === 'SAFE'
                    ? 'bg-green-500 text-white'
                    : status === 'WARNING'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
