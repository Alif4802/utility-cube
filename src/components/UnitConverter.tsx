import { useState } from "react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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

export const UnitConverter = () => {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");

  const convert = (value: string, from: string, to: string) => {
    // Simple conversion logic for demonstration
    const val = parseFloat(value);
    if (isNaN(val)) return "";
    
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
      case "km": return (meters / 1000).toFixed(6);
      case "cm": return (meters * 100).toFixed(6);
      case "mm": return (meters * 1000).toFixed(6);
      case "in": return (meters / 0.0254).toFixed(6);
      case "ft": return (meters / 0.3048).toFixed(6);
      case "yd": return (meters / 0.9144).toFixed(6);
      case "mi": return (meters / 1609.34).toFixed(6);
      default: return meters.toFixed(6);
    }
  };

  return (
    <Card className="utility-card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Length Converter</h2>
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
          <Select
            value={fromUnit}
            onValueChange={setFromUnit}
          >
            {lengthUnits.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-muted-foreground">To</label>
          <Input
            type="text"
            value={convert(value, fromUnit, toUnit)}
            readOnly
            className="input-field"
            placeholder="Result"
          />
          <Select
            value={toUnit}
            onValueChange={setToUnit}
          >
            {lengthUnits.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </Card>
  );
};