import { UnitConverter } from "@/components/UnitConverter";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { AdvancedCalculator } from "@/components/AdvancedCalculator";

const Index = () => {
  return (
    <div className="min-h-screen pt-20 px-4 bg-background space-y-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gradient mb-8">MultiUtils Tools</h1>
        <div className="grid gap-8">
          <CurrencyConverter />
          <AdvancedCalculator />
          <UnitConverter />
        </div>
      </div>
    </div>
  );
};

export default Index;