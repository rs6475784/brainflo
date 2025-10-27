import { useState, useEffect, useRef, useCallback } from 'react'

export const useTimer = (initialDuration = 0) => {
  const [duration, setDuration] = useState(initialDuration)
  const [isActive, setIsActive] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive])

  const start = useCallback(() => {
    setIsActive(true)
  }, [])

  const stop = useCallback(() => {
    setIsActive(false)
  }, [])

  const reset = useCallback(() => {
    setIsActive(false)
    setDuration(0)
  }, [])

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    duration,
    isActive,
    start,
    stop,
    reset,
    formattedTime: formatTime(duration)
  }
}
