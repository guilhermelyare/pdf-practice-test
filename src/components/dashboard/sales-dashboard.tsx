import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  MapPin,
  MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  status: "novo" | "contatado" | "qualificado" | "convertido" | "perdido";
  assignedTo: string;
  createdAt: Date;
  lastContact?: Date;
  score: number;
}

export const SalesDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    inProgress: 0,
    converted: 0,
    conversionRate: 0,
  });

  // Simulate lead data
  useEffect(() => {
    const mockLeads: Lead[] = [
      {
        id: "1",
        name: "Maria Silva",
        phone: "(11) 99999-1111",
        city: "São Paulo",
        status: "novo",
        assignedTo: "Carlos Santos",
        createdAt: new Date(),
        score: 85,
      },
      {
        id: "2",
        name: "João Oliveira",
        phone: "(21) 99999-2222",
        city: "Rio de Janeiro",
        status: "contatado",
        assignedTo: "Ana Costa",
        createdAt: new Date(Date.now() - 3600000),
        lastContact: new Date(Date.now() - 1800000),
        score: 72,
      },
      {
        id: "3",
        name: "Pedro Santos",
        phone: "(31) 99999-3333",
        city: "Belo Horizonte",
        status: "qualificado",
        assignedTo: "Carlos Santos",
        createdAt: new Date(Date.now() - 7200000),
        lastContact: new Date(Date.now() - 3600000),
        score: 91,
      },
      {
        id: "4",
        name: "Ana Rodrigues",
        phone: "(11) 99999-4444",
        city: "São Paulo",
        status: "convertido",
        assignedTo: "Ana Costa",
        createdAt: new Date(Date.now() - 86400000),
        lastContact: new Date(Date.now() - 3600000),
        score: 88,
      },
    ];

    setLeads(mockLeads);

    // Calculate stats
    const totalLeads = mockLeads.length;
    const newLeads = mockLeads.filter(l => l.status === "novo").length;
    const inProgress = mockLeads.filter(l => ["contatado", "qualificado"].includes(l.status)).length;
    const converted = mockLeads.filter(l => l.status === "convertido").length;
    const conversionRate = totalLeads > 0 ? (converted / totalLeads) * 100 : 0;

    setStats({
      totalLeads,
      newLeads,
      inProgress,
      converted,
      conversionRate,
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo": return "bg-blue-500";
      case "contatado": return "bg-yellow-500";
      case "qualificado": return "bg-purple-500";
      case "convertido": return "bg-green-500";
      case "perdido": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "novo": return "Novo";
      case "contatado": return "Contatado";
      case "qualificado": return "Qualificado";
      case "convertido": return "Convertido";
      case "perdido": return "Perdido";
      default: return status;
    }
  };

  const handleContact = (leadId: string, method: "phone" | "whatsapp") => {
    console.log(`Contacting lead ${leadId} via ${method}`);
    // Simulate contact action
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: "contatado" as const, lastContact: new Date() }
        : lead
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Dashboard Comercial</h1>
          <p className="text-muted-foreground text-lg">
            Sistema de Automação de Leads - AEG Proteção
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Novos</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.newLeads}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando primeiro contato
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Em processo de qualificação
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.conversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Meta: 25%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Leads Ativos</CardTitle>
            <CardDescription>
              Gerencie e acompanhe todos os leads em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/70 transition-smooth"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="font-semibold text-primary">{lead.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{lead.phone}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{lead.city}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">Score</div>
                      <div className="text-2xl font-bold text-primary">{lead.score}</div>
                    </div>

                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(lead.status)} text-white`}
                    >
                      {getStatusLabel(lead.status)}
                    </Badge>

                    <div className="text-sm text-muted-foreground text-center">
                      <div>Responsável:</div>
                      <div className="font-medium">{lead.assignedTo}</div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContact(lead.id, "phone")}
                        className="hover:bg-primary hover:text-white transition-smooth"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContact(lead.id, "whatsapp")}
                        className="hover:bg-green-500 hover:text-white transition-smooth"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automation Status */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Status da Automação</CardTitle>
            <CardDescription>
              Monitoramento em tempo real dos processos automatizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Captura de Leads</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <Progress value={100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Sistema funcionando perfeitamente
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Distribuição Automática</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <Progress value={95} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  95% dos leads distribuídos automaticamente
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Follow-up Automatizado</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <Progress value={88} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  88% de taxa de entrega de mensagens
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};