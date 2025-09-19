import { HeroSection } from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Sistema Completo de Automação
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nossa solução integra todas as etapas do processo comercial, 
              desde a captação até a conversão dos leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">Captura Inteligente</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Formulários otimizados que capturam leads qualificados automaticamente
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">Follow-up Automático</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Contato em até 5 minutos via WhatsApp e e-mail personalizado
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">Distribuição Inteligente</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Leads distribuídos automaticamente por localização e performance
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/automation">
              <Button className="bg-gradient-hero hover:shadow-glow transition-spring text-lg px-8 py-3">
                <span>Ver Fluxo Completo</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Automatizar seu Processo Comercial?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Acesse o dashboard e veja como nossa automação pode transformar 
            sua gestão de leads e aumentar suas conversões.
          </p>
          <Link to="/dashboard">
            <Button 
              variant="secondary" 
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
            >
              <span>Acessar Dashboard</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
