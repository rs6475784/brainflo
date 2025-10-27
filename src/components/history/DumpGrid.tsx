import React from 'react'
import { useNavigate } from 'react-router-dom'
import { DumpCard } from './DumpCard'
import { LoadingSpinner } from '../common/LoadingSpinner'
import type { BrainDump } from '../../lib/types'

interface DumpGridProps {
  dumps: BrainDump[]
  loading: boolean
}

export const DumpGrid: React.FC<DumpGridProps> = ({ dumps, loading }) => {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner text="Loading dumps..." />
      </div>
    )
  }

  if (dumps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-[#737373] mb-2">No brain dumps found</p>
        <p className="text-sm text-[#737373]">
          Start your first brain dump to see it here
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {dumps.map((dump) => (
        <DumpCard
          key={dump.id}
          dump={dump}
          onClick={() => navigate(`/dump/${dump.id}`)}
        />
      ))}
    </div>
  )
}
