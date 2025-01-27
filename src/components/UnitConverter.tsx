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

export const UnitConverter = () => {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");

  const convert = (value: string, from: string, to: string, type: string) => {
    const val = parseFloat(value);
    if (isNaN(val)) return "";

    let result = 0;
    
    if (type === "length") {
      // Convert to meters first
      let meters = val;
      switch (from) {
        case "km": meters = val * 1000; break;
        case "cm": meters = val / 100; break;
        case "mm": meters = val / 1000; break;
        case "in": meters = val * 0.0254; break;
        case "ft": meters = val * 0.3048; break;
        case "yd": meters = val * 0.9144; break;
        case "mi": meters = val * 1609.34; break;
      }
      
      // Convert from meters to target unit
      switch (to) {
        case "km": result = meters / 1000; break;
        case "cm": result = meters * 100; break;
        case "mm": result = meters * 1000; break;
        case "in": result = meters / 0.0254; break;
        case "ft": result = meters / 0.3048; break;
        case "yd": result = meters / 0.9144; break;
        case "mi": result = meters / 1609.34; break;
        default: result = meters;
      }
    } else if (type === "weight") {
      // Convert to grams first
      let grams = val;
      switch (from) {
        case "kg": grams = val * 1000; break;
        case "mg": grams = val / 1000; break;
        case "lb": grams = val * 453.592; break;
        case "oz": grams = val * 28.3495; break;
      }
      
      // Convert from grams to target unit
      switch (to) {
        case "kg": result = grams / 1000; break;
        case "mg": result = grams * 1000; break;
        case "lb": result = grams / 453.592; break;
        case "oz": result = grams / 28.3495; break;
        default: result = grams;
      }
    } else if (type === "temperature") {
      if (from === "c") {
        if (to === "f") result = (val * 9/5) + 32;
        else if (to === "k") result = val + 273.15;
        else result = val;
      } else if (from === "f") {
        if (to === "c") result = (val - 32) * 5/9;
        else if (to === "k") result = (val - 32) * 5/9 + 273.15;
        else result = val;
      } else if (from === "k") {
        if (to === "c") result = val - 273.15;
        else if (to === "f") result = (val - 273.15) * 9/5 + 32;
        else result = val;
      }
    }

    return result.toFixed(4);
  };

  const ConverterForm = ({ units, type }: { units: typeof lengthUnits, type: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-muted-foreground">From</label>
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="input-field"
          placeholder="Enter value"
        />
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
        <label className="block text-sm font-medium text-muted-foreground">To</label>
        <Input
          type="text"
          value={convert(value, fromUnit, toUnit, type)}
          readOnly
          className="input-field"
          placeholder="Result"
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
      <Tabs defaultValue="length" className="w-full">
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