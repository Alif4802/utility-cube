import { UnitConverter } from "@/components/UnitConverter";
import { CurrencyConverter } from "@/components/CurrencyConverter";

const Index = () => {
  return (
    <div className="min-h-screen pt-20 px-4 bg-background space-y-8">
      <CurrencyConverter />
      <UnitConverter />
    </div>
  );
};

export default Index;