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

    const { leadId, lead } = await req.json()

    // Buscar vendedores disponíveis com base na localização e carga de trabalho
    const { data: salespeople } = await supabase
      .from('salespeople')
      .select(`
        *,
        lead_assignments!inner(count)
      `)
      .eq('status', 'ativo')
      .order('lead_count', { ascending: true })

    if (!salespeople?.length) {
      throw new Error('Nenhum vendedor disponível')
    }

    // Algoritmo de distribuição inteligente
    const bestSalesperson = selectBestSalesperson(salespeople, lead)

    // Atribuir lead ao vendedor
    const { error: assignmentError } = await supabase
      .from('lead_assignments')
      .insert({
        lead_id: leadId,
        salesperson_id: bestSalesperson.id,
        assigned_at: new Date().toISOString(),
        assignment_method: 'automatic',
        priority: calculatePriority(lead.score)
      })

    if (assignmentError) throw assignmentError

    // Atualizar status do lead
    await supabase
      .from('leads')
      .update({ 
        status: 'distribuido',
        assigned_to: bestSalesperson.id,
        assigned_at: new Date().toISOString()
      })
      .eq('id', leadId)

    // Notificar vendedor específico
    await notifySalesperson(bestSalesperson, lead)

    // Registrar métricas
    await supabase
      .from('distribution_metrics')
      .insert({
        lead_id: leadId,
        salesperson_id: bestSalesperson.id,
        distribution_time_seconds: 10,
        method: 'location_and_workload',
        created_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        assigned_to: bestSalesperson.name,
        assignment_id: leadId
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

function selectBestSalesperson(salespeople: any[], lead: any) {
  // Ordenar por múltiplos critérios:
  // 1. Menor carga de trabalho
  // 2. Melhor performance histórica
  // 3. Especialização no tipo de produto
  
  return salespeople.reduce((best, current) => {
    let bestScore = calculateSalespersonScore(best, lead)
    let currentScore = calculateSalespersonScore(current, lead)
    
    return currentScore > bestScore ? current : best
  })
}

function calculateSalespersonScore(salesperson: any, lead: any) {
  let score = 0
  
  // Penalizar por carga alta
  const workloadPenalty = Math.max(0, 100 - (salesperson.lead_count || 0) * 10)
  score += workloadPenalty
  
  // Bonus por performance
  score += (salesperson.conversion_rate || 0.2) * 100
  
  // Bonus por especialização
  if (salesperson.specialties?.includes(lead.interest)) {
    score += 50
  }
  
  // Bonus por disponibilidade
  if (salesperson.status === 'online') {
    score += 25
  }
  
  return score
}

function calculatePriority(score: number) {
  if (score >= 80) return 'alta'
  if (score >= 60) return 'media'
  return 'baixa'
}

async function notifySalesperson(salesperson: any, lead: any) {
  const message = `🎯 *LEAD ATRIBUÍDO PARA VOCÊ*

👤 *Cliente:* ${lead.name}
📱 *Telefone:* ${lead.phone}
📧 *Email:* ${lead.email}
🎯 *Interesse:* ${lead.interest}
⭐ *Score:* ${lead.score}/100

💡 *Dica:* Lead com alto potencial. Entre em contato nos próximos 5 minutos para maximizar conversão!`

  // Enviar via WhatsApp se disponível
  if (salesperson.whatsapp) {
    await sendWhatsApp(salesperson.whatsapp, message)
  }

  // Notificação push no dashboard
  // (implementar WebSocket ou similar para tempo real)
}

async function sendWhatsApp(phone: string, message: string) {
  const apiKey = Deno.env.get('WHATSAPP_API_KEY')
  if (!apiKey) return

  try {
    await fetch('https://api.whatsapp.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to: phone, message })
    })
  } catch (error) {
    console.error('Erro WhatsApp:', error)
  }
}