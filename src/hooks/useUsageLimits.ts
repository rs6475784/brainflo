import { useState, useEffect } from 'react'
import { db } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { UserProfile } from '../lib/types'

const FREE_LIMITS = {
  dumpsPerMonth: 5,
  aiRequestsPerMonth: 10,
}

export const useUsageLimits = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await db.getUserProfile(user.id)
      if (error) throw error

      // Check if month has changed, reset counters
      const today = new Date()
      const lastReset = new Date(data.last_reset_date)

      if (today.getMonth() !== lastReset.getMonth() ||
          today.getFullYear() !== lastReset.getFullYear()) {
        // Reset counters
        const { data: updatedData } = await db.updateUserProfile(user.id, {
          dumps_this_month: 0,
          ai_requests_this_month: 0,
          last_reset_date: today.toISOString().split('T')[0]
        })

        setProfile(updatedData)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const canCreateDump = () => {
    if (!profile) return false
    if (profile.subscription_tier === 'premium') return true
    return profile.dumps_this_month < FREE_LIMITS.dumpsPerMonth
  }

  const canGenerateIdeas = () => {
    if (!profile) return false
    if (profile.subscription_tier === 'premium') return true
    return profile.ai_requests_this_month < FREE_LIMITS.aiRequestsPerMonth
  }

  const getDumpsRemaining = () => {
    if (!profile || profile.subscription_tier === 'premium') return null
    return FREE_LIMITS.dumpsPerMonth - profile.dumps_this_month
  }

  const getAiRequestsRemaining = () => {
    if (!profile || profile.subscription_tier === 'premium') return null
    return FREE_LIMITS.aiRequestsPerMonth - profile.ai_requests_this_month
  }

  const incrementDumpCount = async () => {
    if (!profile || !user) return

    const { error } = await db.updateUserProfile(user.id, {
      dumps_this_month: profile.dumps_this_month + 1
    })

    if (!error) {
      setProfile({ ...profile, dumps_this_month: profile.dumps_this_month + 1 })
    }
  }

  const incrementAiRequestCount = async () => {
    if (!profile || !user) return

    const { error } = await db.updateUserProfile(user.id, {
      ai_requests_this_month: profile.ai_requests_this_month + 1
    })

    if (!error) {
      setProfile({ ...profile, ai_requests_this_month: profile.ai_requests_this_month + 1 })
    }
  }

  return {
    profile,
    loading,
    canCreateDump,
    canGenerateIdeas,
    getDumpsRemaining,
    getAiRequestsRemaining,
    incrementDumpCount,
    incrementAiRequestCount,
    refreshProfile: fetchProfile,
    isPremium: profile?.subscription_tier === 'premium'
  }
}
