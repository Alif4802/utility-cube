import { UnitConverter } from "@/components/UnitConverter";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [activeConverter, setActiveConverter] = useState<"currency" | "unit">("currency");

  const converterLabels = {
    currency: "Currency Converter",
    unit: "Unit Converter"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">
            Welcome to <span className="text-gradient-primary">MultiUtils</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your comprehensive toolkit for calculations, conversions, and text editing. 
            Simplify your daily tasks with our powerful utilities.
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-center mb-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                  {converterLabels[activeConverter]}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuItem onClick={() => setActiveConverter("currency")}>
                  Currency Converter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveConverter("unit")}>
                  Unit Converter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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