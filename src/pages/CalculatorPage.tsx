import { AdvancedCalculator } from "@/components/AdvancedCalculator";

const CalculatorPage = () => {
  return (
    <div className="min-h-screen pt-32 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gradient-primary mb-8">Advanced Calculator</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Perform complex calculations with our powerful scientific calculator.
        </p>
        <AdvancedCalculator />
      </div>
    </div>
  );
};

export default CalculatorPage;