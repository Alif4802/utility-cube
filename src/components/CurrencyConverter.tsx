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
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const { toast } = useToast();

  const { data: rates, isLoading } = useQuery({
    queryKey: ['currency-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*');
      
      if (error) throw error;
      
      return data.reduce((acc: Record<string, Record<string, number>>, curr) => {
        if (!acc[curr.base_currency]) {
          acc[curr.base_currency] = {};
        }
        acc[curr.base_currency][curr.target_currency] = curr.rate;
        return acc;
      }, {});
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

  const convertCurrency = (amount: string) => {
    if (!amount || !rates) return "";
    
    const value = parseFloat(amount);
    if (isNaN(value)) return "";

    if (fromCurrency === toCurrency) return value.toFixed(2);
    
    const rate = rates[fromCurrency]?.[toCurrency];
    if (!rate) return "";
    
    return (value * rate).toFixed(2);
  };

  return (
    <Card className="utility-card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Currency Converter</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-muted-foreground">From</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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