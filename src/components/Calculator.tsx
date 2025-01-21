import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");

  const handleNumber = (num: string) => {
    setDisplay(display === "0" ? num : display + num);
    setEquation(equation + num);
  };

  const handleOperator = (op: string) => {
    setDisplay("0");
    setEquation(equation + " " + op + " ");
  };

  const calculate = () => {
    try {
      const result = eval(equation);
      setDisplay(result.toString());
      setEquation(result.toString());
    } catch (error) {
      setDisplay("Error");
      setEquation("");
    }
  };

  const clear = () => {
    setDisplay("0");
    setEquation("");
  };

  return (
    <Card className="utility-card max-w-md mx-auto">
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <div className="text-sm text-muted-foreground mb-1">{equation || "0"}</div>
        <div className="text-3xl font-bold">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
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