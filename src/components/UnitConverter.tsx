import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const lengthUnits = [
  { value: "m", label: "Meters" },
  { value: "km", label: "Kilometers" },
  { value: "cm", label: "Centimeters" },
  { value: "mm", label: "Millimeters" },
  { value: "in", label: "Inches" },
  { value: "ft", label: "Feet" },
  { value: "yd", label: "Yards" },
  { value: "mi", label: "Miles" }
];

const weightUnits = [
  { value: "kg", label: "Kilograms" },
  { value: "g", label: "Grams" },
  { value: "mg", label: "Milligrams" },
  { value: "lb", label: "Pounds" },
  { value: "oz", label: "Ounces" }
];

const temperatureUnits = [
  { value: "c", label: "Celsius" },
  { value: "f", label: "Fahrenheit" },
  { value: "k", label: "Kelvin" }
];

const conversionFactors = {
  length: {
    m: 1,
    km: 0.001,
    cm: 100,
    mm: 1000,
    in: 39.3701,
    ft: 3.28084,
    yd: 1.09361,
    mi: 0.000621371
  },
  weight: {
    kg: 1,
    g: 1000,
    mg: 1000000,
    lb: 2.20462,
    oz: 35.274
  }
};

export const UnitConverter = () => {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [activeTab, setActiveTab] = useState("length");

  const convert = (value: string, from: string, to: string, type: string) => {
    const val = parseFloat(value);
    if (isNaN(val)) return "";

    if (type === "temperature") {
      return convertTemperature(val, from, to);
    }

    const factors = conversionFactors[type as keyof typeof conversionFactors];
    if (!factors) return "";

    // Convert to base unit first (meters for length, kg for weight)
    const baseValue = type === "length" ? 
      val / factors[from as keyof typeof factors] :
      val / factors[from as keyof typeof factors];

    // Convert from base unit to target unit
    const result = type === "length" ? 
      baseValue * factors[to as keyof typeof factors] :
      baseValue * factors[to as keyof typeof factors];

    return result.toFixed(6);
  };

  const convertTemperature = (value: number, from: string, to: string) => {
    let celsius = value;
    
    // Convert input to Celsius first
    if (from === "f") {
      celsius = (value - 32) * (5/9);
    } else if (from === "k") {
      celsius = value - 273.15;
    }

    // Convert Celsius to target unit
    if (to === "c") return celsius.toFixed(2);
    if (to === "f") return ((celsius * 9/5) + 32).toFixed(2);
    if (to === "k") return (celsius + 273.15).toFixed(2);
    
    return "";
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset units based on selected tab
    switch (value) {
      case "length":
        setFromUnit("m");
        setToUnit("km");
        break;
      case "weight":
        setFromUnit("kg");
        setToUnit("g");
        break;
      case "temperature":
        setFromUnit("c");
        setToUnit("f");
        break;
    }
    setValue("");
  };

  const ConverterForm = ({ units, type }: { units: typeof lengthUnits, type: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <label htmlFor={`unit-from-${type}`} className="block text-sm font-medium text-muted-foreground">From</label>
        <Input
          id={`unit-from-${type}`}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="input-field"
          placeholder="Enter value"
          aria-invalid={value !== '' && isNaN(Number(value))}
        />
        {value !== '' && isNaN(Number(value)) && (
          <p className="text-xs text-destructive mt-1">Please enter a valid number.</p>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {units.find(u => u.value === fromUnit)?.label || units[0].label}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {units.map((unit) => (
              <DropdownMenuItem
                key={unit.value}
                onClick={() => setFromUnit(unit.value)}
              >
                {unit.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-4">
        <label htmlFor={`unit-to-${type}`} className="block text-sm font-medium text-muted-foreground">To</label>
        <Input
          id={`unit-to-${type}`}
          type="text"
          value={convert(value, fromUnit, toUnit, type)}
          readOnly
          className="input-field"
          placeholder="Result"
          aria-readonly
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {units.find(u => u.value === toUnit)?.label || units[0].label}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {units.map((unit) => (
              <DropdownMenuItem
                key={unit.value}
                onClick={() => setToUnit(unit.value)}
              >
                {unit.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <Card className="utility-card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Unit Converter</h2>
      <Tabs defaultValue="length" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="length">Length</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
        </TabsList>
        <TabsContent value="length">
          <ConverterForm units={lengthUnits} type="length" />
        </TabsContent>
        <TabsContent value="weight">
          <ConverterForm units={weightUnits} type="weight" />
        </TabsContent>
        <TabsContent value="temperature">
          <ConverterForm units={temperatureUnits} type="temperature" />
        </TabsContent>
      </Tabs>
    </Card>
  );
};