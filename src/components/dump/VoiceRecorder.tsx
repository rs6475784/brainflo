import React, { useEffect } from 'react'
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition'

interface VoiceRecorderProps {
  onTranscriptChange: (transcript: string) => void
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptChange }) => {
  const {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition()

  useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript)
      resetTranscript()
    }
  }, [transcript, onTranscriptChange, resetTranscript])

  if (!isSupported) {
    return (
      <div className="text-sm text-[#737373]">
        Voice input not supported in this browser. Please use Chrome or Safari.
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          isListening
            ? 'bg-black text-white'
            : 'bg-white text-black border border-[#d4d4d4] hover:bg-[#fafafa]'
        }`}
      >
        <span className={isListening ? 'animate-pulse' : ''}>◉</span>
        {isListening ? 'Stop Recording' : 'Voice Mode'}
      </button>

      {error && (
        <span className="text-sm text-[#737373]">{error}</span>
      )}
    </div>
  )
}
