import { UnitConverter } from "@/components/UnitConverter";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { AdvancedCalculator } from "@/components/AdvancedCalculator";

const Index = () => {
  return (
    <div className="min-h-screen pt-20 px-4 bg-background space-y-8">
      <CurrencyConverter />
      <AdvancedCalculator />
      <UnitConverter />
    </div>
  );
};

export default Index;