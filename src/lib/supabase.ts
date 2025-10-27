import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // User Profiles
  getUserProfile: async (userId: string) => {
    return await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },

  updateUserProfile: async (userId: string, updates: Partial<any>) => {
    return await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
  },

  // Brain Dumps
  createDump: async (userId: string, content: string, wordCount: number) => {
    return await supabase
      .from('brain_dumps')
      .insert({
        user_id: userId,
        content,
        word_count: wordCount,
      })
      .select()
      .single()
  },

  getDumps: async (userId: string, limit = 20, offset = 0) => {
    return await supabase
      .from('brain_dumps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
  },

  getDump: async (dumpId: string) => {
    return await supabase
      .from('brain_dumps')
      .select('*')
      .eq('id', dumpId)
      .single()
  },

  updateDump: async (dumpId: string, updates: Partial<any>) => {
    return await supabase
      .from('brain_dumps')
      .update(updates)
      .eq('id', dumpId)
  },

  deleteDump: async (dumpId: string) => {
    return await supabase
      .from('brain_dumps')
      .delete()
      .eq('id', dumpId)
  },

  searchDumps: async (userId: string, searchTerm: string) => {
    return await supabase
      .from('brain_dumps')
      .select('*')
      .eq('user_id', userId)
      .ilike('content', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
  },

  // Generated Ideas
  getIdeasForDump: async (dumpId: string) => {
    return await supabase
      .from('generated_ideas')
      .select('*')
      .eq('dump_id', dumpId)
      .single()
  },

  // Summaries
  getSummaries: async (userId: string, periodType?: 'daily' | 'weekly' | 'monthly') => {
    let query = supabase
      .from('summaries')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })

    if (periodType) {
      query = query.eq('period_type', periodType)
    }

    return await query
  },

  createSummary: async (summaryData: any) => {
    return await supabase
      .from('summaries')
      .insert(summaryData)
      .select()
      .single()
  },

  // Prompts
  getRandomPrompt: async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_active', true)

    if (error) return { data: null, error }
    if (!data || data.length === 0) return { data: null, error: null }

    const randomIndex = Math.floor(Math.random() * data.length)
    return { data: data[randomIndex], error: null }
  },
}

// Edge Functions
export const functions = {
  generateIdeas: async (dumpContent: string, dumpId: string) => {
    const { data, error } = await supabase.functions.invoke('generate-ideas', {
      body: { dumpContent, dumpId }
    })
    return { data, error }
  },

  generateSummary: async (userId: string, periodType: 'daily' | 'weekly' | 'monthly') => {
    const { data, error } = await supabase.functions.invoke('generate-summary', {
      body: { userId, periodType }
    })
    return { data, error }
  }
}
