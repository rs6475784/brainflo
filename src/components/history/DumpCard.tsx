import React from 'react'
import { formatDateTime, truncateText } from '../../utils/formatting'
import type { BrainDump } from '../../lib/types'

interface DumpCardProps {
  dump: BrainDump
  onClick?: () => void
}

export const DumpCard: React.FC<DumpCardProps> = ({ dump, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#e5e5e5] rounded-lg p-5 hover:border-black hover:shadow-md transition-all cursor-pointer"
    >
      <p className="text-base text-black line-clamp-4 mb-4 leading-relaxed">
        {truncateText(dump.content, 200)}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-[#737373]">
          <span>{dump.word_count} words</span>
          {dump.has_generated_ideas && (
            <span className="flex items-center gap-1">
              <span>◉</span> Ideas generated
            </span>
          )}
        </div>
        <span className="text-[#737373]">{formatDateTime(dump.created_at)}</span>
      </div>
    </div>
  )
}
