"use client";
import Panel from "./Panel";
import List, { renderList } from "../List";
import Item from "./Item";
import { useEffect, useState } from "react";
import { TokenInfo } from "@/types/interface";
import axios from "axios";

const cryptoData = [
  {
    name: "MASON AI",
    ticker: "MASONS AI",
    icon: "🧠",
    price: "$3.42",
    marketCap: "$7.1K",
    change: "0%",
    timeFrame: "5s",
    transactions: 3,
    volume: "$509.6",
  },
  {
    name: "FML",
    ticker: "Fucking more Ls",
    icon: "💀",
    price: "$3.42",
    marketCap: "$8.2K",
    change: "5.1%",
    timeFrame: "13s",
    transactions: 16,
    volume: "$2.5K",
  },
  {
    name: "Tester",
    ticker: "Tron Mascot",
    icon: "🎈",
    price: "$3.41",
    marketCap: "$6.8K",
    change: "3.5%",
    timeFrame: "19s",
    transactions: 3,
    volume: "$788.4",
  },
  {
    name: "MASON AI",
    ticker: "MASONS AI",
    icon: "🧠",
    price: "$3.42",
    marketCap: "$7.1K",
    change: "0%",
    timeFrame: "5s",
    transactions: 3,
    volume: "$509.6",
  },
  {
    name: "FML",
    ticker: "Fucking more Ls",
    icon: "💀",
    price: "$3.42",
    marketCap: "$8.2K",
    change: "5.1%",
    timeFrame: "13s",
    transactions: 16,
    volume: "$2.5K",
  },
  {
    name: "Tester",
    ticker: "Tron Mascot",
    icon: "🎈",
    price: "$3.41",
    marketCap: "$6.8K",
    change: "3.5%",
    timeFrame: "19s",
    transactions: 3,
    volume: "$788.4",
  },
  {
    name: "MASON AI",
    ticker: "MASONS AI",
    icon: "🧠",
    price: "$3.42",
    marketCap: "$7.1K",
    change: "0%",
    timeFrame: "5s",
    transactions: 3,
    volume: "$509.6",
  },
  {
    name: "FML",
    ticker: "Fucking more Ls",
    icon: "💀",
    price: "$3.42",
    marketCap: "$8.2K",
    change: "5.1%",
    timeFrame: "13s",
    transactions: 16,
    volume: "$2.5K",
  },
  {
    name: "Tester",
    ticker: "Tron Mascot",
    icon: "🎈",
    price: "$3.41",
    marketCap: "$6.8K",
    change: "3.5%",
    timeFrame: "19s",
    transactions: 3,
    volume: "$788.4",
  },
];

export default function Page() {
  const [tokenInfoList, setTokenInfoList] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenInfoList = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://trackit-be.vercel.app/v1/token/info`
        );
        console.log(response);
        if (response.status === 200) {
          const data: TokenInfo[] = response.data;
          setTokenInfoList(data);
        }
      } catch (err) {
        setError("Failed to fetch governance data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenInfoList();
  }, []);

  return (
    <div className="grow p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-3 md:col-span-2 lg:col-span-1 lg:block">
          <Panel title={"Token"} height="h-[445px]">
            <List list={renderList(tokenInfoList, Item)} />
          </Panel>
        </div>
        <Panel title={"Burnt"} height={"445px"}></Panel>

        <Panel title={"DEXScreener Spent"} height={"445px"}></Panel>
      </div>
    </div>
  );
}
