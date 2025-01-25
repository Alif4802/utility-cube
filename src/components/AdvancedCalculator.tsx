import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const AdvancedCalculator = () => {
  const [display, setDisplay] = useState("");
  const [expression, setExpression] = useState("");
  const { toast } = useToast();

  const scientificFunctions = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    log: Math.log10,
    ln: Math.log,
    sqrt: Math.sqrt,
    pow2: (x: number) => Math.pow(x, 2),
    pow3: (x: number) => Math.pow(x, 3),
  };

  const handleNumber = (num: string) => {
    setDisplay(display + num);
    setExpression(expression + num);
  };

  const handleOperator = (op: string) => {
    setDisplay(display + op);
    setExpression(expression + op);
  };

  const handleFunction = (func: string) => {
    try {
      const value = parseFloat(display);
      if (isNaN(value)) {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid number first",
          variant: "destructive",
        });
        return;
      }

      const result = scientificFunctions[func as keyof typeof scientificFunctions](value);
      setDisplay(result.toString());
      setExpression(`${func}(${value}) = ${result}`);
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "An error occurred during calculation",
        variant: "destructive",
      });
    }
  };

  const calculate = () => {
    try {
      // Replace scientific notation
      const sanitizedExpression = expression
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/sqrt/g, "Math.sqrt");

      const result = eval(sanitizedExpression);
      setDisplay(result.toString());
      setExpression(`${expression} = ${result}`);
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Invalid expression",
        variant: "destructive",
      });
    }
  };

  const clear = () => {
    setDisplay("");
    setExpression("");
  };

  return (
    <Card className="utility-card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Advanced Calculator</h2>
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <div className="text-sm text-muted-foreground mb-1 overflow-x-auto">
          {expression || "0"}
        </div>
        <Input
          value={display}
          onChange={(e) => setDisplay(e.target.value)}
          className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 p-0"
          placeholder="0"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {/* Scientific Functions */}
        <div className="col-span-4 grid grid-cols-4 gap-2 mb-4">
          {Object.keys(scientificFunctions).map((func) => (
            <Button
              key={func}
              variant="secondary"
              onClick={() => handleFunction(func)}
              className="h-10"
            >
              {func}
            </Button>
          ))}
        </div>

        {/* Numbers and Basic Operators */}
        {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map(
          (btn) => (
            <Button
              key={btn}
              variant={btn.match(/[0-9.]/) ? "outline" : btn === "=" ? "default" : "secondary"}
              className="h-12 text-lg"
              onClick={() => {
                if (btn === "=") calculate();
                else if (btn.match(/[+\-*/]/)) handleOperator(btn);
                else handleNumber(btn);
              }}
            >
              {btn}
            </Button>
          )
        )}

        {/* Additional Scientific Operators */}
        <Button
          variant="secondary"
          className="h-12 text-lg col-span-2"
          onClick={() => handleOperator("(")}
        >
          (
        </Button>
        <Button
          variant="secondary"
          className="h-12 text-lg col-span-2"
          onClick={() => handleOperator(")")}
        >
          )
        </Button>

        <Button
          variant="destructive"
          className="h-12 text-lg col-span-4"
          onClick={clear}
        >
          Clear
        </Button>
      </div>
    </Card>
  );
};