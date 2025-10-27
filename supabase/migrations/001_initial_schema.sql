-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  dumps_this_month INTEGER DEFAULT 0,
  ai_requests_this_month INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Brain Dumps Table
CREATE TABLE brain_dumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  has_generated_ideas BOOLEAN DEFAULT false
);

CREATE INDEX idx_brain_dumps_user_id ON brain_dumps(user_id);
CREATE INDEX idx_brain_dumps_created_at ON brain_dumps(created_at DESC);

-- Generated Ideas Table
CREATE TABLE generated_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dump_id UUID REFERENCES brain_dumps(id) ON DELETE CASCADE NOT NULL,
  tweet_ideas JSONB,
  thread_ideas JSONB,
  longform_ideas JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_generated_ideas_dump_id ON generated_ideas(dump_id);

-- Summaries Table
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_dumps INTEGER,
  total_words INTEGER,
  total_ideas INTEGER,
  themes JSONB,
  content_pillars JSONB,
  insights TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_summaries_user_period ON summaries(user_id, period_type, start_date DESC);

-- Prompts Table
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_text TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- User can view own profile
CREATE POLICY "Users view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- User can manage own dumps
CREATE POLICY "Users view own dumps" ON brain_dumps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own dumps" ON brain_dumps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own dumps" ON brain_dumps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own dumps" ON brain_dumps
  FOR DELETE USING (auth.uid() = user_id);

-- User can view own ideas
CREATE POLICY "Users view own ideas" ON generated_ideas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM brain_dumps
      WHERE brain_dumps.id = generated_ideas.dump_id
      AND brain_dumps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users insert own ideas" ON generated_ideas
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM brain_dumps
      WHERE brain_dumps.id = generated_ideas.dump_id
      AND brain_dumps.user_id = auth.uid()
    )
  );

-- User can manage own summaries
CREATE POLICY "Users view own summaries" ON summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own summaries" ON summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Prompts are public read-only
CREATE POLICY "Anyone can read active prompts" ON prompts
  FOR SELECT USING (is_active = true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brain_dumps_updated_at BEFORE UPDATE ON brain_dumps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed data for prompts
INSERT INTO prompts (prompt_text, category) VALUES
  ('What pattern do you notice in your recent work?', 'reflective'),
  ('If you could only teach one concept, what would it be?', 'creative'),
  ('What''s the biggest problem your audience faces?', 'practical'),
  ('What''s something you believe that most people disagree with?', 'personal'),
  ('Describe a turning point in your recent thinking', 'reflective'),
  ('What would you do differently if you could start over?', 'reflective'),
  ('What advice would you give your past self?', 'personal'),
  ('What''s a trend you see that others are missing?', 'creative'),
  ('What question are you trying to answer right now?', 'reflective'),
  ('What''s working in your process? What''s not?', 'practical'),
  ('What makes a great creator vs a mediocre one?', 'creative'),
  ('What''s the most common misconception in your field?', 'practical'),
  ('If you could change one thing about how people learn your topic, what would it be?', 'creative'),
  ('What content idea have you been avoiding?', 'personal'),
  ('What would your ideal content creation workflow look like?', 'practical'),
  ('What''s the last thing that made you change your mind?', 'reflective'),
  ('What do you know now that you wish you knew 5 years ago?', 'personal'),
  ('What''s the gap between where you are and where you want to be?', 'reflective'),
  ('What lesson took you the longest to learn?', 'personal'),
  ('What do your best days have in common?', 'reflective');
