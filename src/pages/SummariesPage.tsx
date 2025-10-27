import React, { useState, useEffect } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { Button } from '../components/common/Button'
import { db, functions } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/common/Toast'
import { formatDate } from '../utils/formatting'
import type { Summary } from '../lib/types'

export const SummariesPage: React.FC = () => {
  const [periodType, setPeriodType] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const { user } = useAuth()
  const { showToast, ToastContainer } = useToast()

  useEffect(() => {
    fetchSummaries()
  }, [periodType])

  const fetchSummaries = async () => {
    setLoading(true)

    const { data, error } = await db.getSummaries(user?.id!, periodType)

    if (error) {
      showToast('Failed to load summaries', 'error')
    } else {
      setSummaries(data || [])
    }

    setLoading(false)
  }

  const handleGenerateSummary = async () => {
    if (!user) return

    setGenerating(true)

    const { error } = await functions.generateSummary(user.id, periodType)

    if (error) {
      showToast(error.error || 'Failed to generate summary', 'error')
    } else {
      showToast('Summary generated successfully!', 'success')
      await fetchSummaries()
    }

    setGenerating(false)
  }

  const latestSummary = summaries.length > 0 ? summaries[0] : null

  return (
    <AppLayout showRightSidebar={false}>
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Summaries</h1>
          <p className="text-base text-[#737373] mb-6">
            Insights and patterns from your brain dumps
          </p>

          {/* Period Tabs */}
          <div className="flex items-center gap-2 mb-6">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setPeriodType(period)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  periodType === period
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-[#d4d4d4] hover:bg-[#fafafa]'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          <Button onClick={handleGenerateSummary} loading={generating}>
            Generate New Summary
          </Button>
        </div>

        {/* Summary Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner text="Loading summaries..." />
          </div>
        ) : !latestSummary ? (
          <div className="text-center py-20">
            <p className="text-lg text-[#737373] mb-2">No summaries yet</p>
            <p className="text-sm text-[#737373]">
              Generate your first summary to see insights from your dumps
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
                <div className="text-sm text-[#737373] mb-1">Total Dumps</div>
                <div className="text-3xl font-bold">{latestSummary.total_dumps}</div>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
                <div className="text-sm text-[#737373] mb-1">Total Words</div>
                <div className="text-3xl font-bold">{latestSummary.total_words}</div>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
                <div className="text-sm text-[#737373] mb-1">Ideas Generated</div>
                <div className="text-3xl font-bold">{latestSummary.total_ideas}</div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white border border-[#e5e5e5] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Insights</h3>
              <p className="text-base leading-relaxed text-[#737373]">
                {latestSummary.insights}
              </p>
            </div>

            {/* Content Pillars */}
            {latestSummary.content_pillars && latestSummary.content_pillars.length > 0 && (
              <div className="bg-white border border-[#e5e5e5] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Content Pillars</h3>
                <div className="flex flex-wrap gap-2">
                  {latestSummary.content_pillars.map((pillar, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#fafafa] border border-[#e5e5e5] rounded-full text-sm font-medium"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Period Info */}
            <div className="text-sm text-[#737373] text-center">
              Summary period: {formatDate(latestSummary.start_date)} - {formatDate(latestSummary.end_date)}
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </AppLayout>
  )
}
