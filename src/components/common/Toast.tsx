import React, { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-black text-white',
    error: 'bg-black text-white',
    info: 'bg-[#333] text-white'
  }

  const icon = {
    success: '◉',
    error: '×',
    info: '○'
  }

  return (
    <div
      className={`fixed bottom-5 right-5 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${typeStyles[type]}`}
    >
      <span className="text-lg">{icon[type]}</span>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="ml-2 text-lg hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  )
}

// Toast Container Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>>([])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed bottom-0 right-0 p-5 space-y-3 z-50">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )

  return {
    showToast,
    ToastContainer
  }
}
