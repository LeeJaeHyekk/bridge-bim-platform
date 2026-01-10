import { useParams } from 'react-router-dom'

export function BridgeDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>교량 상세</h1>
      <p>교량 ID: {id}</p>
    </div>
  )
}
