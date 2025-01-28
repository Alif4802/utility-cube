import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const currencies = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CHF: "Swiss Franc",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CNY: "Chinese Yuan",
  HKD: "Hong Kong Dollar",
  SGD: "Singapore Dollar",
  INR: "Indian Rupee"
};

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const { toast } = useToast();

  const { data: rates, isLoading } = useQuery({
    queryKey: ['currency-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*');
      
      if (error) {
        console.error("Error fetching rates:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error("No exchange rates available");
      }

      // Initialize the rates object with an empty object for each currency
      const ratesObj: Record<string, Record<string, number>> = {};
      
      // Process each rate entry
      data.forEach(entry => {
        if (!ratesObj[entry.base_currency]) {
          ratesObj[entry.base_currency] = {};
        }
        ratesObj[entry.base_currency][entry.target_currency] = Number(entry.rate);
      });

      console.log("Processed rates:", ratesObj);
      return ratesObj;
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching rates",
          description: error.message || "An error occurred",
          variant: "destructive",
        });
      }
    }
  });

  const convertCurrency = (inputAmount: string): string => {
    if (!inputAmount || !rates) {
      console.log("No input amount or rates", { inputAmount, rates });
      return "";
    }
    
    const value = parseFloat(inputAmount);
    if (isNaN(value)) {
      console.log("Invalid number");
      return "";
    }

    if (fromCurrency === toCurrency) return value.toFixed(2);
    
    console.log("Converting", {
      from: fromCurrency,
      to: toCurrency,
      amount: value,
      availableRates: rates
    });

    // Direct conversion
    if (rates[fromCurrency]?.[toCurrency]) {
      const rate = rates[fromCurrency][toCurrency];
      const result = value * rate;
      console.log("Direct conversion", { rate, result });
      return result.toFixed(2);
    }
    
    // Reverse conversion
    if (rates[toCurrency]?.[fromCurrency]) {
      const rate = 1 / rates[toCurrency][fromCurrency];
      const result = value * rate;
      console.log("Reverse conversion", { rate, result });
      return result.toFixed(2);
    }
    
    // USD base conversion
    if (rates["USD"]?.[fromCurrency] && rates["USD"]?.[toCurrency]) {
      const toUSD = 1 / rates["USD"][fromCurrency];
      const fromUSDToTarget = rates["USD"][toCurrency];
      const result = value * toUSD * fromUSDToTarget;
      console.log("USD base conversion", { toUSD, fromUSDToTarget, result });
      return result.toFixed(2);
    }

    console.log("No conversion path found");
    return "";
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,9}$/.test(value) || value === '') {
      setAmount(value);
      console.log("Amount changed to:", value);
    }
  };

  return (
    <Card className="utility-card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Currency Converter</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-muted-foreground">From</label>
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="input-field"
            placeholder="Enter amount"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                {fromCurrency} - {currencies[fromCurrency as keyof typeof currencies]}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
              {Object.entries(currencies).map(([code, name]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setFromCurrency(code)}
                >
                  {code} - {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-muted-foreground">To</label>
          <Input
            type="text"
            value={convertCurrency(amount)}
            readOnly
            className="input-field"
            placeholder="Converted amount"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                {toCurrency} - {currencies[toCurrency as keyof typeof currencies]}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
              {Object.entries(currencies).map(([code, name]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setToCurrency(code)}
                >
                  {code} - {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isLoading && (
        <p className="text-sm text-muted-foreground mt-4">Loading exchange rates...</p>
      )}
    </Card>
  );
};