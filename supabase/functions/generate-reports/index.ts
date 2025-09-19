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

    const { reportType = 'weekly', startDate, endDate } = await req.json()

    const now = new Date()
    const defaultStartDate = startDate || new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const defaultEndDate = endDate || now.toISOString()

    // Buscar dados para relatório
    const [
      leadsData,
      conversionsData,
      performanceData,
      automationMetrics
    ] = await Promise.all([
      getLeadsMetrics(supabase, defaultStartDate, defaultEndDate),
      getConversionMetrics(supabase, defaultStartDate, defaultEndDate),
      getPerformanceMetrics(supabase, defaultStartDate, defaultEndDate),
      getAutomationMetrics(supabase, defaultStartDate, defaultEndDate)
    ])

    const report = {
      period: { start: defaultStartDate, end: defaultEndDate },
      summary: {
        total_leads: leadsData.totalLeads,
        conversion_rate: conversionsData.conversionRate,
        automation_efficiency: automationMetrics.efficiency,
        average_response_time: performanceData.avgResponseTime
      },
      leads: leadsData,
      conversions: conversionsData,
      performance: performanceData,
      automation: automationMetrics,
      generated_at: now.toISOString()
    }

    // Salvar relatório no banco
    await supabase
      .from('reports')
      .insert({
        type: reportType,
        period_start: defaultStartDate,
        period_end: defaultEndDate,
        data: report,
        created_at: now.toISOString()
      })

    // Enviar por email se configurado
    if (reportType === 'weekly') {
      await sendReportByEmail(report)
    }

    return new Response(
      JSON.stringify({ success: true, report }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getLeadsMetrics(supabase: any, startDate: string, endDate: string) {
  const { data: leads, count } = await supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  const bySource = leads?.reduce((acc: any, lead: any) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1
    return acc
  }, {}) || {}

  const byStatus = leads?.reduce((acc: any, lead: any) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, {}) || {}

  return {
    totalLeads: count || 0,
    bySource,
    byStatus,
    avgScore: leads?.reduce((sum: number, lead: any) => sum + (lead.score || 0), 0) / (count || 1) || 0
  }
}

async function getConversionMetrics(supabase: any, startDate: string, endDate: string) {
  const { data: leads, count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  const { count: convertedLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .eq('status', 'convertido')

  const conversionRate = totalLeads ? (convertedLeads || 0) / totalLeads * 100 : 0

  return {
    totalLeads: totalLeads || 0,
    convertedLeads: convertedLeads || 0,
    conversionRate,
    conversionsBySource: {}, // Implementar detalhamento por fonte
  }
}

async function getPerformanceMetrics(supabase: any, startDate: string, endDate: string) {
  // Métricas de performance da equipe
  const { data: assignments } = await supabase
    .from('lead_assignments')
    .select(`
      *,
      leads(*),
      salespeople(*)
    `)
    .gte('assigned_at', startDate)
    .lte('assigned_at', endDate)

  const { data: interactions } = await supabase
    .from('lead_interactions')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  // Calcular tempo médio de resposta
  const responseTimes = assignments?.map((assignment: any) => {
    const firstInteraction = interactions?.find((int: any) => 
      int.lead_id === assignment.lead_id && int.created_at > assignment.assigned_at
    )
    
    if (firstInteraction) {
      const assignedTime = new Date(assignment.assigned_at).getTime()
      const responseTime = new Date(firstInteraction.created_at).getTime()
      return (responseTime - assignedTime) / 1000 / 60 // em minutos
    }
    return null
  }).filter(Boolean) || []

  const avgResponseTime = responseTimes.length ? 
    responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0

  return {
    avgResponseTime: Math.round(avgResponseTime * 100) / 100,
    totalInteractions: interactions?.length || 0,
    responseTimeDistribution: calculateDistribution(responseTimes)
  }
}

async function getAutomationMetrics(supabase: any, startDate: string, endDate: string) {
  const { data: tasks, count: totalTasks } = await supabase
    .from('scheduled_tasks')
    .select('*', { count: 'exact' })
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  const { count: successfulTasks } = await supabase
    .from('scheduled_tasks')
    .select('*', { count: 'exact' })
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .eq('status', 'completed')

  const efficiency = totalTasks ? (successfulTasks || 0) / totalTasks * 100 : 0

  return {
    totalTasks: totalTasks || 0,
    successfulTasks: successfulTasks || 0,
    efficiency: Math.round(efficiency * 100) / 100,
    tasksByType: tasks?.reduce((acc: any, task: any) => {
      acc[task.task_type] = (acc[task.task_type] || 0) + 1
      return acc
    }, {}) || {}
  }
}

function calculateDistribution(times: number[]) {
  if (!times.length) return {}
  
  const ranges = [
    { label: '0-5min', min: 0, max: 5 },
    { label: '5-15min', min: 5, max: 15 },
    { label: '15-60min', min: 15, max: 60 },
    { label: '60min+', min: 60, max: Infinity }
  ]

  const distribution: any = {}
  ranges.forEach(range => {
    distribution[range.label] = times.filter(time => 
      time >= range.min && time < range.max
    ).length
  })

  return distribution
}

async function sendReportByEmail(report: any) {
  const sendgridKey = Deno.env.get('SENDGRID_API_KEY')
  if (!sendgridKey) return

  const htmlReport = generateHTMLReport(report)

  try {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'gestao@aegprotecao.com.br' }],
          subject: `📊 Relatório Semanal - AEG Proteção`
        }],
        from: { email: 'reports@aegprotecao.com.br', name: 'AEG Relatórios' },
        content: [{
          type: 'text/html',
          value: htmlReport
        }]
      })
    })
  } catch (error) {
    console.error('Erro ao enviar relatório:', error)
  }
}

function generateHTMLReport(report: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h1 style="color: #2563eb;">📊 Relatório de Performance - AEG Proteção</h1>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>📈 Resumo Executivo</h2>
        <ul>
          <li><strong>Total de Leads:</strong> ${report.summary.total_leads}</li>
          <li><strong>Taxa de Conversão:</strong> ${report.summary.conversion_rate.toFixed(2)}%</li>
          <li><strong>Eficiência da Automação:</strong> ${report.summary.automation_efficiency.toFixed(2)}%</li>
          <li><strong>Tempo Médio de Resposta:</strong> ${report.summary.average_response_time.toFixed(2)} min</li>
        </ul>
      </div>

      <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>🎯 Métricas de Leads</h2>
        <p><strong>Score Médio:</strong> ${report.leads.avgScore.toFixed(1)}/100</p>
        <p><strong>Principais Fontes:</strong></p>
        <ul>
          ${Object.entries(report.leads.bySource).map(([source, count]) => 
            `<li>${source}: ${count} leads</li>`
          ).join('')}
        </ul>
      </div>

      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>⚡ Performance da Automação</h2>
        <p><strong>Tarefas Executadas:</strong> ${report.automation.totalTasks}</p>
        <p><strong>Taxa de Sucesso:</strong> ${report.automation.efficiency.toFixed(2)}%</p>
      </div>

      <small style="color: #6b7280;">
        Relatório gerado automaticamente em ${new Date(report.generated_at).toLocaleString('pt-BR')}
      </small>
    </div>
  `
}