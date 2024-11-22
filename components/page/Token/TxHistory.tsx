"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { useParams } from "next/navigation";
import { TxnInfo } from "@/types/interface";
import axios from "axios";
import { format } from "date-fns";

interface Trade {
  date: string;
  type: string;
  usd: string;
  cell: string;
  apt: string;
  price: string;
  maker: string;
}

const trades: Trade[] = [
  {
    date: "Nov 21 11:49:38 PM",
    type: "Buy",
    usd: "<0.01",
    cell: "0.2650",
    apt: "0.0006400",
    price: "0.02902",
    maker: "5a1b1d",
  },
  {
    date: "Nov 21 11:45:45 PM",
    type: "Sell",
    usd: "16.01",
    cell: "550.00",
    apt: "1.32",
    price: "0.02912",
    maker: "77e786",
  },
  {
    date: "Nov 21 11:43:45 PM",
    type: "Sell",
    usd: "0.87",
    cell: "30.10",
    apt: "0.07255",
    price: "0.02911",
    maker: "16651c",
  },
  {
    date: "Nov 21 11:41:20 PM",
    type: "Buy",
    usd: "0.02",
    cell: "0.7288",
    apt: "0.001760",
    price: "0.02909",
    maker: "a5b899",
  },
  {
    date: "Nov 21 11:41:16 PM",
    type: "Buy",
    usd: "0.02",
    cell: "0.7288",
    apt: "0.001760",
    price: "0.02909",
    maker: "92d5c",
  },
  {
    date: "Nov 21 11:39:01 PM",
    type: "Buy",
    usd: "14.52",
    cell: "496.94",
    apt: "1.20",
    price: "0.02921",
    maker: "b95781",
  },
];

const header_table = [
  "Date",
  "Type",
  "x Amount",
  "y Amount",
  "Maker",
  "TxHash",
];

export default function TxHistory() {
  const params = useParams<{ id: string }>();
  const [txnData, setTxnData] = useState<TxnInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenInfoList = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://trackit-be.vercel.app/v1/token/txs?token=${decodeURIComponent(
            params.id
          )}`
        );
        if (response.status === 200) {
          const data: TxnInfo[] = response.data.txnData;
          console.log(data);
          setTxnData(data);
        }
      } catch (err) {
        setError("Failed to fetch governance data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenInfoList();
  }, [params.id]);

  return (
    <div className="container mx-auto text-gray-100 rounded-lg">
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-panel border border-gray-700 rounded-lg">
          <thead>
            <tr className="text-sm">
              {header_table.map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left font-medium text-gray-400"
                >
                  <div className="flex items-center">
                    {header}
                    <Filter className="ml-2 w-4 h-4 text-gray-500" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txnData.map((trade, index) => (
              <tr key={index} className="border-t border-gray-700 text-sm">
                <td className="px-4 py-2">
                  {format(
                    new Date(+trade.timestamp / 1000),
                    "yyyy-MM-dd HH:mm:ss"
                  )}
                </td>
                <td
                  className={`px-4 py-2 ${
                    trade.side === "BUY" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trade.side}
                </td>
                {/* <td
                  className={`px-4 py-2 ${
                    trade.usd.startsWith("<")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {trade.usd}
                </td> */}
                <td className="px-4 py-2">
                  {(+trade.xAmt).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-2">
                  {(+trade.yAmt).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                {/* <td
                  className={`px-4 py-2 ${
                    trade.price.startsWith("0.02")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {trade.price}
                </td> */}
                <td className="px-4 py-2">
                  {formatAddress(trade.userWalletAddr)}
                </td>
                <td className="px-4 py-2">{formatAddress(trade.txnHash)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatAddress(address: string): string {
  return `${address.slice(-6)}`;
}
