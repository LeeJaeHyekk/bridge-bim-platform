import { useState } from 'react'
import type { BIMFilter, BIMComponentType } from '@bridge-bim-platform/shared'
import { BIMComponentTypeEnum } from '@bridge-bim-platform/shared'
import styles from './bim-filter.module.css'
import { clsx } from 'clsx'

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>필터</h3>
        <button
          onClick={resetFilter}
          className={styles.resetButton}
        >
          초기화
        </button>
      </div>

      {/* 부재 타입 필터 */}
      <div className={styles.section}>
        <label className={styles.label}>부재 타입</label>
        <div className={styles.buttonGroup}>
          {Object.values(BIMComponentTypeEnum).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={clsx(
                styles.filterButton,
                selectedTypes.includes(type)
                  ? styles.filterButtonActive
                  : styles.filterButtonInactive
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 상태 필터 */}
      <div className={styles.section}>
        <label className={styles.label}>상태</label>
        <div className={styles.buttonGroup}>
          {(['SAFE', 'WARNING', 'DANGER'] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusToggle(status)}
              className={clsx(
                styles.filterButton,
                selectedStatuses.includes(status)
                  ? status === 'SAFE'
                    ? styles.filterButtonSafe
                    : status === 'WARNING'
                      ? styles.filterButtonWarning
                      : styles.filterButtonDanger
                  : styles.filterButtonInactive
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
