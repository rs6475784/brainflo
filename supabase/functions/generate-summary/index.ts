import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, periodType } = await req.json()

    if (!userId || !periodType) {
      throw new Error('Missing required fields: userId and periodType')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Calculate date range based on period type
    const endDate = new Date()
    const startDate = new Date()

    switch (periodType) {
      case 'daily':
        startDate.setDate(startDate.getDate() - 1)
        break
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 1)
        break
    }

    // Fetch dumps for the period
    const { data: dumps, error: dumpsError } = await supabase
      .from('brain_dumps')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (dumpsError) throw dumpsError

    if (!dumps || dumps.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No dumps found for this period' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate basic stats
    const totalDumps = dumps.length
    const totalWords = dumps.reduce((sum, dump) => sum + dump.word_count, 0)

    // Extract themes (simple keyword frequency analysis)
    const wordFrequency: Record<string, number> = {}
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'])

    dumps.forEach(dump => {
      const words = dump.content.toLowerCase().split(/\W+/)
      words.forEach(word => {
        if (word.length > 3 && !stopWords.has(word)) {
          wordFrequency[word] = (wordFrequency[word] || 0) + 1
        }
      })
    })

    // Get top themes
    const themes = Object.entries(wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [key, value]) => {
        obj[key] = value
        return obj
      }, {} as Record<string, number>)

    // Get content pillars (top 5 themes)
    const contentPillars = Object.keys(themes).slice(0, 5)

    // Count ideas generated
    const dumpIds = dumps.map(d => d.id)
    const { data: ideas, error: ideasError } = await supabase
      .from('generated_ideas')
      .select('*')
      .in('dump_id', dumpIds)

    const totalIdeas = ideas?.length || 0

    // Generate insights
    const avgWordsPerDump = Math.round(totalWords / totalDumps)
    const insights = `During this ${periodType} period, you created ${totalDumps} brain dump${totalDumps !== 1 ? 's' : ''} with an average of ${avgWordsPerDump} words each. Your most frequent themes were: ${contentPillars.slice(0, 3).join(', ')}.${totalIdeas > 0 ? ` You generated ${totalIdeas} sets of content ideas.` : ''}`

    // Save summary to database
    const { data: summary, error: summaryError } = await supabase
      .from('summaries')
      .insert({
        user_id: userId,
        period_type: periodType,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        total_dumps: totalDumps,
        total_words: totalWords,
        total_ideas: totalIdeas,
        themes,
        content_pillars: contentPillars,
        insights
      })
      .select()
      .single()

    if (summaryError) throw summaryError

    return new Response(
      JSON.stringify({ success: true, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating summary:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
