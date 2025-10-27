import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">BrainFlo</h1>
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            {subtitle && <p className="text-sm text-[#737373]">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
