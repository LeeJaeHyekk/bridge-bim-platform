export const BIMComponentType = {
  PYLON: 'Pylon',
  CABLE: 'Cable',
  DECK: 'Deck',
  FOUNDATION: 'Foundation',
  BEAM: 'Beam',
  COLUMN: 'Column',
  WALL: 'Wall',
  OTHER: 'Other',
} as const

export type BIMComponentType = (typeof BIMComponentType)[keyof typeof BIMComponentType]
