import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text
}) => {
  const sizeStyles = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`animate-spin ${sizeStyles[size]}`}>◐</div>
      {text && <p className="text-sm text-[#737373]">{text}</p>}
    </div>
  )
}
