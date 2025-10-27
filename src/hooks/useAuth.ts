import { useState, useEffect } from 'react'
import { auth } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check current user on mount
    const checkUser = async () => {
      try {
        const { user, error } = await auth.getCurrentUser()
        if (error) throw error
        setUser(user)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error } = await auth.signUp(email, password)
      if (error) throw error
      return { data, error: null }
    } catch (err: any) {
      setError(err.message)
      return { data: null, error: err.message }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error } = await auth.signIn(email, password)
      if (error) throw error
      return { data, error: null }
    } catch (err: any) {
      setError(err.message)
      return { data: null, error: err.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      const { data, error } = await auth.signInWithGoogle()
      if (error) throw error
      return { data, error: null }
    } catch (err: any) {
      setError(err.message)
      return { data: null, error: err.message }
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await auth.signOut()
      if (error) throw error
      setUser(null)
      return { error: null }
    } catch (err: any) {
      setError(err.message)
      return { error: err.message }
    }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  }
}
