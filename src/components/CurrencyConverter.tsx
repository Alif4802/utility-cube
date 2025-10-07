import { useState, useEffect } from "react";
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
import { ChevronDown, RefreshCw, ArrowUpDown } from "lucide-react";

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
  INR: "Indian Rupee",
  // Additional Major Currencies
  KRW: "South Korean Won",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  DKK: "Danish Krone",
  PLN: "Polish Zloty",
  CZK: "Czech Koruna",
  HUF: "Hungarian Forint",
  RUB: "Russian Ruble",
  TRY: "Turkish Lira",
  // Middle East & Africa
  AED: "UAE Dirham",
  SAR: "Saudi Riyal",
  QAR: "Qatari Riyal",
  KWD: "Kuwaiti Dinar",
  BHD: "Bahraini Dinar",
  OMR: "Omani Rial",
  JOD: "Jordanian Dinar",
  LBP: "Lebanese Pound",
  EGP: "Egyptian Pound",
  ZAR: "South African Rand",
  NGN: "Nigerian Naira",
  KES: "Kenyan Shilling",
  MAD: "Moroccan Dirham",
  TND: "Tunisian Dinar",
  // Asia Pacific
  THB: "Thai Baht",
  MYR: "Malaysian Ringgit",
  IDR: "Indonesian Rupiah",
  PHP: "Philippine Peso",
  VND: "Vietnamese Dong",
  TWD: "Taiwan Dollar",
  NZD: "New Zealand Dollar",
  FJD: "Fijian Dollar",
  PGK: "Papua New Guinea Kina",
  // South Asia
  PKR: "Pakistani Rupee",
  BDT: "Bangladeshi Taka",
  LKR: "Sri Lankan Rupee",
  NPR: "Nepalese Rupee",
  BTN: "Bhutanese Ngultrum",
  MVR: "Maldivian Rufiyaa",
  // Latin America
  MXN: "Mexican Peso",
  BRL: "Brazilian Real",
  ARS: "Argentine Peso",
  CLP: "Chilean Peso",
  COP: "Colombian Peso",
  PEN: "Peruvian Sol",
  UYU: "Uruguayan Peso",
  PYG: "Paraguayan Guarani",
  BOB: "Bolivian Boliviano",
  VES: "Venezuelan Bolívar",
  // Caribbean
  JMD: "Jamaican Dollar",
  TTD: "Trinidad and Tobago Dollar",
  BBD: "Barbadian Dollar",
  BSD: "Bahamian Dollar",
  BMD: "Bermudian Dollar",
  KYD: "Cayman Islands Dollar",
  XCD: "East Caribbean Dollar",
  // Europe (Non-EU)
  ISK: "Icelandic Krona",
  RON: "Romanian Leu",
  BGN: "Bulgarian Lev",
  HRK: "Croatian Kuna",
  RSD: "Serbian Dinar",
  MKD: "North Macedonian Denar",
  ALL: "Albanian Lek",
  BAM: "Bosnia-Herzegovina Convertible Mark",
  MDL: "Moldovan Leu",
  UAH: "Ukrainian Hryvnia",
  BYN: "Belarusian Ruble",
  GEL: "Georgian Lari",
  AMD: "Armenian Dram",
  AZN: "Azerbaijani Manat",
  // Central Asia
  KZT: "Kazakhstani Tenge",
  UZS: "Uzbekistani Som",
  KGS: "Kyrgyzstani Som",
  TJS: "Tajikistani Somoni",
  TMT: "Turkmenistani Manat",
  AFN: "Afghan Afghani",
  // East Asia
  MNT: "Mongolian Tugrik",
  LAK: "Laotian Kip",
  KHR: "Cambodian Riel",
  MMK: "Myanmar Kyat",
  BND: "Brunei Dollar",
  // Pacific
  TOP: "Tongan Pa'anga",
  WST: "Samoan Tala",
  VUV: "Vanuatu Vatu",
  SBD: "Solomon Islands Dollar",
  // Cryptocurrencies (if supported)
  BTC: "Bitcoin",
  ETH: "Ethereum",
  // Precious Metals
  XAU: "Gold (Troy Ounce)",
  XAG: "Silver (Troy Ounce)",
  XPT: "Platinum (Troy Ounce)",
  XPD: "Palladium (Troy Ounce)"
};

