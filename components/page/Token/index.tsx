"use client";
import { Card } from "../../ui/Card";
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
import GlobalContext from "../../../context/store";
import TxHistory from "./TxHistory";
import Detail from "./Detail";

const main_tabs = ["Activity", "Traders", "Holders", "BC Owners"];

const sub_tabs = [
  "All",
  "Smart",
  "KOL/VC",
  "Whale",
  "Fresh",
  "Snipers",
  "Top",
  "DEV",
  "Insiders",
];

export default function Token() {
  const { selectedToken } = useContext(GlobalContext);
  // console.log(selectedToken);

  return (
    <div className="flex flex-col w-full text-foreground p-3 gap-4">
      {/* Main Content */}
      <div className="grid md:grid-cols-[1fr_300px] flex-1 gap-4">
        {/* Left Sidebar */}

        {/* Middle */}
        <div className="space-y-4">
          {/* Chart Area */}
          <div className="bg-panel rounded-lg">
            <Chart />
          </div>

          {/* Recent Transactions */}
          <Tabs defaultValue="Activity" className="w-full">
            <TabsList className="p-0 text-center bg-transparent space-x-5">
              {main_tabs.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={tab}
                  className="px-5  grid bg-item data-[state=active]:bg-itemborder data-[state=active]:text-gray-50 h-full rounded-lg data-[state=active]:rounded-lg"
                >
                  <span>{tab}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="p-0 text-center bg-transparent border border-itemborder rounded-xl">
              {sub_tabs.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={tab}
                  className="grid data-[state=active]:bg-itemborder data-[state=active]:text-gray-50 h-full rounded-lg data-[state=active]:rounded-none data-[state=active]:first:rounded-s-lg data-[state=active]:last:rounded-e-lg"
                >
                  <span>{tab}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <TxHistory />
        </div>

        {/* Right Sidebar */}
        <Detail />
      </div>
    </div>
  );
}