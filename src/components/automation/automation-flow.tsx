import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  UserPlus, 
  Bell, 
  Users, 
  MessageCircle, 
  BarChart3,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export const AutomationFlow = () => {
  const automationSteps = [
    {
      id: 1,
      title: "Captura de Lead",
      description: "Formulário na landing page captura dados do lead",
      icon: UserPlus,
      status: "active",
      time: "Instantâneo",
      details: [
        "Validação automática dos dados",
        "Integração com Google Sheets",
        "Geração de ID único do lead",
      ]
    },
    {
      id: 2,
      title: "Notificação da Equipe",
      description: "Equipe comercial é notificada imediatamente",
      icon: Bell,
      status: "active",
      time: "< 5 segundos",
      details: [
        "WhatsApp para vendedores",
        "E-mail com dados do lead",
        "Notificação no dashboard",
      ]
    },
    {
      id: 3,
      title: "Distribuição Inteligente",
      description: "Lead é distribuído baseado em critérios",
      icon: Users,
      status: "active",
      time: "10 segundos",
      details: [
        "Distribuição por localização",
        "Balanceamento de carga",
        "Histórico de performance",
      ]
    },
    {
      id: 4,
      title: "Follow-up Automático",
      description: "Mensagens automáticas são enviadas",
      icon: MessageCircle,
      status: "active",
      time: "5 minutos",
      details: [
        "WhatsApp personalizado",
        "E-mail de boas-vindas",
        "SMS de confirmação",
      ]
    },
    {
      id: 5,
      title: "Qualificação Automática",
      description: "Sistema avalia interesse e urgência",
      icon: BarChart3,
      status: "active",
      time: "Contínuo",
      details: [
        "Score baseado em dados",
        "Análise comportamental",
        "Priorização automática",
      ]
    },
    {
      id: 6,
      title: "Relatórios Automáticos",
      description: "Relatórios semanais são gerados",
      icon: BarChart3,
      status: "scheduled",
      time: "Semanal",
      details: [
        "Performance da equipe",
        "Taxa de conversão",
        "Análise de tendências",
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "scheduled":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "scheduled":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Zap className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-bold text-primary">Fluxo de Automação</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Visualize como nossa automação otimiza cada etapa do processo comercial,
            desde a captura até a conversão dos leads.
          </p>
        </div>

        {/* Automation Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-primary">Tempo Médio</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-accent">5min</div>
              <p className="text-sm text-muted-foreground">
                Do lead ao primeiro contato
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-primary">Automação</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-accent">95%</div>
              <p className="text-sm text-muted-foreground">
                Processos automatizados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-primary">Eficiência</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-accent">+300%</div>
              <p className="text-sm text-muted-foreground">
                Melhoria na produtividade
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Automation Flow */}
        <div className="space-y-6">
          {automationSteps.map((step, index) => (
            <div key={step.id} className="relative">
              <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-primary">
                            {step.id}. {step.title}
                          </h3>
                          {getStatusIcon(step.status)}
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {step.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {step.details.map((detail, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">
                                {detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <Badge 
                        variant="secondary"
                        className={`${getStatusColor(step.status)} text-white`}
                      >
                        {step.status === "active" ? "Ativo" : step.status === "scheduled" ? "Agendado" : "Erro"}
                      </Badge>
                      <div className="text-sm font-medium text-primary">
                        {step.time}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow between steps */}
              {index < automationSteps.length - 1 && (
                <div className="flex justify-center my-4">
                  <ArrowRight className="h-8 w-8 text-accent" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Integration Status */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Integrações Ativas</CardTitle>
            <CardDescription>
              Ferramentas conectadas ao sistema de automação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
                <div>
                  <div className="font-medium">Google Sheets</div>
                  <div className="text-sm text-muted-foreground">CRM Principal</div>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
                <div>
                  <div className="font-medium">WhatsApp API</div>
                  <div className="text-sm text-muted-foreground">Mensagens</div>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
                <div>
                  <div className="font-medium">SendGrid</div>
                  <div className="text-sm text-muted-foreground">E-mail</div>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
                <div>
                  <div className="font-medium">Google Analytics</div>
                  <div className="text-sm text-muted-foreground">Análises</div>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};