// Fallback exchange rates (approximate, for demo purposes)
const fallbackRates: { [key: string]: { [key: string]: number } } = {
  USD: {
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110,
    CHF: 0.92,
    AUD: 1.35,
    CAD: 1.25,
    CNY: 6.45,
    HKD: 7.8,
    SGD: 1.35,
    INR: 74.5,
    KRW: 1180,
    SEK: 8.5,
    NOK: 8.8,
    DKK: 6.3,
    PLN: 3.9,
    CZK: 21.5,
    HUF: 295,
    RUB: 73,
    TRY: 8.5,
    AED: 3.67,
    SAR: 3.75,
    QAR: 3.64,
    KWD: 0.30,
    BHD: 0.38,
    OMR: 0.39,
    JOD: 0.71,
    LBP: 1515,
    EGP: 15.7,
    ZAR: 14.8,
    NGN: 411,
    KES: 110,
    MAD: 8.9,
    TND: 2.8,
    THB: 31.5,
    MYR: 4.15,
    IDR: 14250,
    PHP: 50.5,
    VND: 23100,
    TWD: 28,
    NZD: 1.42,
    PKR: 176,
    BDT: 85,
    LKR: 200,
    NPR: 119,
    MXN: 20.2,
    BRL: 5.2,
    ARS: 98,
    CLP: 710,
    COP: 3650,
    PEN: 3.6,
    ISK: 125,
    RON: 4.2,
    BGN: 1.66,
    HRK: 6.4,
    UAH: 27.3,
    GEL: 3.3,
    KZT: 425,
    BTC: 45000,
    ETH: 3200,
    XAU: 1900,
    XAG: 24
  },
  EUR: {
    USD: 1.18,
    GBP: 0.88,
    JPY: 129,
    CHF: 1.08,
    AUD: 1.59,
    CAD: 1.47,
    CNY: 7.6,
    HKD: 9.2,
    SGD: 1.59,
    INR: 87.8,
    KRW: 1390,
    SEK: 10.0,
    NOK: 10.4,
    DKK: 7.4,
    PLN: 4.6,
    CZK: 25.3,
    HUF: 347,
    RUB: 86,
    TRY: 10.0,
    AED: 4.33,
    SAR: 4.42,
    THB: 37.1,
    MYR: 4.89,
    MXN: 23.8,
    BRL: 6.1,
    ZAR: 17.4,
    RON: 4.9,
    BGN: 1.96,
    HRK: 7.5
  },
  GBP: {
    USD: 1.33,
    EUR: 1.14,
    JPY: 147,
    CHF: 1.23,
    AUD: 1.81,
    CAD: 1.67,
    CNY: 8.6,
    HKD: 10.4,
    SGD: 1.81,
    INR: 99.5,
    KRW: 1575,
    SEK: 11.3,
    NOK: 11.7,
    DKK: 8.4,
    PLN: 5.2,
    CZK: 28.7,
    HUF: 393,
    RUB: 97,
    TRY: 11.3,
    AED: 4.9,
    SAR: 5.0,
    THB: 42.0,
    MYR: 5.5,
    MXN: 27.0,
    BRL: 6.9,
    ZAR: 19.7
  }
};

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [usingFallback, setUsingFallback] = useState(false);
  const { toast } = useToast();

  const { data: rates, isLoading, error, refetch } = useQuery({
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

      const ratesObj: { [key: string]: { [key: string]: number } } = {};
      
      data.forEach(rate => {
        if (!ratesObj[rate.base_currency]) {
          ratesObj[rate.base_currency] = {};
        }
        ratesObj[rate.base_currency][rate.target_currency] = Number(rate.rate);
      });

      return ratesObj;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (error) {
      setUsingFallback(true);
      toast({
        title: "Using Demo Rates",
        description: "Live exchange rates unavailable. Using sample rates for demonstration.",
        variant: "default",
      });
    } else if (rates && usingFallback) {
      setUsingFallback(false);
    }
  }, [error, rates, toast, usingFallback]);

  const convertCurrency = (inputAmount: string): string => {
    if (!inputAmount) {
      return "";
    }
    
    const value = parseFloat(inputAmount);
    if (isNaN(value)) {
      return "";
    }

    if (fromCurrency === toCurrency) {
      return value.toFixed(2);
    }

    const currentRates = usingFallback ? fallbackRates : rates;
    if (!currentRates) {
      return "";
    }

    // Direct conversion
    if (currentRates[fromCurrency]?.[toCurrency]) {
      return (value * currentRates[fromCurrency][toCurrency]).toFixed(2);
    }
    
    // Reverse conversion
    if (currentRates[toCurrency]?.[fromCurrency]) {
      return (value * (1 / currentRates[toCurrency][fromCurrency])).toFixed(2);
    }
    
    // USD base conversion for fallback rates
    if (usingFallback) {
      if (fromCurrency === 'USD' && fallbackRates['USD'][toCurrency]) {
        return (value * fallbackRates['USD'][toCurrency]).toFixed(2);
      }
      if (toCurrency === 'USD' && fallbackRates[fromCurrency]) {
        const rate = fallbackRates['USD'][fromCurrency];
        return rate ? (value / rate).toFixed(2) : "";
      }
      // Cross conversion via USD
      const fromRate = fallbackRates['USD'][fromCurrency];
      const toRate = fallbackRates['USD'][toCurrency];
      if (fromRate && toRate) {
        const usdValue = value / fromRate;
        return (usdValue * toRate).toFixed(2);
      }
    }

    // USD base conversion for live rates
    if (currentRates["USD"]?.[fromCurrency] && currentRates["USD"]?.[toCurrency]) {
      const toUSD = value * (1 / currentRates["USD"][fromCurrency]);
      return (toUSD * currentRates["USD"][toCurrency]).toFixed(2);
    }

    return "";
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,9}$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const swapCurrencies = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
  };

  return (
    <Card className="utility-card max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gradient">Currency Converter</h2>
        {usingFallback && (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">
              Demo Mode
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="space-y-4">
          <label htmlFor="currency-amount" className="block text-sm font-medium text-muted-foreground">From Amount</label>
          <Input
            id="currency-amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="input-field"
            placeholder="Enter amount"
            aria-invalid={amount !== '' && isNaN(Number(amount))}
            disabled={isLoading}
          />
          {amount !== '' && isNaN(Number(amount)) && (
            <p className="text-xs text-destructive mt-1">Please enter a valid number.</p>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full" disabled={isLoading} aria-label="Select from currency">
                {isLoading ? 'Loading...' : `${fromCurrency} - ${currencies[fromCurrency as keyof typeof currencies]}`}
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
        
        {/* Swap Button */}
        <div className="flex justify-center items-center md:items-start md:pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={swapCurrencies}
            disabled={isLoading}
            title="Swap currencies"
            className="rounded-full"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <label htmlFor="currency-result" className="block text-sm font-medium text-muted-foreground">To Amount</label>
          <Input
            id="currency-result"
            type="text"
            value={convertCurrency(amount)}
            readOnly
            className="input-field"
            placeholder="Converted amount"
            aria-readonly
            disabled={isLoading}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full" disabled={isLoading} aria-label="Select to currency">
                {isLoading ? 'Loading...' : `${toCurrency} - ${currencies[toCurrency as keyof typeof currencies]}`}
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
      {usingFallback && (
        <p className="text-xs text-muted-foreground mt-4">
          * Using demonstration exchange rates. Actual rates may vary.
        </p>
      )}
    </Card>
  );
};