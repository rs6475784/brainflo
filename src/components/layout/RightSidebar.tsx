import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDumps } from '../../hooks/useDumps'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { formatRelativeTime, truncateText } from '../../utils/formatting'
import { db } from '../../lib/supabase'
import type { Prompt } from '../../lib/types'

export const RightSidebar: React.FC = () => {
  const { dumps, loading } = useDumps()
  const [prompt, setPrompt] = useState<Prompt | null>(null)

  useEffect(() => {
    fetchRandomPrompt()
  }, [])

  const fetchRandomPrompt = async () => {
    const { data } = await db.getRandomPrompt()
    if (data) {
      setPrompt(data)
    }
  }

  const recentDumps = dumps.slice(0, 5)

  return (
    <div className="w-80 bg-white border-l border-[#e5e5e5] h-screen overflow-y-auto">
      {/* Writing Prompt */}
      <div className="p-5 border-b border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Writing Prompt</h3>
          <button
            onClick={fetchRandomPrompt}
            className="text-sm text-[#737373] hover:text-black"
          >
            ○
          </button>
        </div>
        {prompt ? (
          <p className="text-sm text-[#737373] leading-relaxed">
            {prompt.prompt_text}
          </p>
        ) : (
          <p className="text-sm text-[#737373]">Loading prompt...</p>
        )}
      </div>

      {/* Recent Dumps */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Recent Dumps</h3>
          <Link
            to="/history"
            className="text-sm text-[#737373] hover:text-black"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : recentDumps.length === 0 ? (
          <p className="text-sm text-[#737373] text-center py-8">
            No dumps yet. Start writing!
          </p>
        ) : (
          <div className="space-y-3">
            {recentDumps.map((dump) => (
              <Link
                key={dump.id}
                to={`/dump/${dump.id}`}
                className="block bg-[#fafafa] border border-[#e5e5e5] rounded-md p-3 hover:bg-white hover:border-black transition-all"
              >
                <p className="text-sm text-black line-clamp-2 mb-2">
                  {truncateText(dump.content, 100)}
                </p>
                <div className="flex items-center justify-between text-xs text-[#737373]">
                  <span>{dump.word_count} words</span>
                  <span>{formatRelativeTime(dump.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
