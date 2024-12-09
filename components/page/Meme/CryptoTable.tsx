"use client";

import {
  Star,
  Flame,
  ArrowUpRight,
  ArrowRight,
  EarthIcon,
  TwitterIcon,
  SendIcon,
  Copy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { Button } from "../../ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";
import { useRouter } from "next/navigation";
import { TokenInfo } from "../../../types/interface";
import { formatAddress, formatVolume } from "../../../types/helper";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "@/context/store";
import axios from "axios";
import { Skeleton } from "../../ui/Skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../ui/Alert";

const table_header = [
  "Token",
  "Created on",
  "Price",
  "Mkt Cap",
  "% Holder",
  "TXs",
  "Vol",
  "1m%",
  "5m%",
  "1h%",
  "",
];

export default function CryptoTable() {
  const { setSelectedToken } = useContext(GlobalContext);
  const [tokenInfoList, setTokenInfoList] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const clickHandler = (token: TokenInfo) => {
    setSelectedToken(token);
    router.push(`/token/${token.mintAddr}`);
  };

  const copyAddress = async (token: TokenInfo) => {
    setSelectedToken(token);
    try {
      await navigator.clipboard.writeText(token.mintAddr);
    } catch (error) {
      console.error("Cannot copy address");
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: adds a smooth scrolling effect
    });
  };

  useEffect(() => {
    const fetchTokenInfoList = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://trackit-be.vercel.app/v1/token/list?limit=${itemsPerPage}&offset=${currentPage}`
        );
        // console.log(response);
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
  }, [currentPage, itemsPerPage]);

  return (
    <div className="w-full bg-panel text-gray-100 rounded-lg">
      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow className="border-itemborder hover:bg-transparent">
              {table_header.map((header, index) => (
                <TableHead key={index} className="text-gray-400">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              [...Array(8)].map((_, index) => <LoadingRow key={index} />)}
            {!isLoading &&
              tokenInfoList.map((token) => (
                <TableRow
                  key={token.id}
                  className="border-itemborder hover:bg-item"
                >
                  <TableCell className="w-50 font-medium">
                    <div className="flex items-center gap-2">
                      <img
                        src={token.image}
                        alt=""
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">
                            {token.tickerSymbol}
                          </span>
                          <EarthIcon width={12} height={12} />
                          <TwitterIcon width={12} height={12} />
                          <SendIcon width={12} height={12} />
                        </div>
                        <div className="text-xs">
                          <button
                            className="flex items-center gap-1"
                            onClick={() => copyAddress(token)}
                          >
                            <span>{formatAddress(token.creator)}</span>
                            <Copy className="h-2 w-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(token.cdate), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>${token.aptosUSDPrice.toFixed(2)}</TableCell>
                  <TableCell>{formatVolume(token.marketCapUSD)}</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell
                    className={false ? "text-red-500" : "text-green-500"}
                  >
                    5
                  </TableCell>
                  <TableCell
                    className={false ? "text-red-500" : "text-green-500"}
                  >
                    10
                  </TableCell>
                  <TableCell
                    className={false ? "text-red-500" : "text-green-500"}
                  >
                    15
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-gray-800 hover:bg-gray-700 text-gray-100"
                      onClick={() => clickHandler(token)}
                    >
                      Detail
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {!isLoading && (
        <div className="flex justify-center items-center space-x-2 mt-4 pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-6 text-white"
          >
            <ChevronLeft className="h-4 w-4" stroke="#000" />
          </Button>
          <span>Page {currentPage}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            className="h-6 text-white"
          >
            <ChevronRight className="h-4 w-4" stroke="#000" />
          </Button>
        </div>
      )}
    </div>
  );
}

const LoadingRow = () => (
  <TableRow className="border-itemborder">
    <TableCell>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </TableCell>
    {[...Array(9)].map((_, i) => (
      <TableCell key={i}>
        <Skeleton className="h-4 w-16" />
      </TableCell>
    ))}
  </TableRow>
);

const ErrorAlert = ({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) => (
  <Alert variant="destructive" className="my-4">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription className="flex flex-col gap-2">
      <p>{message}</p>
      <button
        onClick={retry}
        className="text-sm underline hover:text-red-400 w-fit"
      >
        Try again
      </button>
    </AlertDescription>
  </Alert>
);
