import { useState } from "react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const currencies = {
  // Major World Currencies
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CHF: "Swiss Franc",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  
  // Asian Currencies
  CNY: "Chinese Yuan",
  HKD: "Hong Kong Dollar",
  SGD: "Singapore Dollar",
  INR: "Indian Rupee",
  IDR: "Indonesian Rupiah",
  MYR: "Malaysian Ringgit",
  PHP: "Philippine Peso",
  THB: "Thai Baht",
  VND: "Vietnamese Dong",
  KRW: "South Korean Won",
  PKR: "Pakistani Rupee",
  BDT: "Bangladeshi Taka"
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
      
      if (error) {
        toast({
          title: "Error fetching rates",
          description: error.message,
          variant: "destructive",
        });
        return {};
      }
      
      // Convert array to object for easier lookup
      return data.reduce((acc: Record<string, Record<string, number>>, curr) => {
        if (!acc[curr.base_currency]) {
          acc[curr.base_currency] = {};
        }
        acc[curr.base_currency][curr.target_currency] = curr.rate;
        return acc;
      }, {});
    }
  });

  const convertCurrency = (amount: string) => {
    if (!amount || !rates) return "";
    
    const value = parseFloat(amount);
    if (isNaN(value)) return "";

    try {
      if (fromCurrency === toCurrency) return value.toFixed(2);
      
      const rate = rates[fromCurrency]?.[toCurrency];
      if (!rate) {
        toast({
          title: "Conversion not available",
          description: "This currency pair is not supported yet.",
          variant: "destructive",
        });
        return "";
      }
      
      return (value * rate).toFixed(2);
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: "An error occurred during conversion.",
        variant: "destructive",
      });
      return "";
    }
  };

  return (
    <Card className="utility-card max-w-2xl mx-auto animate-fade-in">
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
          <Select
            value={fromCurrency}
            onValueChange={setFromCurrency}
          >
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </Select>
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
          <Select
            value={toCurrency}
            onValueChange={setToCurrency}
          >
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {isLoading && (
        <p className="text-sm text-muted-foreground mt-4">Loading exchange rates...</p>
      )}
    </Card>
  );
};