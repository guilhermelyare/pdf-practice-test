import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Phone, MapPin, Clock, Users, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

interface LeadFormData {
  name: string;
  phone: string;
  city: string;
}

export const HeroSection = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    phone: "",
    city: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate lead capture automation
    setTimeout(() => {
      toast({
        title: "Lead Capturado com Sucesso!",
        description: "Nossa equipe comercial entrará em contato em até 5 minutos.",
        duration: 5000,
      });
      
      // Simulate lead processing
      console.log("Lead capturado:", formData);
      console.log("Automação ativada - Distribuindo lead para equipe comercial...");
      
      setFormData({ name: "", phone: "", city: "" });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Text */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-8 w-8 text-accent" />
                <span className="text-2xl font-bold">AEG Proteção</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Proteção Completa para seu
                <span className="text-accent block">Veículo</span>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
                Cobertura nacional contra roubo, furto, colisão e fenômenos naturais. 
                Assistência 24h, reboque, chaveiro e muito mais. Sua tranquilidade é nossa prioridade.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-blue-100">Cobertura Nacional</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-blue-100">Assistência 24h</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-blue-100">Sem Análise de Perfil</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-blue-100">Aprovação Imediata</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">+50k</div>
                <div className="text-blue-100 text-sm">Associados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">24h</div>
                <div className="text-blue-100 text-sm">Suporte</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-blue-100 text-sm">Digital</div>
              </div>
            </div>
          </div>

          {/* Right Column - Lead Form */}
          <div className="relative">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-elegant border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Receba uma Cotação Gratuita
                </h3>
                <p className="text-muted-foreground">
                  Nossa equipe entrará em contato em até 5 minutos
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Nome Completo</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="h-12 border-2 border-border/20 focus:border-primary transition-smooth"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Telefone</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="h-12 border-2 border-border/20 focus:border-primary transition-smooth"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Cidade</span>
                  </label>
                  <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                    <SelectTrigger className="h-12 border-2 border-border/20 focus:border-primary">
                      <SelectValue placeholder="Selecione sua cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sao-paulo">São Paulo - SP</SelectItem>
                      <SelectItem value="rio-de-janeiro">Rio de Janeiro - RJ</SelectItem>
                      <SelectItem value="belo-horizonte">Belo Horizonte - MG</SelectItem>
                      <SelectItem value="brasilia">Brasília - DF</SelectItem>
                      <SelectItem value="porto-alegre">Porto Alegre - RS</SelectItem>
                      <SelectItem value="salvador">Salvador - BA</SelectItem>
                      <SelectItem value="fortaleza">Fortaleza - CE</SelectItem>
                      <SelectItem value="curitiba">Curitiba - PR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-hero hover:shadow-glow transition-spring text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Receber Cotação Gratuita</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center mt-4 text-sm text-muted-foreground">
                <span className="flex items-center justify-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Seus dados estão seguros conosco</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};