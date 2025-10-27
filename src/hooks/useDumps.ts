import { useState, useEffect } from 'react'
import { db } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { BrainDump } from '../lib/types'

export const useDumps = () => {
  const { user } = useAuth()
  const [dumps, setDumps] = useState<BrainDump[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchDumps()
    }
  }, [user])

  const fetchDumps = async (limit = 20, offset = 0) => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await db.getDumps(user.id, limit, offset)
      if (error) throw error
      setDumps(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createDump = async (content: string) => {
    if (!user) return { data: null, error: 'Not authenticated' }

    try {
      const wordCount = content.trim().split(/\s+/).length
      const { data, error } = await db.createDump(user.id, content, wordCount)
      if (error) throw error

      // Add to local state
      if (data) {
        setDumps(prev => [data, ...prev])
      }

      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateDump = async (dumpId: string, updates: Partial<BrainDump>) => {
    try {
      const { data, error } = await db.updateDump(dumpId, updates)
      if (error) throw error

      // Update local state
      setDumps(prev => prev.map(d => d.id === dumpId ? { ...d, ...updates } : d))

      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deleteDump = async (dumpId: string) => {
    try {
      const { error } = await db.deleteDump(dumpId)
      if (error) throw error

      // Remove from local state
      setDumps(prev => prev.filter(d => d.id !== dumpId))

      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  const searchDumps = async (searchTerm: string) => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await db.searchDumps(user.id, searchTerm)
      if (error) throw error
      setDumps(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    dumps,
    loading,
    error,
    fetchDumps,
    createDump,
    updateDump,
    deleteDump,
    searchDumps,
    refreshDumps: fetchDumps
  }
}
