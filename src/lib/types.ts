// Database Types
export interface UserProfile {
  id: string
  subscription_tier: 'free' | 'premium'
  dumps_this_month: number
  ai_requests_this_month: number
  last_reset_date: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status: string
  subscription_period_end?: string
  created_at: string
  updated_at: string
}

export interface BrainDump {
  id: string
  user_id: string
  content: string
  word_count: number
  created_at: string
  updated_at: string
  has_generated_ideas: boolean
}

export interface ThreadIdea {
  title: string
  hook: string
  arc: string
}

export interface LongformIdea {
  title: string
  theme: string
  structure: string
}

export interface GeneratedIdeas {
  id: string
  dump_id: string
  tweet_ideas: string[]
  thread_ideas: ThreadIdea[]
  longform_ideas: LongformIdea[]
  created_at: string
}

export interface Summary {
  id: string
  user_id: string
  period_type: 'daily' | 'weekly' | 'monthly'
  start_date: string
  end_date: string
  total_dumps: number
  total_words: number
  total_ideas: number
  themes: Record<string, number>
  content_pillars: string[]
  insights: string
  created_at: string
}

export interface Prompt {
  id: string
  prompt_text: string
  category: string
  is_active: boolean
  created_at: string
}

// Component Props Types
export interface DumpTextareaProps {
  value: string
  onChange: (value: string) => void
  voiceTranscript?: string
}

export interface VoiceRecorderProps {
  onTranscriptChange: (transcript: string) => void
}

export interface DumpCardProps {
  dump: BrainDump
  onClick?: () => void
}

export interface GeneratedIdeasProps {
  ideas: GeneratedIdeas | null
  loading: boolean
}

export interface TimerControlsProps {
  duration: number
  isActive: boolean
  onStart: () => void
  onStop: () => void
  onReset: () => void
}

// API Response Types
export interface GenerateIdeasResponse {
  success: boolean
  ideas?: GeneratedIdeas
  error?: string
}

export interface ApiError {
  message: string
  code?: string
}
