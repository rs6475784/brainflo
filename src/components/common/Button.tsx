import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-black text-white hover:bg-[#333]',
    secondary: 'bg-white text-black border border-[#d4d4d4] hover:bg-[#fafafa]',
    ghost: 'bg-transparent text-black hover:bg-[#f0f0f0]'
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-5 py-2.5 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg'
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="mr-2 animate-spin">◐</span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
