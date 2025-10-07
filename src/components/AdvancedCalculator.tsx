import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: Date;
}

export const AdvancedCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousOperand, setPreviousOperand] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const { toast } = useToast();

  console.log('Calculator render - display:', display); // Debug log

  const safeEvaluate = useCallback((expression: string): number => {
    try {
      const cleanExpression = expression.replace(/\s/g, '');
      
      if (!/^[0-9+\-*/().]+$/.test(cleanExpression)) {
        throw new Error('Invalid characters in expression');
      }

      const result = new Function('return ' + cleanExpression)();
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid calculation result');
      }
      
      return result;
    } catch (error) {
      throw new Error('Invalid expression');
    }
  }, []);

  const addToHistory = useCallback((expression: string, result: string) => {
    const entry: HistoryEntry = {
      expression,
      result,
      timestamp: new Date()
    };
    setHistory(prev => [entry, ...prev.slice(0, 9)]);
  }, []);

  const inputNumber = useCallback((num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousOperand('');
    setOperation('');
    setWaitingForOperand(false);
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousOperand === '') {
      setPreviousOperand(String(inputValue));
    } else if (operation) {
      const prevValue = parseFloat(previousOperand);
      let result: number;

      switch (operation) {
        case '+':
          result = prevValue + inputValue;
          break;
        case '-':
          result = prevValue - inputValue;
          break;
        case '*':
          result = prevValue * inputValue;
          break;
        case '/':
          if (inputValue === 0) {
            toast({
              title: "Error",
              description: "Cannot divide by zero",
              variant: "destructive",
            });
            return;
          }
          result = prevValue / inputValue;
          break;
        default:
          return;
      }

      const resultString = String(result);
      const expression = `${previousOperand} ${operation} ${display}`;
      
      addToHistory(expression, resultString);
      setDisplay(resultString);
      setPreviousOperand(resultString);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousOperand, operation, toast, addToHistory]);

  const calculate = useCallback(() => {
    if (operation && previousOperand !== '') {
      performOperation('');
      setOperation('');
      setPreviousOperand('');
      setWaitingForOperand(true);
    }
  }, [operation, previousOperand, performOperation]);

  const scientificOperation = useCallback((func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    try {
      switch (func) {
        case 'sin':
          result = Math.sin(inputValue * Math.PI / 180);
          break;
        case 'cos':
          result = Math.cos(inputValue * Math.PI / 180);
          break;
        case 'tan':
          result = Math.tan(inputValue * Math.PI / 180);
          break;
        case 'log':
          if (inputValue <= 0) throw new Error('Invalid input for logarithm');
          result = Math.log10(inputValue);
          break;
        case 'ln':
          if (inputValue <= 0) throw new Error('Invalid input for natural logarithm');
          result = Math.log(inputValue);
          break;
        case 'sqrt':
          if (inputValue < 0) throw new Error('Invalid input for square root');
          result = Math.sqrt(inputValue);
          break;
        case 'square':
          result = inputValue * inputValue;
          break;
        case 'factorial':
          if (inputValue < 0 || !Number.isInteger(inputValue)) {
            throw new Error('Factorial only works with non-negative integers');
          }
          result = inputValue === 0 ? 1 : Array.from({length: inputValue}, (_, i) => i + 1).reduce((a, b) => a * b, 1);
          break;
        case '1/x':
          if (inputValue === 0) throw new Error('Cannot divide by zero');
          result = 1 / inputValue;
          break;
        default:
          return;
      }

      const expression = `${func}(${display})`;
      const resultString = String(result);
      
      addToHistory(expression, resultString);
      setDisplay(resultString);
      setWaitingForOperand(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid operation",
        variant: "destructive",
      });
    }
  }, [display, addToHistory, toast]);

  const memoryStore = useCallback(() => {
    setMemory(parseFloat(display));
    toast({
      title: "Memory",
      description: `Stored: ${display}`,
    });
  }, [display, toast]);

  const memoryRecall = useCallback(() => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  }, [memory]);

  const memoryClear = useCallback(() => {
    setMemory(0);
    toast({
      title: "Memory",
      description: "Memory cleared",
    });
  }, [toast]);

  const memoryAdd = useCallback(() => {
    setMemory(memory + parseFloat(display));
    toast({
      title: "Memory",
      description: `Added ${display} to memory`,
    });
  }, [memory, display, toast]);

  const addConstant = useCallback((constant: string) => {
    let value: number;
    switch (constant) {
      case 'pi':
        value = Math.PI;
        break;
      case 'e':
        value = Math.E;
        break;
      default:
        return;
    }
    setDisplay(String(value));
    setWaitingForOperand(true);
  }, []);

  const BasicCalculator = () => (
    <div className="grid grid-cols-4 gap-2">
      <Button onClick={clear} variant="outline" className="col-span-2">
        Clear
      </Button>
      <Button onClick={() => setDisplay(display.slice(0, -1) || '0')} variant="outline">
        ⌫
      </Button>
      <Button onClick={() => performOperation('/')} variant="outline">
        ÷
      </Button>
      
      {[7, 8, 9].map(num => (
        <Button key={num} onClick={() => inputNumber(String(num))} variant="outline">
          {num}
        </Button>
      ))}
      <Button onClick={() => performOperation('*')} variant="outline">
        ×
      </Button>
      
      {[4, 5, 6].map(num => (
        <Button key={num} onClick={() => inputNumber(String(num))} variant="outline">
          {num}
        </Button>
      ))}
      <Button onClick={() => performOperation('-')} variant="outline">
        −
      </Button>
      
      {[1, 2, 3].map(num => (
        <Button key={num} onClick={() => inputNumber(String(num))} variant="outline">
          {num}
        </Button>
      ))}
      <Button onClick={() => performOperation('+')} variant="outline" className="row-span-2">
        +
      </Button>
      
      <Button onClick={() => inputNumber('0')} variant="outline" className="col-span-2">
        0
      </Button>
      <Button onClick={inputDecimal} variant="outline">
        .
      </Button>
      <Button onClick={calculate} className="bg-blue-600 hover:bg-blue-700">
        =
      </Button>
    </div>
  );

  const ScientificCalculator = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2">
        <Button onClick={() => addConstant('pi')} variant="outline" size="sm">
          π
        </Button>
        <Button onClick={() => addConstant('e')} variant="outline" size="sm">
          e
        </Button>
        <Button onClick={memoryStore} variant="outline" size="sm">
          MS
        </Button>
        <Button onClick={memoryRecall} variant="outline" size="sm">
          MR
        </Button>
        <Button onClick={memoryClear} variant="outline" size="sm">
          MC
        </Button>
        <Button onClick={memoryAdd} variant="outline" size="sm">
          M+
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button onClick={() => scientificOperation('sin')} variant="outline">
          sin
        </Button>
        <Button onClick={() => scientificOperation('cos')} variant="outline">
          cos
        </Button>
        <Button onClick={() => scientificOperation('tan')} variant="outline">
          tan
        </Button>
        <Button onClick={() => scientificOperation('log')} variant="outline">
          log
        </Button>
        
        <Button onClick={() => scientificOperation('ln')} variant="outline">
          ln
        </Button>
        <Button onClick={() => scientificOperation('sqrt')} variant="outline">
          x
        </Button>
        <Button onClick={() => scientificOperation('square')} variant="outline">
          x
        </Button>
        <Button onClick={() => scientificOperation('1/x')} variant="outline">
          1/x
        </Button>
        
        <Button onClick={() => scientificOperation('factorial')} variant="outline">
          x!
        </Button>
        <Button onClick={() => setDisplay(display.includes('(') ? display + ')' : display + '(')} variant="outline">
          ( )
        </Button>
        <Button onClick={clear} variant="outline" className="col-span-2">
          Clear
        </Button>
      </div>

      <BasicCalculator />
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-100 p-3 rounded text-right border-2 border-gray-300">
          <div className="text-sm text-gray-500 h-4">
            {operation && previousOperand ? `${previousOperand} ${operation}` : ''}
          </div>
          <div className="text-2xl font-mono break-all text-black bg-white p-2 rounded">{display || '0'}</div>
          {memory !== 0 && (
            <div className="text-xs text-blue-600">M: {memory}</div>
          )}
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="scientific">Scientific</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="mt-4">
            <BasicCalculator />
          </TabsContent>
          
          <TabsContent value="scientific" className="mt-4">
            <ScientificCalculator />
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No calculations yet</p>
              ) : (
                history.map((entry, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                    <div className="font-mono">{entry.expression} = {entry.result}</div>
                    <div className="text-xs text-gray-500">
                      {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
              {history.length > 0 && (
                <Button 
                  onClick={() => setHistory([])} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  Clear History
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
