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

    const { leadId, lead, delay = 300 } = await req.json() // delay em segundos

    // Agendar follow-ups automáticos
    const followupSchedule = [
      { delay: delay, type: 'welcome_whatsapp', message: 'whatsapp_welcome' },
      { delay: delay + 60, type: 'welcome_email', message: 'email_welcome' },
      { delay: delay + 300, type: 'sms_confirmation', message: 'sms_confirm' },
      { delay: delay + 3600, type: 'qualification_call', message: 'schedule_call' }, // 1h depois
      { delay: delay + 86400, type: 'follow_email', message: 'email_followup' }, // 24h depois
    ]

    const scheduledTasks = []

    for (const followup of followupSchedule) {
      const executeAt = new Date(Date.now() + (followup.delay * 1000))

      // Inserir na tabela de tarefas agendadas
      const { data: task } = await supabase
        .from('scheduled_tasks')
        .insert({
          lead_id: leadId,
          task_type: followup.type,
          execute_at: executeAt.toISOString(),
          status: 'scheduled',
          message_template: followup.message,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      scheduledTasks.push(task)

      // Se o delay for muito pequeno (< 10 min), executar imediatamente
      if (followup.delay < 600) {
        setTimeout(() => {
          executeFollowupTask(supabase, task.id, leadId, lead, followup)
        }, followup.delay * 1000)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        scheduled_tasks: scheduledTasks.length,
        message: 'Follow-ups agendados com sucesso'
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

async function executeFollowupTask(supabase: any, taskId: string, leadId: string, lead: any, followup: any) {
  try {
    const messages = getMessageTemplates()
    const template = messages[followup.message]

    if (!template) return

    const personalizedMessage = personalizeMessage(template, lead)

    let success = false

    switch (followup.type) {
      case 'welcome_whatsapp':
        success = await sendWhatsApp(lead.phone, personalizedMessage)
        break
      case 'welcome_email':
        success = await sendEmail(lead.email, `Bem-vindo à AEG Proteção, ${lead.name}!`, personalizedMessage)
        break
      case 'sms_confirmation':
        success = await sendSMS(lead.phone, personalizedMessage)
        break
      case 'schedule_call':
        success = await scheduleCall(leadId, lead)
        break
      case 'follow_email':
        success = await sendEmail(lead.email, 'Sua proteção é nossa prioridade', personalizedMessage)
        break
    }

    // Atualizar status da tarefa
    await supabase
      .from('scheduled_tasks')
      .update({
        status: success ? 'completed' : 'failed',
        executed_at: new Date().toISOString(),
        error_message: success ? null : 'Falha na execução'
      })
      .eq('id', taskId)

    // Registrar interação
    await supabase
      .from('lead_interactions')
      .insert({
        lead_id: leadId,
        interaction_type: followup.type,
        status: success ? 'sent' : 'failed',
        message: personalizedMessage.substring(0, 500),
        created_at: new Date().toISOString()
      })

  } catch (error) {
    console.error('Erro ao executar follow-up:', error)
  }
}

function getMessageTemplates() {
  return {
    whatsapp_welcome: `Olá {{name}}! 👋

Obrigado por seu interesse em nossos produtos de proteção! 

Sou da AEG Proteção e em breve um de nossos especialistas entrará em contato para apresentar as melhores opções para você.

Enquanto isso, você pode conhecer mais sobre nossos serviços em nosso site.

Atenciosamente,
Equipe AEG Proteção 🛡️`,

    email_welcome: `Olá {{name}},

É um prazer tê-lo conosco!

Recebemos seu interesse em {{interest}} e nossa equipe especializada já está preparando uma proposta personalizada para suas necessidades.

Nos próximos minutos, você receberá uma ligação de um dos nossos consultores para esclarecer dúvidas e apresentar as melhores opções.

Atenciosamente,
Equipe AEG Proteção`,

    sms_confirm: `{{name}}, sua solicitação foi recebida! Em breve nossa equipe entrará em contato. AEG Proteção - Sua segurança em primeiro lugar.`,

    email_followup: `{{name}}, ainda estamos aqui para ajudá-lo com {{interest}}. Nossa equipe está disponível para esclarecer qualquer dúvida. Entre em contato conosco!`
  }
}

function personalizeMessage(template: string, lead: any): string {
  return template
    .replace(/{{name}}/g, lead.name)
    .replace(/{{interest}}/g, lead.interest || 'nossos produtos')
    .replace(/{{phone}}/g, lead.phone)
    .replace(/{{email}}/g, lead.email)
}

async function sendWhatsApp(phone: string, message: string): Promise<boolean> {
  const apiKey = Deno.env.get('WHATSAPP_API_KEY')
  if (!apiKey) return false

  try {
    const response = await fetch('https://api.whatsapp.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to: phone, message })
    })
    return response.ok
  } catch (error) {
    console.error('Erro WhatsApp:', error)
    return false
  }
}

async function sendEmail(email: string, subject: string, message: string): Promise<boolean> {
  const apiKey = Deno.env.get('SENDGRID_API_KEY')
  if (!apiKey) return false

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }], subject }],
        from: { email: 'noreply@aegprotecao.com.br', name: 'AEG Proteção' },
        content: [{ type: 'text/plain', value: message }]
      })
    })
    return response.ok
  } catch (error) {
    console.error('Erro email:', error)
    return false
  }
}

async function sendSMS(phone: string, message: string): Promise<boolean> {
  // Integração com provedor de SMS (Twilio, etc.)
  const apiKey = Deno.env.get('SMS_API_KEY')
  if (!apiKey) return false

  try {
    // Implementar conforme provedor escolhido
    return true
  } catch (error) {
    console.error('Erro SMS:', error)
    return false
  }
}

async function scheduleCall(leadId: string, lead: any): Promise<boolean> {
  // Lógica para agendar ligação automática ou notificar vendedor
  return true
}