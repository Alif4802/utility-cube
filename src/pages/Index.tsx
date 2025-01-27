import { UnitConverter } from "@/components/UnitConverter";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calculator, Coins, Ruler } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [activeConverter, setActiveConverter] = useState<string>("currency");

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
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-center mb-8">
            <ToggleGroup 
              type="single" 
              value={activeConverter}
              onValueChange={(value) => {
                if (value) setActiveConverter(value);
              }}
              className="bg-muted p-1 rounded-lg"
            >
              <ToggleGroupItem value="currency" aria-label="Toggle currency converter">
                <Coins className="h-5 w-5 mr-2" />
                Currency
              </ToggleGroupItem>
              <ToggleGroupItem value="unit" aria-label="Toggle unit converter">
                <Ruler className="h-5 w-5 mr-2" />
                Units
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="animate-fade-in">
            {activeConverter === "currency" ? (
              <CurrencyConverter />
            ) : (
              <UnitConverter />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;