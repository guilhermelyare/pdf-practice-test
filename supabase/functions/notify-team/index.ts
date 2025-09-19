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

    // Buscar vendedores ativos
    const { data: salespeople } = await supabase
      .from('salespeople')
      .select('*')
      .eq('status', 'ativo')

    const notifications = []

    // Enviar WhatsApp para vendedores
    for (const salesperson of salespeople || []) {
      if (salesperson.whatsapp) {
        notifications.push(
          sendWhatsAppNotification(salesperson.whatsapp, {
            leadName: lead.name,
            leadPhone: lead.phone,
            leadInterest: lead.interest,
            leadScore: lead.score
          })
        )
      }
    }

    // Enviar email para gestores
    const { data: managers } = await supabase
      .from('managers')
      .select('email')
      .eq('receive_notifications', true)

    for (const manager of managers || []) {
      notifications.push(
        sendEmailNotification(manager.email, {
          subject: `🚨 Novo Lead: ${lead.name}`,
          leadData: lead
        })
      )
    }

    // Registrar notificação no sistema
    await supabase
      .from('notifications')
      .insert({
        lead_id: leadId,
        type: 'team_notification',
        status: 'sent',
        sent_at: new Date().toISOString(),
        recipients: salespeople?.length || 0
      })

    await Promise.all(notifications)

    return new Response(
      JSON.stringify({ success: true, notifications_sent: notifications.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function sendWhatsAppNotification(phone: string, data: any) {
  const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY')
  if (!whatsappApiKey) return

  const message = `🚨 *NOVO LEAD - AEG PROTEÇÃO*

👤 *Nome:* ${data.leadName}
📱 *Telefone:* ${data.leadPhone}
🎯 *Interesse:* ${data.leadInterest}
⭐ *Score:* ${data.leadScore}/100

🚀 Entre em contato imediatamente!`

  try {
    await fetch(`https://api.whatsapp.com/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: phone,
        message
      })
    })
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error)
  }
}

async function sendEmailNotification(email: string, data: any) {
  const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')
  if (!sendgridApiKey) return

  try {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }],
          subject: data.subject
        }],
        from: { email: 'noreply@aegprotecao.com.br', name: 'AEG Proteção' },
        content: [{
          type: 'text/html',
          value: `
            <h2>Novo Lead Capturado</h2>
            <p><strong>Nome:</strong> ${data.leadData.name}</p>
            <p><strong>Email:</strong> ${data.leadData.email}</p>
            <p><strong>Telefone:</strong> ${data.leadData.phone}</p>
            <p><strong>Interesse:</strong> ${data.leadData.interest}</p>
            <p><strong>Score:</strong> ${data.leadData.score}/100</p>
            <p><strong>Data:</strong> ${new Date(data.leadData.created_at).toLocaleString('pt-BR')}</p>
          `
        }]
      })
    })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
  }
}