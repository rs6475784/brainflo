import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUsageLimits } from '../../hooks/useUsageLimits'

export const LeftSidebar: React.FC = () => {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { profile, getDumpsRemaining, getAiRequestsRemaining } = useUsageLimits()

  const navItems = [
    { path: '/', label: 'Dump', icon: '◐' },
    { path: '/history', label: 'History', icon: '≡' },
    { path: '/summaries', label: 'Summaries', icon: '○' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="w-64 bg-white border-r border-[#e5e5e5] h-screen flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-[#e5e5e5]">
        <h1 className="text-2xl font-bold">BrainFlo</h1>
        <p className="text-sm text-[#737373] mt-1">{user?.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-black text-white'
                : 'text-black hover:bg-[#f0f0f0]'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Usage Stats (Free Tier) */}
      {profile && profile.subscription_tier === 'free' && (
        <div className="p-4 border-t border-[#e5e5e5] space-y-3">
          <div className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-[#737373]">Dumps</span>
              <span className="font-medium">{getDumpsRemaining()} left</span>
            </div>
            <div className="w-full bg-[#e5e5e5] rounded-full h-1.5">
              <div
                className="bg-black h-1.5 rounded-full transition-all"
                style={{
                  width: `${(profile.dumps_this_month / 5) * 100}%`
                }}
              />
            </div>
          </div>

          <div className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-[#737373]">AI Requests</span>
              <span className="font-medium">{getAiRequestsRemaining()} left</span>
            </div>
            <div className="w-full bg-[#e5e5e5] rounded-full h-1.5">
              <div
                className="bg-black h-1.5 rounded-full transition-all"
                style={{
                  width: `${(profile.ai_requests_this_month / 10) * 100}%`
                }}
              />
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-[#333] transition-colors">
            Upgrade to Premium
          </button>
        </div>
      )}

      {/* Sign Out */}
      <div className="p-4 border-t border-[#e5e5e5]">
        <button
          onClick={() => signOut()}
          className="w-full px-4 py-2 text-sm text-[#737373] hover:text-black hover:bg-[#f0f0f0] rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
