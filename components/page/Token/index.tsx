"use client";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Globe,
  MessageCircle,
  Timer,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Chart from "./CustomChart";
import { useContext, useEffect } from "react";
import GlobalContext from "@/context/store";
import TxHistory from "./TxHistory";

export default function Token() {
  const { selectedToken } = useContext(GlobalContext);
  console.log(selectedToken);

  return (
    <div className="flex flex-col w-full text-foreground p-3 gap-4">
      {/* Main Content */}
      <div className="grid md:grid-cols-[1fr_300px] flex-1 gap-4">
        {/* Chart Area */}
        <div className="bg-panel rounded-lg">
          {/* <div className="flex items-center justify-between mb-4">
            <Tabs defaultValue="15m">
              <TabsList>
                <TabsTrigger value="1m">1m</TabsTrigger>
                <TabsTrigger value="5m">5m</TabsTrigger>
                <TabsTrigger value="15m">15m</TabsTrigger>
                <TabsTrigger value="1h">1h</TabsTrigger>
                <TabsTrigger value="4h">4h</TabsTrigger>
                <TabsTrigger value="1d">1D</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Timer className="w-4 h-4 mr-2" />
                UTC
              </Button>
            </div>
          </div> */}

          {/* Placeholder for Chart */}
          {/* <div className="h-[400px] bg-card rounded-lg border flex items-center justify-center">
            Chart Visualization Would Go Here
          </div> */}
          <Chart />
        </div>

        {/* Right Sidebar */}
        <div className="p-4 bg-panel rounded-lg">
          <Card className="p-4 mb-4 bg-items text-white border-itemborder">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Image
                  src={selectedToken?.image || ""}
                  alt={selectedToken?.name || ""}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-bold">{selectedToken?.tickerSymbol}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedToken?.name}
                  </p>
                </div>
              </div>
              <Link href="#" className="text-blue-500 hover:text-blue-600">
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-4">
              <div>
                <div className="text-sm text-muted-foreground">PRICE USD</div>
                <div className="text-xl font-bold">$0.03650</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">LIQUIDITY</div>
                  <div className="font-bold">$1.5M</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">FDV</div>
                  <div className="font-bold">$38.4M</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">MKT CAP</div>
                  <div className="font-bold">$12.0M</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">5M</div>
                  <div className="text-green-500">1.11%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">1H</div>
                  <div className="text-green-500">0.24%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">6H</div>
                  <div className="text-green-500">4.47%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">24H</div>
                  <div className="text-red-500">-1.43%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">BUYS</div>
                  <div className="font-bold">261</div>
                  <div className="text-sm text-green-500">$34K</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">SELLS</div>
                  <div className="font-bold">291</div>
                  <div className="text-sm text-red-500">$44K</div>
                </div>
              </div>
            </div>
          </Card>
          <Image
            src={"/banner.png"}
            alt="banner"
            width="500"
            height="500"
            className="w-full"
          ></Image>
        </div>
      </div>

      {/* Recent Transactions */}
      {/* <div className="overflow-x-auto bg-panel rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-muted-foreground">
              <th className="text-left py-2">Type</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">
                <span className="text-red-500">Sell</span>
              </td>
              <td className="text-right">0.03650</td>
              <td className="text-right">4.11</td>
            </tr>
            <tr>
              <td className="py-2">
                <span className="text-green-500">Buy</span>
              </td>
              <td className="text-right">0.03609</td>
              <td className="text-right">0.8104</td>
            </tr>
            <tr>
              <td className="py-2">
                <span className="text-red-500">Sell</span>
              </td>
              <td className="text-right">0.03604</td>
              <td className="text-right">13.562</td>
            </tr>
          </tbody>
        </table>
      </div> */}
      <TxHistory />
    </div>
  );
}
