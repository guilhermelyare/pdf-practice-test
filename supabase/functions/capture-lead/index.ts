import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { name, email, phone, interest } = await req.json()

    // Validação dos dados
    if (!name || !email || !phone) {
      return new Response(
        JSON.stringify({ error: 'Dados obrigatórios não informados' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Gerar ID único do lead
    const leadId = crypto.randomUUID()

    // Inserir lead no banco
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        id: leadId,
        name,
        email,
        phone,
        interest,
        status: 'novo',
        score: calculateInitialScore({ interest }),
        created_at: new Date().toISOString(),
        source: 'landing_page'
      })
      .select()
      .single()

    if (leadError) throw leadError

    // Disparar notificações imediatas
    await Promise.all([
      // Notificar equipe comercial
      supabase.functions.invoke('notify-team', {
        body: { leadId, lead }
      }),
      // Distribuir lead para vendedor
      supabase.functions.invoke('distribute-lead', {
        body: { leadId, lead }
      }),
      // Agendar follow-up automático
      supabase.functions.invoke('schedule-followup', {
        body: { leadId, lead, delay: 300 } // 5 minutos
      })
    ])

    return new Response(
      JSON.stringify({ 
        success: true, 
        leadId,
        message: 'Entraremos em contato em breve.' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function calculateInitialScore({ interest }: { interest?: string }) {
  let score = 50 // Score base
  
  const interestScores: Record<string, number> = {
    'seguro_vida': 80,
    'seguro_auto': 70,
    'previdencia': 85,
    'investimentos': 75,
    'outros': 40
  }
  
  if (interest && interestScores[interest]) {
    score = interestScores[interest]
  }
  
  return score
}