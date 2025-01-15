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
  ExternalLink,
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
import GlobalContext from "../../../context/store";
import axios from "axios";
import { Skeleton } from "../../ui/Skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../ui/Alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Badge } from "../../ui/badge";
import Image from "next/image";

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
      behavior: "smooth",
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
    <div className="w-full h-[calc(100vh-6rem)] text-gray-100 rounded-xl overflow-hidden flex flex-col shadow-lg">
      {/* Header Section */}
      <div className="p-4 border-b border-itemborder">
        <h2 className="text-xl font-bold">Top Tokens</h2>
        <p className="text-gray-400 text-sm">
          Track real-time cryptocurrency prices
        </p>
      </div>

      {/* Table Section */}
      <div className="flex-1 max-w-full overflow-hidden bg-panel ">
        <ScrollArea className="w-full h-full">
          {/* Desktop View */}
          <Table className="hidden md:table">
            <TableHeader className="sticky top-0 z-10 bg-gray-800">
              <TableRow className="border-itemborder hover:bg-transparent">
                <TableHead className="min-w-44 text-gray-400 font-medium">
                  TOKEN
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  EXCHANGE
                </TableHead>
                <TableHead className="min-w-32 text-gray-400 font-medium">
                  CREATED ON
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  PRICE
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  MKT CAP
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  % HOLDER
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  TXS
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  VOL.
                </TableHead>
                <TableHead className="min-w-20 text-gray-400 font-medium">
                  1M%
                </TableHead>
                <TableHead className="min-w-20 text-gray-400 font-medium">
                  5M%
                </TableHead>
                <TableHead className="min-w-20 text-gray-400 font-medium">
                  1H%
                </TableHead>
                <TableHead className=""></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                [...Array(6)].map((_, index) => <LoadingRow key={index} />)}
              {!isLoading &&
                tokenInfoList.map((token: TokenInfo) => (
                  <TableRow
                    key={token.id}
                    className="border-itemborder hover:bg-itemborder bg-[#0E0F13]"
                  >
                    <TableCell>
                      {/* Token info cell content */}
                      <div className="flex items-center gap-2">
                        <img
                          src={token.image}
                          alt=""
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {token.tickerSymbol}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatAddress(token.creator)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src="/dexes/routex.png"
                          alt="routex"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <Image
                          src="/dexes/warpgate.png"
                          alt="routex"
                          width={32}
                          height={32}
                          className="rounded-full -ml-4"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(token.cdate), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>${token.aptosUSDPrice.toFixed(2)}</TableCell>
                    <TableCell>{formatVolume(token.marketCapUSD)}</TableCell>
                    <TableCell>5%</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>{formatVolume(15000000)}</TableCell>
                    <TableCell
                      className={false ? "text-green-500" : "text-red-500"}
                    >
                      -1.1%
                    </TableCell>
                    <TableCell
                      className={false ? "text-green-500" : "text-red-500"}
                    >
                      -0.5%
                    </TableCell>
                    <TableCell
                      className={true ? "text-green-500" : "text-red-500"}
                    >
                      5.09%
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => clickHandler(token)}
                        className="bg-bluesky hover:bg-blue-300"
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Mobile View */}
          <ul className="md:hidden divide-y divide-itemborder">
            {!isLoading &&
              tokenInfoList.map((token) => (
                <li key={token.id} className="p-4 hover:bg-item/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={token.image}
                        alt=""
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">
                          {token.tickerSymbol}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatAddress(token.creator)}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => clickHandler(token)}
                      className="bg-bluesky hover:bg-blue-300"
                    >
                      Details
                    </Button>
                  </div>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-400">Price</dt>
                      <dd className="font-medium">
                        ${token.aptosUSDPrice.toFixed(2)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Market Cap</dt>
                      <dd>{formatVolume(token.marketCapUSD)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">24h Change</dt>
                      <dd className={true ? "text-green-500" : "text-red-500"}>
                        2.99%
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Volume</dt>
                      <dd>{formatVolume(15000000)}</dd>
                    </div>
                  </dl>
                </li>
              ))}
          </ul>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Pagination */}
      {!isLoading && (
        <div className="flex justify-between items-center p-4 border-t border-itemborder">
          <span className="text-sm text-gray-400 hidden sm:inline">
            Showing {itemsPerPage} tokens per page
          </span>
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 text-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">Page {currentPage}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-8 text-gray-800"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const LoadingRow = () => (
  <TableRow className="border-itemborder bg-[#0E0F13]">
    {/* Token Column */}
    <TableCell>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </TableCell>
    {/* Created On Column */}
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    {/* Price Column */}
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    {/* Market Cap Column */}
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    {/* Holder % Column */}
    <TableCell>
      <Skeleton className="h-4 w-12" />
    </TableCell>
    {/* TXS Column */}
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    {/* Volume Column */}
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    {/* 1M% Column */}
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    {/* 5M% Column */}
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    {/* 1H% Column */}
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    {/* Details Button Column */}
    <TableCell>
      <Skeleton className="h-8 w-16 rounded-md" />
    </TableCell>
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

// Utility Components
const SocialButton = ({ icon: Icon, link }: { icon: any; link: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button className="p-1 rounded-full hover:bg-gray-700/50 transition-colors">
        <Icon className="h-3 w-3 text-gray-400" />
      </button>
    </TooltipTrigger>
    <TooltipContent>Visit Website</TooltipContent>
  </Tooltip>
);

const CopyableAddress = ({
  address,
  onClick,
}: {
  address: string;
  onClick: () => void;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
        onClick={onClick}
      >
        <span>{formatAddress(address)}</span>
        <Copy className="h-3 w-3" />
      </button>
    </TooltipTrigger>
    <TooltipContent>Copy Address</TooltipContent>
  </Tooltip>
);

const PriceChangeCell = ({ value }: { value: number }) => (
  <TableCell>
    <span
      className={`flex items-center gap-1 ${
        value >= 0 ? "text-green-500" : "text-red-500"
      }`}
    >
      {value >= 0 ? "+" : ""}
      {value}%
      <ArrowUpRight
        className={`h-3 w-3 ${value >= 0 ? "rotate-0" : "rotate-180"}`}
      />
    </span>
  </TableCell>
);
