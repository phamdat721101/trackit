"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowRightLeftIcon, ArrowUp, Wallet } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Card } from "../../ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { TokenInfo, TokenInfoSui } from "../../../types/interface";
import { isTokenInfo } from "../../../types/helper";
import {
  Coin,
  ChainId,
  Pair,
  Route,
  Trade,
  TradeType,
  Percent,
  Router,
  CurrencyAmount,
  Currency,
  DEFAULT_FEE,
} from "warpgate-swap-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos, getPair, PairState } from "../../warpgate/index";

interface TokenData {
  address: string;
  symbol: string;
  name: string;
  logo: string;
  amount: string;
  quickAmounts: number[];
}

interface SwapProps {
  token?: TokenInfo | TokenInfoSui | null;
}

export default function TokenSwap({ token }: SwapProps) {
  const [activeTab, setActiveTab] = useState<string | null>("buy");
  const [slippage, setSlippage] = useState("5");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const { account, connected } = useWallet();

  useEffect(() => {
    if (token && isTokenInfo(token)) {
      const newTokenData: TokenData = {
        address: token.mintAddr,
        symbol: token.tickerSymbol,
        name: token.name,
        logo: token.image,
        amount: "0",
        quickAmounts: [10, 20, 25, 50, 75, 100],
      };
      setSelectedToken(newTokenData);
    }
  }, [token]);

  const quickAmounts = [10, 20, 25, 50, 75, 100];

  const slippageOptions = [1, 2, 3, 5, 10];

  const handleTabClick = (tab: string) => {
    setActiveTab((prevTab) => (prevTab === tab ? null : tab));
  };

  const swapHandler = async () => {
    const RushiCoin = new Coin(
      ChainId.MOVE_MAINNET,
      "0xa9e39026c4a793078bec2dda05c0d46a1d961145d3d666eb63d150fdf44b6ccf::rushi_coin::RushiCoin",
      8,
      "RushiCoin"
    );

    const CoopCoin = new Coin(
      ChainId.MOVE_MAINNET,
      "0xa9e39026c4a793078bec2dda05c0d46a1d961145d3d666eb63d150fdf44b6ccf::coop_coin::CoopCoin",
      8,
      "CoopCoin"
    );

    try {
      // Get pair
      const [pairState, pair] = await getPair(RushiCoin, CoopCoin);

      if (pairState === PairState.EXISTS && pair) {
        // Create a route
        const route = new Route([pair], RushiCoin, CoopCoin);

        // Create a trade with 1 move
        const trade = Trade.exactIn(
          route,
          CurrencyAmount.fromRawAmount(RushiCoin, "100000000"), // 1 move
          DEFAULT_FEE
        );

        // Execute the swap with 0.5% slippage tolerance
        const slippageValue = parseInt("50", 10);
        const slippagePercent = new Percent(slippageValue * 100, 10000);
        const swapParams: any = Router.swapCallParameters(trade, {
          allowedSlippage: slippagePercent, // 0.5%
        });

        // Log the swap parameters and reserves
        console.log("Swap Parameters:", {
          typeArguments: swapParams?.typeArguments,
          functionArguments: swapParams?.functionArguments,
          function: swapParams?.function,
        });

        console.log("Pair Reserves:", {
          reserve0: pair.reserve0.toExact(),
          reserve1: pair.reserve1.toExact(),
          price0: pair.token0Price.toSignificant(6),
          price1: pair.token1Price.toSignificant(6),
        });

        if (!account) return;

        // Submit transaction
        // const transaction = await aptos.transaction.build.simple({
        //   sender: account.address,
        //   data: swapParams,
        // });
        // const pendingTx = await aptos.transaction.signAndSubmitTransaction({
        //   signer: account,
        //   transaction,
        // });
        // const txResult = await aptos.transaction.waitForTransaction({
        //   transactionHash: pendingTx.hash,
        // });
      } else {
        console.log("Pair does not exist on blockchain");
        return;
      }
    } catch (error) {
      console.error("Failed to swap");
    }
  };

  return (
    <Card className="bg-items text-white border-itemborder">
      <Tabs value={activeTab ?? ""} className="w-full">
        <TabsList className="grid grid-cols-2 p-0 w-full h-12 rounded-lg bg-items">
          <TabsTrigger
            value="buy"
            onClick={() => handleTabClick("buy")}
            className={cn(
              "h-full flex items-center gap-2 rounded-lg transition-colors text-gray-50 rounded-none rounded-l-lg border-r border-r-itemborder",
              activeTab === "buy"
                ? "bg-[#424242] data-[state=active]:bg-green-500/50 data-[state=active]:text-gray-50 data-[state=active]:rounded-none data-[state=active]:rounded-l-lg"
                : "hover:bg-green-500/50 hover:rounded-none hover:rounded-l-lg"
            )}
          >
            <ArrowUp className="w-4 h-4 text-[#b4e85b]" />
            Buy
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            onClick={() => handleTabClick("sell")}
            className={cn(
              "h-full flex items-center gap-2 rounded-lg transition-colors text-gray-50 rounded-none rounded-r-lg",
              activeTab === "sell"
                ? "bg-[#422424] data-[state=active]:bg-red-500/50 data-[state=active]:text-gray-50 data-[state=active]:rounded-none data-[state=active]:rounded-r-lg"
                : "hover:bg-red-500/50 hover:rounded-none hover:rounded-r-lg"
            )}
          >
            <ArrowDown className="w-4 h-4 text-[#e85b5b]" />
            Sell
          </TabsTrigger>
        </TabsList>
        <TabsContent key="buy" value="buy">
          <div
            className={cn(
              "transition-all duration-300 ease-in-out p-2.5 space-y-3",
              activeTab
                ? "opacity-100 max-h-[600px]"
                : "opacity-0 max-h-0 overflow-hidden"
            )}
          >
            <div className="rounded-lg border border-itemborder">
              <div className="p-2 flex items-center gap-2">
                <img src="/movement-mark.svg" alt="MOVE" className="w-6 h-6" />
                <span className="font-bold">MOV</span>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-0 bg-transparent border-none text-right text-lg font-bold"
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-6 rounded-b-lg bg-[#1a3c78]">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    className="h-full p-0 bg-[#1a3c78] hover:bg-blue-800 hover:text-gray-50 border-none text-xs rounded-none first:rounded-bl-lg last:rounded-br-lg"
                    onClick={() => setAmount(quickAmount.toString())}
                  >
                    {quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-itemborder">
              <div className="p-2 flex items-center gap-2">
                <span className="w-full text-sm">Slippage %</span>
                <Input
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-full h-8 p-0 bg-transparent border-none text-right text-lg font-bold"
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-5">
                {slippageOptions.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className={cn(
                      "h-full p-0 bg-[#1a3c78] hover:bg-blue-800 hover:text-gray-50 border-none text-xs rounded-none first:rounded-bl-lg last:rounded-br-lg",
                      slippage === option.toString() && "bg-blue-800"
                    )}
                    onClick={() => setSlippage(option.toString())}
                  >
                    {option}%
                  </Button>
                ))}
              </div>
            </div>

            {connected ? (
              <Button
                onClick={() => swapHandler()}
                className={cn(
                  "w-full h-12 text-lg font-semibold",
                  activeTab === "buy"
                    ? "bg-[#b4e85b] hover:bg-[#a4d54b] text-black"
                    : "bg-[#e85b5b] hover:bg-[#d54b4b]"
                )}
              >
                <ArrowRightLeftIcon className="w-5 h-5 mr-2" />
                SWAP
              </Button>
            ) : (
              <Button
                className={cn(
                  "w-full h-12 text-lg font-semibold",
                  activeTab === "buy"
                    ? "bg-[#b4e85b] hover:bg-[#a4d54b] text-black"
                    : "bg-[#e85b5b] hover:bg-[#d54b4b]"
                )}
              >
                <Wallet className="w-5 h-5 mr-2" />
                CONNECT WALLET
              </Button>
            )}

            <div className="text-center text-xs text-gray-400">
              <p>
                You receive min. {selectedToken?.amount} {selectedToken?.symbol}
              </p>
              <p>Platform fee: 0.5%</p>
              <p className="flex items-center justify-center gap-1">
                Priority fee: 0.002 MOV
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent key="sell" value="sell">
          <div
            className={cn(
              "transition-all duration-300 ease-in-out p-2.5 space-y-3",
              activeTab
                ? "opacity-100 max-h-[600px]"
                : "opacity-0 max-h-0 overflow-hidden"
            )}
          >
            <div className="rounded-lg border border-itemborder">
              <div className="p-2 flex items-center gap-2">
                <img
                  src={selectedToken?.logo}
                  alt={selectedToken?.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-bold">{selectedToken?.symbol}</span>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-0 bg-transparent border-none text-right text-lg font-bold"
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-6 rounded-b-lg bg-[#1a3c78]">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    className="h-full p-0 bg-[#1a3c78] hover:bg-blue-800 hover:text-gray-50 border-none text-xs rounded-none first:rounded-bl-lg last:rounded-br-lg"
                    onClick={() => setAmount(quickAmount.toString())}
                  >
                    {quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-itemborder">
              <div className="p-2 flex items-center gap-2">
                <span className="w-full text-sm">Slippage %</span>
                <Input
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-full h-8 p-0 bg-transparent border-none text-right text-lg font-bold"
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-5">
                {slippageOptions.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className={cn(
                      "h-full p-0 bg-[#1a3c78] hover:bg-blue-800 hover:text-gray-50 border-none text-xs rounded-none first:rounded-bl-lg last:rounded-br-lg",
                      slippage === option.toString() && "bg-blue-800"
                    )}
                    onClick={() => setSlippage(option.toString())}
                  >
                    {option}%
                  </Button>
                ))}
              </div>
            </div>

            {connected ? (
              <Button
                className={cn(
                  "w-full h-12 text-lg font-semibold",
                  activeTab === "buy"
                    ? "bg-[#b4e85b] hover:bg-[#a4d54b] text-black"
                    : "bg-[#e85b5b] hover:bg-[#d54b4b]"
                )}
              >
                <ArrowRightLeftIcon className="w-5 h-5 mr-2" />
                SWAP
              </Button>
            ) : (
              <Button
                className={cn(
                  "w-full h-12 text-lg font-semibold",
                  activeTab === "buy"
                    ? "bg-[#b4e85b] hover:bg-[#a4d54b] text-black"
                    : "bg-[#e85b5b] hover:bg-[#d54b4b]"
                )}
              >
                <Wallet className="w-5 h-5 mr-2" />
                CONNECT WALLET
              </Button>
            )}

            <div className="text-center text-xs text-gray-400">
              <p>You receive min. {selectedToken?.amount} MOV</p>
              <p>Platform fee: 0.5%</p>
              <p className="flex items-center justify-center gap-1">
                Priority fee: 0.002 MOV
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
