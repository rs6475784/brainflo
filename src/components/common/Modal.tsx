import React, { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-lg w-full ${maxWidthStyles[maxWidth]} max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-[#737373] hover:text-black transition-colors p-1"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div className={title ? 'p-5' : 'p-6'}>
          {children}
        </div>
      </div>
    </div>
  )
}
