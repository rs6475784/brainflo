import React from 'react'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'

interface AppLayoutProps {
  children: React.ReactNode
  showRightSidebar?: boolean
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showRightSidebar = true
}) => {
  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      <LeftSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      {showRightSidebar && <RightSidebar />}
    </div>
  )
}
