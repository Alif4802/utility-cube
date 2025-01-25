import { AdvancedCalculator } from "@/components/AdvancedCalculator";

const CalculatorPage = () => {
  return (
    <div className="min-h-screen pt-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gradient mb-8">Advanced Calculator</h1>
        <AdvancedCalculator />
      </div>
    </div>
  );
};

export default CalculatorPage;