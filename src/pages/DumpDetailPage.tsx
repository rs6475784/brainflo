import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { GeneratedIdeas } from '../components/dump/GeneratedIdeas'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { Button } from '../components/common/Button'
import { db, functions } from '../lib/supabase'
import { useUsageLimits } from '../hooks/useUsageLimits'
import { useToast } from '../components/common/Toast'
import { formatDateTime } from '../utils/formatting'
import type { BrainDump, GeneratedIdeas as GeneratedIdeasType } from '../lib/types'

export const DumpDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [dump, setDump] = useState<BrainDump | null>(null)
  const [ideas, setIdeas] = useState<GeneratedIdeasType | null>(null)
  const [loading, setLoading] = useState(true)
  const [generateLoading, setGenerateLoading] = useState(false)

  const { canGenerateIdeas, incrementAiRequestCount } = useUsageLimits()
  const { showToast, ToastContainer } = useToast()

  useEffect(() => {
    if (id) {
      fetchDump()
    }
  }, [id])

  const fetchDump = async () => {
    if (!id) return

    setLoading(true)

    const { data: dumpData, error: dumpError } = await db.getDump(id)

    if (dumpError || !dumpData) {
      showToast('Dump not found', 'error')
      navigate('/history')
      return
    }

    setDump(dumpData)

    // Fetch ideas if they exist
    if (dumpData.has_generated_ideas) {
      const { data: ideasData } = await db.getIdeasForDump(id)
      if (ideasData) {
        setIdeas(ideasData)
      }
    }

    setLoading(false)
  }

  const handleGenerateIdeas = async () => {
    if (!dump || !id) return

    if (!canGenerateIdeas()) {
      showToast('You have reached your monthly AI request limit. Please upgrade to continue.', 'error')
      return
    }

    setGenerateLoading(true)

    const { data, error } = await functions.generateIdeas(dump.content, id)

    if (error) {
      showToast('Failed to generate ideas. Please try again.', 'error')
    } else {
      showToast('Content ideas generated!', 'success')
      setIdeas(data.ideas)
      setDump({ ...dump, has_generated_ideas: true })
      await incrementAiRequestCount()
    }

    setGenerateLoading(false)
  }

  const handleDelete = async () => {
    if (!dump || !id) return

    if (!window.confirm('Are you sure you want to delete this dump? This action cannot be undone.')) {
      return
    }

    const { error } = await db.deleteDump(id)

    if (error) {
      showToast('Failed to delete dump', 'error')
    } else {
      showToast('Dump deleted successfully', 'success')
      navigate('/history')
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner text="Loading dump..." />
        </div>
      </AppLayout>
    )
  }

  if (!dump) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg text-[#737373]">Dump not found</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout showRightSidebar={false}>
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Brain Dump</h1>
            <div className="flex items-center gap-4 text-sm text-[#737373]">
              <span>{formatDateTime(dump.created_at)}</span>
              <span>{dump.word_count} words</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/history')}>
              Back to History
            </Button>
            <Button variant="ghost" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        {/* Dump Content */}
        <div className="bg-white border border-[#e5e5e5] rounded-lg p-6">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {dump.content}
          </p>
        </div>

        {/* Generate Ideas Button */}
        {!dump.has_generated_ideas && (
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateIdeas}
              loading={generateLoading}
              disabled={!canGenerateIdeas()}
            >
              Generate Content Ideas
            </Button>
          </div>
        )}

        {/* Generated Ideas */}
        <GeneratedIdeas ideas={ideas} loading={generateLoading} />
      </div>

      <ToastContainer />
    </AppLayout>
  )
}
