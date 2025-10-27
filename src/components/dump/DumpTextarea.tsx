import React, { useState, useEffect } from 'react'
import { countWords } from '../../utils/validation'

interface DumpTextareaProps {
  value: string
  onChange: (value: string) => void
  voiceTranscript?: string
}

export const DumpTextarea: React.FC<DumpTextareaProps> = ({
  value,
  onChange,
  voiceTranscript
}) => {
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    setWordCount(countWords(value))
  }, [value])

  useEffect(() => {
    if (voiceTranscript) {
      onChange(value + (value ? ' ' : '') + voiceTranscript)
    }
  }, [voiceTranscript])

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing your brain dump here...

Let your thoughts flow freely. No structure needed—just capture what's on your mind."
        className="w-full min-h-[400px] bg-[#fafafa] border border-[#e5e5e5] rounded-lg p-5 text-base leading-relaxed text-black resize-vertical transition-all duration-200 focus:outline-none focus:bg-white focus:border-black focus:shadow-[0_0_0_2px_rgba(0,0,0,0.05)]"
      />
      <div className="mt-3 text-right text-sm text-[#737373]">
        {wordCount} word{wordCount !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
