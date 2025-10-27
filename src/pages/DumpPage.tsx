import React, { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { DumpTextarea } from '../components/dump/DumpTextarea'
import { VoiceRecorder } from '../components/dump/VoiceRecorder'
import { TimerControls } from '../components/dump/TimerControls'
import { ActionButtons } from '../components/dump/ActionButtons'
import { GeneratedIdeas } from '../components/dump/GeneratedIdeas'
import { useDumps } from '../hooks/useDumps'
import { useUsageLimits } from '../hooks/useUsageLimits'
import { functions } from '../lib/supabase'
import { useToast } from '../components/common/Toast'
import { validateDumpContent } from '../utils/validation'
import type { GeneratedIdeas as GeneratedIdeasType } from '../lib/types'

export const DumpPage: React.FC = () => {
  const [content, setContent] = useState('')
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdeasType | null>(null)

  const { createDump } = useDumps()
  const {
    canCreateDump,
    canGenerateIdeas,
    incrementDumpCount,
    incrementAiRequestCount
  } = useUsageLimits()
  const { showToast, ToastContainer } = useToast()

  const handleSave = async () => {
    const validation = validateDumpContent(content)
    if (!validation.valid) {
      showToast(validation.message || 'Invalid content', 'error')
      return
    }

    if (!canCreateDump()) {
      showToast('You have reached your monthly dump limit. Please upgrade to continue.', 'error')
      return
    }

    setSaveLoading(true)

    const { error } = await createDump(content)

    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Brain dump saved successfully!', 'success')
      await incrementDumpCount()
      setContent('')
      setGeneratedIdeas(null)
    }

    setSaveLoading(false)
  }

  const handleGenerateIdeas = async () => {
    const validation = validateDumpContent(content)
    if (!validation.valid) {
      showToast(validation.message || 'Invalid content', 'error')
      return
    }

    if (!canGenerateIdeas()) {
      showToast('You have reached your monthly AI request limit. Please upgrade to continue.', 'error')
      return
    }

    setGenerateLoading(true)

    // First save the dump
    const { data: dumpData, error: dumpError } = await createDump(content)

    if (dumpError || !dumpData) {
      showToast('Failed to save dump', 'error')
      setGenerateLoading(false)
      return
    }

    await incrementDumpCount()

    // Then generate ideas
    const { data: ideasData, error } = await functions.generateIdeas(content, dumpData.id)

    if (error) {
      showToast('Failed to generate ideas. Please try again.', 'error')
    } else {
      showToast('Content ideas generated!', 'success')
      setGeneratedIdeas(ideasData.ideas)
      await incrementAiRequestCount()
    }

    setGenerateLoading(false)
  }

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your current dump?')) {
      setContent('')
      setGeneratedIdeas(null)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Brain Dump</h1>
            <p className="text-base text-[#737373]">
              Let your thoughts flow. Write or speak—no structure needed.
            </p>
          </div>
          <TimerControls />
        </div>

        {/* Main Content Area */}
        <div className="space-y-5">
          <DumpTextarea
            value={content}
            onChange={setContent}
            voiceTranscript={voiceTranscript}
          />

          <div className="flex items-center justify-between">
            <VoiceRecorder onTranscriptChange={setVoiceTranscript} />
            <ActionButtons
              onSave={handleSave}
              onGenerateIdeas={handleGenerateIdeas}
              onClear={handleClear}
              saveLoading={saveLoading}
              generateLoading={generateLoading}
              canGenerateIdeas={canGenerateIdeas()}
              hasContent={content.trim().length > 0}
            />
          </div>
        </div>

        {/* Generated Ideas */}
        <GeneratedIdeas ideas={generatedIdeas} loading={generateLoading} />
      </div>

      <ToastContainer />
    </AppLayout>
  )
}
