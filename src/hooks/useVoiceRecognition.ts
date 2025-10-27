import { useState, useEffect, useCallback, useRef } from 'react'

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string
      }
      isFinal: boolean
    }
    length: number
  }
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript)
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      setIsSupported(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return

    setError(null)
    setTranscript('')

    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (err: any) {
      setError(err.message)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return

    try {
      recognitionRef.current.stop()
      setIsListening(false)
    } catch (err: any) {
      setError(err.message)
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  }
}
