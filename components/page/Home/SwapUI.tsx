"use client";

import { useState } from "react";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { Input } from "../../ui/Input";
import { Slider } from "../../ui/slider";
import { ArrowDownUp, Info, RefreshCw, Settings } from "lucide-react";
import TokenSelector from "./TokenSelector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

// Mock token data
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

export default function SwapUI() {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState("1");
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate the to amount based on price
  const toAmount = fromAmount
    ? (
        (Number.parseFloat(fromAmount) * fromToken.price) /
        toToken.price
      ).toFixed(6)
    : "0";

  // Swap the tokens
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  // Calculate price impact (mock)
  const priceImpact = "0.05%";

  // Calculate minimum received (mock)
  const minReceived = (
    Number.parseFloat(toAmount) *
    (1 - slippage / 100)
  ).toFixed(6);

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-6 pb-0">
        {/* From Token Section */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">From</span>
            <span className="text-sm text-muted-foreground">
              Balance: {fromToken.balance} {fromToken.symbol}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 p-0 bg-muted/50 rounded-xl">
            <TokenSelector
              selectedToken={fromToken}
              onSelectToken={setFromToken}
              tokens={tokens.filter((t) => t.id !== toToken.id)}
            />
            <Input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="border-0 bg-transparent text-right text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.0"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="py-3 flex justify-center relative z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background h-10 w-10 sm:h-12 sm:w-12 border-2 shadow-md"
            onClick={handleSwapTokens}
          >
            <ArrowDownUp className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* To Token Section */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">To</span>
            <span className="text-sm text-muted-foreground">
              Balance: {toToken.balance} {toToken.symbol}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-muted/50 rounded-xl">
            <TokenSelector
              selectedToken={toToken}
              onSelectToken={setToToken}
              tokens={tokens.filter((t) => t.id !== fromToken.id)}
            />
            <Input
              type="number"
              value={toAmount}
              readOnly
              className="border-0 bg-transparent text-right text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.0"
            />
          </div>
        </div>

        {/* Price and Settings */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <span>Price</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exchange rate between tokens</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-1">
              <span>
                1 {fromToken.symbol} ={" "}
                {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}
              </span>
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 text-muted-foreground"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 text-muted-foreground"
                >
                  <Info className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price Impact</span>
                    <span>{priceImpact}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Minimum Received
                    </span>
                    <span>
                      {minReceived} {toToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Slippage Tolerance
                    </span>
                    <span>{slippage}%</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Slippage Settings */}
          {showSettings && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Slippage Tolerance</span>
                <span className="text-sm font-medium">{slippage}%</span>
              </div>
              <Slider
                value={[slippage]}
                min={0.1}
                max={5}
                step={0.1}
                onValueChange={(value) => setSlippage(value[0])}
              />
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs flex-1"
                  onClick={() => setSlippage(0.1)}
                >
                  0.1%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs flex-1"
                  onClick={() => setSlippage(0.5)}
                >
                  0.5%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs flex-1"
                  onClick={() => setSlippage(1.0)}
                >
                  1.0%
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <Button
          className="w-full mt-4 h-10 sm:h-12 text-base sm:text-lg"
          size="lg"
        >
          Swap
        </Button>
      </CardContent>
    </Card>
  );
}
