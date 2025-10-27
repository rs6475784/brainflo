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
    const { dumpContent, dumpId } = await req.json()

    if (!dumpContent || !dumpId) {
      throw new Error('Missing required fields: dumpContent and dumpId')
    }

    // Call OpenAI GPT-4
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a content strategist for X/Twitter creators. Analyze brain dumps and generate content ideas.

Return ONLY valid JSON in this exact format:
{
  "tweet_ideas": ["idea 1", "idea 2", "idea 3"],
  "thread_ideas": [
    {
      "title": "Thread title",
      "hook": "Opening hook",
      "arc": "Narrative structure"
    }
  ],
  "longform_ideas": [
    {
      "title": "Post title",
      "theme": "Core theme",
      "structure": "Suggested outline"
    }
  ]
}

Generate:
- 3-5 tweet ideas (hooks/angles only, not full tweets)
- 2-3 thread ideas (narrative arcs with structure)
- 1-2 long-form post ideas (themes with suggested structure)

Keep ideas concise and actionable. These are springboards, not finished content.`
          },
          {
            role: 'user',
            content: `Brain dump: "${dumpContent}"\n\nGenerate content ideas.`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    const openAIData = await openAIResponse.json()

    if (!openAIResponse.ok) {
      throw new Error(openAIData.error?.message || 'OpenAI API error')
    }

    const ideas = JSON.parse(openAIData.choices[0].message.content)

    // Save to database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: insertError } = await supabase
      .from('generated_ideas')
      .insert({
        dump_id: dumpId,
        tweet_ideas: ideas.tweet_ideas,
        thread_ideas: ideas.thread_ideas,
        longform_ideas: ideas.longform_ideas
      })

    if (insertError) throw insertError

    // Update dump to mark it has ideas
    const { error: updateError } = await supabase
      .from('brain_dumps')
      .update({ has_generated_ideas: true })
      .eq('id', dumpId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, ideas }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating ideas:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
