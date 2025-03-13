"use client";

import { useState } from "react";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { Input } from "../../ui/Input";
import { Plus, Info } from "lucide-react";
import TokenSelector from "./TokenSelector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

// Mock token data - same as in swap-interface.tsx
const tokens = [
  {
    id: "move",
    name: "Movement",
    symbol: "MOVE",
    balance: "1.56",
    price: 0.5,
    icon: "/movement-mark-full-color.png",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    balance: "0.01",
    price: 2000,
    icon: "/eth-logo.png",
  },
];

export default function AddLiquidityUI() {
  const [token1, setToken1] = useState(tokens[0]);
  const [token2, setToken2] = useState(tokens[1]);
  const [amount1, setAmount1] = useState("1");
  const [amount2, setAmount2] = useState("");

  // Calculate the second amount based on price ratio
  const calculateAmount2 = (value: string) => {
    if (!value || isNaN(Number(value))) {
      setAmount1(value);
      setAmount2("");
      return;
    }

    setAmount1(value);
    const calculatedAmount = (
      (Number(value) * token1.price) /
      token2.price
    ).toFixed(6);
    setAmount2(calculatedAmount);
  };

  // Calculate the first amount based on price ratio
  const calculateAmount1 = (value: string) => {
    if (!value || isNaN(Number(value))) {
      setAmount2(value);
      setAmount1("");
      return;
    }

    setAmount2(value);
    const calculatedAmount = (
      (Number(value) * token2.price) /
      token1.price
    ).toFixed(6);
    setAmount1(calculatedAmount);
  };

  // Calculate share of pool (mock)
  const poolShare = "0.02%";

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-6 pb-0">
        {/* First Token Input */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">First Token</span>
            <span className="text-sm text-muted-foreground">
              Balance: {token1.balance} {token1.symbol}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 p-0 bg-muted/50 rounded-xl">
            <TokenSelector
              selectedToken={token1}
              onSelectToken={setToken1}
              tokens={tokens.filter((t) => t.id !== token2.id)}
            />
            <Input
              type="number"
              value={amount1}
              onChange={(e) => calculateAmount2(e.target.value)}
              className="border-0 bg-transparent text-right text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.0"
            />
          </div>
        </div>

        {/* Plus Icon */}
        <div className="py-1.5 flex justify-center">
          <div className="bg-muted rounded-full p-2">
            <Plus className="h-4 w-4" />
          </div>
        </div>

        {/* Second Token Input */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Second Token</span>
            <span className="text-sm text-muted-foreground">
              Balance: {token2.balance} {token2.symbol}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 p-0 bg-muted/50 rounded-xl">
            <TokenSelector
              selectedToken={token2}
              onSelectToken={setToken2}
              tokens={tokens.filter((t) => t.id !== token1.id)}
            />
            <Input
              type="number"
              value={amount2}
              onChange={(e) => calculateAmount1(e.target.value)}
              className="border-0 bg-transparent text-right text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.0"
            />
          </div>
        </div>

        {/* Price and Pool Information */}
        <div className="p-3 bg-muted/50 rounded-lg space-y-2 mt-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <span>Price Ratio</span>
            </div>
            <span>
              1 {token1.symbol} = {(token1.price / token2.price).toFixed(6)}{" "}
              {token2.symbol}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <span>Share of Pool</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your share of the total liquidity pool</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span>{poolShare}</span>
          </div>
        </div>

        {/* Add Liquidity Button */}
        <Button
          className="w-full mt-4 sm:mt-6 h-10 sm:h-12 text-base sm:text-lg"
          size="lg"
        >
          Add Liquidity
        </Button>
      </CardContent>
    </Card>
  );
}
