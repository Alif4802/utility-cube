import { UnitConverter } from "@/components/UnitConverter";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { AdvancedCalculator } from "@/components/AdvancedCalculator";
import { ArrowRight, Calculator, Coins, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">
            Welcome to <span className="text-gradient-primary">MultiUtils</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your comprehensive toolkit for calculations, conversions, and text editing. Simplify your daily tasks with our powerful utilities.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button onClick={() => navigate("/calculator")} size="lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Tools</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="utility-card">
              <Calculator className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced Calculator</h3>
              <p className="text-muted-foreground mb-4">
                Perform complex calculations with our scientific calculator featuring advanced mathematical functions.
              </p>
            </div>
            <div className="utility-card">
              <Coins className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Currency Converter</h3>
              <p className="text-muted-foreground mb-4">
                Convert between different currencies with real-time exchange rates.
              </p>
            </div>
            <div className="utility-card">
              <Ruler className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Unit Converter</h3>
              <p className="text-muted-foreground mb-4">
                Convert between different units of measurement with ease and precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl font-bold text-center mb-8">Try Our Tools</h2>
          <div className="grid gap-8">
            <CurrencyConverter />
            <AdvancedCalculator />
            <UnitConverter />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;