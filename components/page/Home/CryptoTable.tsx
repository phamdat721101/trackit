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
  ChevronsUpDownIcon,
  ExternalLink,
  CopyIcon,
  GlobeIcon,
  ZapIcon,
  FilterIcon,
  FilterXIcon,
  ClipboardCheckIcon,
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
} from "../../ui/Tooltip";
import { Badge } from "../../ui/badge";
import Image from "next/image";
import Twitter from "../../icons/twitter";

export default function CryptoTable() {
  const { selectedToken, setSelectedToken } = useContext(GlobalContext);
  const [tokenInfoList, setTokenInfoList] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTime, setSelectedTime] = useState<string>("1m");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [copiedTokenIds, setCopiedTokenIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 8;

  const clickHandler = (token: TokenInfo) => {
    setSelectedToken(token);
    router.push(`/token/${token.mintAddr}`);
  };

  const copyAddress = async (token: TokenInfo) => {
    setSelectedToken(token);
    try {
      await navigator.clipboard.writeText(token.mintAddr);
      setCopiedTokenIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(token.id);
        return newSet;
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedTokenIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(token.id);
          return newSet;
        });
      }, 2000);
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
    <div className="w-full h-[calc(100vh-6rem)] text-gray-100 overflow-hidden flex flex-col shadow-lg">
      {/* Time Filters */}
      <div className="mb-4 md:flex">
        <div className="border border-[#1a3c78] rounded-lg w-fit mb-3 md:mb-0">
          {timeFilters.map((filter) => (
            <Button
              key={filter}
              variant="ghost"
              onClick={() => setSelectedTime(filter)}
              className={`${
                selectedTime === filter
                  ? "bg-[#005880] text-gray-300"
                  : "bg-[#102447] text-gray-500"
              } text-sm border-r border-r-[#1a3c78] last:border-none rounded-none first:rounded-s-lg last:rounded-e-lg hover:bg-[#005880] hover:text-current`}
            >
              {filter}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4">
          {/* <Button variant="outline" className="gap-2">
            <ZapIcon className="h-4 w-4" />
            Buy
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">0</Button>
            <Button variant="outline">$</Button>
          </div> */}
          <Button
            className="px-5 text-gray-300 bg-[#102447] hover:bg-[#005880] hover:text-current"
            onClick={() => setIsFiltered(!isFiltered)}
          >
            {!isFiltered ? <FilterIcon /> : <FilterXIcon />}
            <span className="text-[15px]">Filter Token</span>
          </Button>
          <Button
            variant="default"
            className="px-5 bg-bluesky text-base font-semibold hover:bg-bluesky/80"
          >
            Connect
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 max-w-full overflow-hidden">
        <ScrollArea className="w-full h-full">
          {/* Desktop View */}
          <Table className="hidden md:table bg">
            <TableHeader className="sticky top-0 z-10 bg">
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-52 text-gray-400 font-medium">
                  Token
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  Exchange
                </TableHead>
                <TableHead className="min-w-32 text-gray-400 font-medium">
                  <button className="flex gap-1 items-center">
                    Created On <ChevronsUpDownIcon width={14} height={14} />
                  </button>
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  <button className="flex gap-1 items-center">
                    Price <ChevronsUpDownIcon width={14} height={14} />
                  </button>
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  <button className="flex gap-1 items-center">
                    Liq/MC <ChevronsUpDownIcon width={14} height={14} />
                  </button>
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  <button className="flex gap-1 items-center">
                    % Holder <ChevronsUpDownIcon width={14} height={14} />
                  </button>
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  <button className="flex gap-1 items-center">
                    TXs <ChevronsUpDownIcon width={14} height={14} />
                  </button>
                </TableHead>
                <TableHead className="min-w-28 text-gray-400 font-medium">
                  <button className="flex gap-1 items-center">
                    Vol <ChevronsUpDownIcon width={14} height={14} />
                  </button>
                </TableHead>
                <TableHead className="min-w-20 text-gray-400 font-medium">
                  <button className="flex gap-1 items-center">
                    1m% <ChevronsUpDownIcon width={14} height={14} />
                  </button>
                </TableHead>
                <TableHead className="min-w-20 text-gray-400 font-medium">
                  <button className="flex gap-1 items-center">
                    5m% <ChevronsUpDownIcon width={14} height={14} />
                  </button>
                </TableHead>
                <TableHead className="min-w-20 text-gray-400 font-medium">
                  <button className="flex gap-1 items-center">
                    1h% <ChevronsUpDownIcon width={14} height={14} />
                  </button>
                </TableHead>
                <TableHead className=""></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                [...Array(6)].map((_, index) => <LoadingRow key={index} />)}
              {!isLoading &&
                tokenInfoList.map((token: TokenInfo) => (
                  <TableRow key={token.id} className="hover:bg-blue-900">
                    <TableCell>
                      {/* Token info cell content */}
                      <div className="flex items-center gap-2">
                        <img
                          src={token.image}
                          alt=""
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-400">
                              {token.tickerSymbol}
                            </span>
                            <button
                              className={`${
                                copiedTokenIds.has(token.id)
                                  ? "text-green-500"
                                  : "text-gray-500"
                              }`}
                              onClick={() => copyAddress(token)}
                            >
                              {!copiedTokenIds.has(token.id) ? (
                                <CopyIcon width={12} height={12} />
                              ) : (
                                <ClipboardCheckIcon width={12} height={12} />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              {formatAddress(token.creator)}
                            </span>
                            <button className="text-gray-500">
                              <Twitter />
                            </button>
                            <button className="text-gray-500">
                              <GlobeIcon width={12} height={12} />
                            </button>
                            <button className="text-gray-500">
                              <SendIcon width={12} height={12} />
                            </button>
                          </div>
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
                      <span className="text-green-400 font-medium text-[15px]">
                        {format(new Date(token.cdate), "yyyy-MM-dd")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400 font-bold text-[15px]">
                        ${token.aptosUSDPrice.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400 font-semibold text-[15px]">
                        {formatVolume(token.marketCapUSD)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400 font-bold text-[15px]">
                        5%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400 font-bold text-[15px]">
                        10
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sky-600 font-bold text-[15px]">
                        ${formatVolume(15000000)}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`font-semibold text-[15px] ${
                        false ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      -1.1%
                    </TableCell>
                    <TableCell
                      className={`font-semibold text-[15px] ${
                        false ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      -0.5%
                    </TableCell>
                    <TableCell
                      className={`font-semibold text-[15px] ${
                        true ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      5.09%
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => clickHandler(token)}
                        className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50"
                      >
                        <Image
                          src="/flash.png"
                          alt="flash"
                          width={20}
                          height={20}
                        />
                        <span className="text-[15px] font-medium">Buy</span>
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
                      className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50"
                    >
                      <Image
                        src="/flash.png"
                        alt="flash"
                        width={20}
                        height={20}
                      />
                      <span className="text-[15px] font-medium">Buy</span>
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

const timeFilters = ["1m", "5m", "1h", "6h", "24h"];
