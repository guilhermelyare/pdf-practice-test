import { AutomationFlow } from "@/components/automation/automation-flow";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Automation = () => {
  return (
    <div>
      <div className="fixed top-6 left-6 z-50">
        <Link to="/">
          <Button variant="outline" className="bg-white/90 backdrop-blur-sm shadow-lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
      <AutomationFlow />
    </div>
  );
};

export default Automation;