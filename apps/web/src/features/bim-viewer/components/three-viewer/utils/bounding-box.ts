// 바운딩 박스 계산
export function calculateBoundingBox(geometries: { boundingBox: { min: [number, number, number]; max: [number, number, number] } }[]): {
  min: [number, number, number]
  max: [number, number, number]
} {
  if (geometries.length === 0) {
    return {
      min: [-10, -10, -10],
      max: [10, 10, 10],
    }
  }

  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity

  geometries.forEach((geo) => {
    minX = Math.min(minX, geo.boundingBox.min[0])
    minY = Math.min(minY, geo.boundingBox.min[1])
    minZ = Math.min(minZ, geo.boundingBox.min[2])
    maxX = Math.max(maxX, geo.boundingBox.max[0])
    maxY = Math.max(maxY, geo.boundingBox.max[1])
    maxZ = Math.max(maxZ, geo.boundingBox.max[2])
  })

  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
  }
}
