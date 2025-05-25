"use client";

import { ArrowUpRight, SendIcon, Copy, ChevronsUpDownIcon, CopyIcon, GlobeIcon, ClipboardCheckIcon, SparklesIcon, Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { Button } from "../../ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/Table";
import { useRouter } from "next/navigation";
import { PricePredictionData, TokenInfo, TokenInfoSui, TokenMoveFunInfo } from "../../../types/interface";
import { formatAddress, formatTokenPrice, formatVolume, isMovefunTokenInfo, isTokenInfo } from "../../../types/helper";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../../../context/store";
import axios from "axios";
import { Skeleton } from "../../ui/Skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../ui/Alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import Image from "next/image";
import Twitter from "../../icons/twitter";
import PricePredictionModal from "./PricePrediction";
import { PriceFormatter } from "../PriceFormatter";
import Link from "next/link";

interface CryptoTableProps {
  dex?: string;
}

export default function CryptoTable({ dex }: CryptoTableProps) {
  const { setSelectedToken, selectedChain } = useContext(GlobalContext);
  const [tokenInfoList, setTokenInfoList] = useState<TokenInfo[]>([]);
  const [tokenMovefunList, setTokenMovefunList] = useState<TokenMoveFunInfo[]>(
    []
  );
  const [tokenInfoSuiList, setTokenInfoSuiList] = useState<TokenInfoSui[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedTokenIds, setCopiedTokenIds] = useState<Set<string>>(new Set());
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pricePrediction, setPricePrediction] =
    useState<PricePredictionData | null>(null);
  const itemsPerPage = 10;

  const clickHandler = (token: TokenInfo | TokenInfoSui | TokenMoveFunInfo) => {
    setSelectedToken(token);
    if (isTokenInfo(token)) {
      router.push(`/token/${token.mintAddr}`);
    } else if (isMovefunTokenInfo(token)) {
      router.push(`/token/${token.address}`);
    } else {
      router.push(`/token/${token.token_address}`);
    }
  };

  const copyAddress = async (
    token: TokenInfo | TokenInfoSui | TokenMoveFunInfo
  ) => {
    setSelectedToken(token);
    try {
      if (isTokenInfo(token)) {
        await navigator.clipboard.writeText(token.mintAddr);
      } else if (isMovefunTokenInfo(token)) {
        await navigator.clipboard.writeText(token.address);
      } else {
        await navigator.clipboard.writeText(token.token_address);
      }
      setCopiedTokenIds((prev) => {
        const newSet = new Set(prev);
        if (isTokenInfo(token)) {
          newSet.add(token.id);
        } else if (isMovefunTokenInfo(token)) {
          newSet.add(token.address);
        } else {
          newSet.add(token.symbol);
        }
        return newSet;
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedTokenIds((prev) => {
          const newSet = new Set(prev);
          if (isTokenInfo(token)) {
            newSet.delete(token.id);
          } else if (isMovefunTokenInfo(token)) {
            newSet.delete(token.address);
          } else {
            newSet.delete(token.symbol);
          }
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

  const predictionHandler = async (name: string, symbol: string) => {
    setIsPredictionLoading(true);
    setIsPredictionOpen(true);
    const url = "https://api.trackit-app.xyz/v1/agent/price_prediction";
    const value = {
      name,
      symbol,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const result = await response.json();
      console.log(result);
      setPricePrediction(result);
      setIsPredictionLoading(false);
    } catch (error) {
      console.log("Failed to prediction.");
    }
  };

  const fetchTokenInfoList = async () => {
    setIsLoading(true);
    try {
      let url: string;
      if (selectedChain === "movement" && dex === "Move.Fun") {
        url = `${process.env.NEXT_PUBLIC_TRACKIT_API_HOST}/move_fun/list`;
      } else {
        url = `${process.env.NEXT_PUBLIC_TRACKIT_API_HOST}/token/list?limit=${itemsPerPage}&offset=${currentPage}&chain=${selectedChain}`;
      }
      const response = await axios.get(url);

      if (response.status === 200) {
        if (selectedChain === "sui") {
          const data: TokenInfoSui[] = response.data;
          setTokenInfoSuiList((prev) => [...prev, ...data]);
          setCurrentPage((prev) => prev + 1);
        } else {
          if (dex === "Move.Fun") {
            const data: TokenMoveFunInfo[] = response.data;
            setTokenMovefunList((prev) => [...prev, ...data]);
          } else {
            const data: TokenInfo[] = response.data;
            setTokenInfoList((prev) => [...prev, ...data]);
            setCurrentPage((prev) => prev + 1);
          }
        }
      }
    } catch (err) {
      setError("Failed to fetch governance data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTokenInfoList([]);
    setTokenInfoSuiList([]);
    setTokenMovefunList([]);
    setCurrentPage(1);

    fetchTokenInfoList();
  }, [selectedChain, dex]);

  return (
    <>
      {/* Table Section */}
      <div className="flex-1 max-w-full overflow-hidden">
        <ScrollArea className="w-full h-full">
          <Table className="table bg">
            {isLoading && (
              <TableBody>
                {[...Array(14)].map((_, index) => (
                  <LoadingRow key={index} />
                ))}
              </TableBody>
            )}
            {!isLoading && (
              <>
                <TableHeader className="sticky top-0 z-50 bg">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="sticky left-0 z-20 bg-[#0e203f] min-w-52 text-gray-400 font-medium">
                      Token
                    </TableHead>
                    <TableHead className="min-w-32 text-gray-400 font-medium">
                      <button className="flex gap-1 items-center">
                        Age <ChevronsUpDownIcon width={14} height={14} />
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
                        Vol <ChevronsUpDownIcon width={14} height={14} />
                      </button>
                    </TableHead>
                    <TableHead className="min-w-28 text-gray-400 font-medium">
                      <button className="flex gap-1 items-center">
                        % Bonding Curve{" "}
                        <ChevronsUpDownIcon width={14} height={14} />
                      </button>
                    </TableHead>
                    <TableHead className=""></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedChain !== "sui" && dex !== "Move.Fun"
                    ? tokenInfoList.map((token: TokenInfo, index) => {
                        return (
                          <TableRow
                            key={index}
                            className="hover:bg-blue-900 transition-colors duration-150 group"
                            onClick={() => clickHandler(token)}
                          >
                            <TableCell className="sticky left-0 z-20 bg-[#0e203f] group-hover:bg-blue-900 transition-colors duration-150">
                              <div className="flex items-center gap-2">
                                <Tooltip>
                                  {/* Wrap the date cell content with a Tooltip */}
                                  <TooltipTrigger asChild>
                                    <Image
                                      src="/dexes/warpgate.png"
                                      alt="warpgate"
                                      width={20}
                                      height={20}
                                      className="rounded-full"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className="p-1.5 text-xs bg-gray-50 text-gray-900">
                                    Warpgate
                                  </TooltipContent>
                                </Tooltip>

                                {/* Token info cell content */}
                                <div className="flex items-center gap-2">
                                  <img
                                    src={token.image}
                                    alt={token.name}
                                    className="h-8 w-8 rounded-full"
                                  />
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <Link
                                        href={token.pool_url}
                                        target="_blank"
                                        className="font-semibold text-gray-400 cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {token.tickerSymbol}
                                      </Link>
                                      <button
                                        className={`${
                                          copiedTokenIds.has(token.id)
                                            ? "text-green-500"
                                            : "text-gray-500"
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyAddress(token);
                                        }}
                                      >
                                        {!copiedTokenIds.has(token.id) ? (
                                          <CopyIcon width={12} height={12} />
                                        ) : (
                                          <ClipboardCheckIcon
                                            width={12}
                                            height={12}
                                          />
                                        )}
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-400">
                                        {token.creator
                                          ? formatAddress(token.creator)
                                          : formatAddress(token.creator)}
                                      </span>
                                      {token.website && (
                                        <button
                                          className="text-gray-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(
                                              token.website ||
                                                "https://www.movementnetwork.xyz/",
                                              "_blank",
                                              "noopener noreferrer"
                                            );
                                          }}
                                        >
                                          <GlobeIcon width={12} height={12} />
                                        </button>
                                      )}
                                      {token.twitter && (
                                        <button
                                          className="text-gray-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(
                                              token.twitter || "https://x.com/",
                                              "_blank",
                                              "noopener noreferrer"
                                            );
                                          }}
                                        >
                                          <Twitter />
                                        </button>
                                      )}
                                      {token.telegram && (
                                        <button
                                          className="text-gray-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(
                                              token.telegram ||
                                                "https://telegram.org",
                                              "_blank",
                                              "noopener noreferrer"
                                            );
                                          }}
                                        >
                                          <SendIcon width={12} height={12} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Tooltip>
                                {/* Wrap the date cell content with a Tooltip */}
                                <TooltipTrigger asChild>
                                  {/* Use TooltipTrigger for accessibility */}
                                  <span className="text-green-400 font-medium text-[15px] cursor-pointer">
                                    {/* Make it look clickable */}
                                    {calculateDaysSinceCreation(token.cdate)}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-50 text-gray-900">
                                  {/* Tooltip content shows the original date */}
                                  {format(new Date(token.cdate), "yyyy-MM-dd")}
                                  {/* Format the date as you like */}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex text-gray-400 font-bold text-[15px]">
                                    $
                                    {token.aptosUSDPrice && (
                                      <PriceFormatter
                                        price={token.aptosUSDPrice}
                                      />
                                    )}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-50 text-gray-900">
                                  {token.aptosUSDPrice
                                    ? formatTokenPrice(token.aptosUSDPrice)
                                    : "N/A"}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-400 font-semibold text-[15px]">
                                {token.marketCapUSD
                                  ? formatVolume(token.marketCapUSD)
                                  : "--"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-400 font-bold text-[15px]">
                                {+token.holderPercentage}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-400 font-bold text-[15px]">
                                {token.trades
                                  .map((trade) => +trade.count)
                                  .reduce((acc, cur) => acc + cur, 0)}
                              </span>
                              <div className="text-xs">
                                <span className="text-green-500 font-semibold">
                                  {token.trades
                                    .filter((trade) => trade.side === "BUY")
                                    .map((trade) => +trade.count)
                                    .reduce((acc, cur) => acc + cur, 0)}
                                </span>{" "}
                                /{" "}
                                <span className="text-red-500 font-semibold">
                                  {token.trades
                                    .filter((trade) => trade.side === "SELL")
                                    .map((trade) => +trade.count)
                                    .reduce((acc, cur) => acc + cur, 0)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sky-600 font-bold text-[15px]">
                                $
                                {formatVolume(
                                  token.trades
                                    .map((trade) => +trade.volume)
                                    .reduce((acc, cur) => acc + cur, 0)
                                )}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sky-600 font-bold text-[15px]">
                                {token.bondinCurvepercentage.toFixed(2)}%
                              </span>
                            </TableCell>
                            <TableCell className="flex items-center gap-3">
                              <Button
                                size="sm"
                                onClick={() => clickHandler(token)}
                                className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50 border border-bluesky"
                              >
                                <Image
                                  src="/flash.png"
                                  alt="flash"
                                  width={20}
                                  height={20}
                                />
                                <span className="text-[15px] font-medium">
                                  Buy
                                </span>
                              </Button>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  predictionHandler(
                                    token.name,
                                    token.tickerSymbol
                                  );
                                }}
                                className="px-2.5 bg-transparent hover:bg-bluesky text-yellow-400 border border-bluesky rounded-full"
                              >
                                <SparklesIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : tokenMovefunList.map((token: TokenMoveFunInfo, index) => {
                        return (
                          <TableRow
                            key={index}
                            className="hover:bg-blue-900 transition-colors duration-150 group"
                            onClick={() => clickHandler(token)}
                          >
                            <TableCell className="sticky left-0 z-20 bg-[#0e203f] group-hover:bg-blue-900 transition-colors duration-150">
                              <div className="flex items-center gap-2">
                                <Tooltip>
                                  {/* Wrap the date cell content with a Tooltip */}
                                  <TooltipTrigger asChild>
                                    <Image
                                      src="/dexes/move_fun.jpg"
                                      alt="move.fun"
                                      width={20}
                                      height={20}
                                      className="rounded-full"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className="p-1.5 text-xs bg-gray-50 text-gray-900">
                                    Move.Fun
                                  </TooltipContent>
                                </Tooltip>

                                {/* Token info cell content */}
                                <div className="flex items-center gap-2">
                                  <img
                                    src={token.image}
                                    alt={token.name}
                                    className="h-8 w-8 rounded-full"
                                  />
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <Link
                                        href={
                                          token.pool_url ? token.pool_url : "#"
                                        }
                                        target="_blank"
                                        className="font-semibold text-gray-400 cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {token.symbol}
                                      </Link>
                                      <button
                                        className={`${
                                          copiedTokenIds.has(token.address)
                                            ? "text-green-500"
                                            : "text-gray-500"
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyAddress(token);
                                        }}
                                      >
                                        {!copiedTokenIds.has(token.address) ? (
                                          <CopyIcon width={12} height={12} />
                                        ) : (
                                          <ClipboardCheckIcon
                                            width={12}
                                            height={12}
                                          />
                                        )}
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-400">
                                        {token.creator
                                          ? formatAddress(token.creator)
                                          : formatAddress(token.creator)}
                                      </span>
                                      {token.socials.website && (
                                        <button
                                          className="text-gray-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(
                                              token.socials.website ||
                                                "https://www.movementnetwork.xyz/",
                                              "_blank",
                                              "noopener noreferrer"
                                            );
                                          }}
                                        >
                                          <GlobeIcon width={12} height={12} />
                                        </button>
                                      )}
                                      {token.socials.twitter && (
                                        <button
                                          className="text-gray-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(
                                              token.socials.twitter ||
                                                "https://x.com/",
                                              "_blank",
                                              "noopener noreferrer"
                                            );
                                          }}
                                        >
                                          <Twitter />
                                        </button>
                                      )}
                                      {token.socials.telegram && (
                                        <button
                                          className="text-gray-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(
                                              token.socials.telegram ||
                                                "https://telegram.org",
                                              "_blank",
                                              "noopener noreferrer"
                                            );
                                          }}
                                        >
                                          <SendIcon width={12} height={12} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Tooltip>
                                {/* Wrap the date cell content with a Tooltip */}
                                <TooltipTrigger asChild>
                                  {/* Use TooltipTrigger for accessibility */}
                                  <span className="text-green-400 font-medium text-[15px] cursor-pointer">
                                    {/* Make it look clickable */}
                                    {calculateDaysSinceCreation(
                                      token.createdAt
                                    )}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-50 text-gray-900">
                                  {/* Tooltip content shows the original date */}
                                  {format(
                                    new Date(token.createdAt),
                                    "yyyy-MM-dd"
                                  )}
                                  {/* Format the date as you like */}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex text-gray-400 font-bold text-[15px]">
                                    $
                                    {token.marketData.tokenPriceUsd && (
                                      <PriceFormatter
                                        price={token.marketData.tokenPriceUsd}
                                      />
                                    )}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-50 text-gray-900">
                                  {token.marketData.tokenPriceUsd
                                    ? formatTokenPrice(
                                        token.marketData.tokenPriceUsd
                                      )
                                    : "N/A"}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-400 font-semibold text-[15px]">
                                {token.marketData.marketCap
                                  ? formatVolume(token.marketData.marketCap)
                                  : "--"}
                              </span>
                            </TableCell>                         
                            <TableCell>
                              <span className="text-sky-600 font-bold text-[15px]">
                                ${formatVolume(token.marketData.totalVolumeUsd)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sky-600 font-bold text-[15px]">
                                {token.bondingProgress.toFixed(2)}%
                              </span>
                            </TableCell>
                            <TableCell className="flex items-center gap-3">
                              <Button
                                size="sm"
                                onClick={() => clickHandler(token)}
                                className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50 border border-bluesky"
                              >
                                <Image
                                  src="/flash.png"
                                  alt="flash"
                                  width={20}
                                  height={20}
                                />
                                <span className="text-[15px] font-medium">
                                  Buy
                                </span>
                              </Button>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  predictionHandler(token.name, token.symbol);
                                }}
                                className="px-2.5 bg-transparent hover:bg-bluesky text-yellow-400 border border-bluesky rounded-full"
                              >
                                <SparklesIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  {selectedChain === "sui" &&
                    tokenInfoSuiList.map((token: TokenInfoSui, index) => {
                      return (
                        <TableRow
                          key={index}
                          className="hover:bg-blue-900 transition-colors duration-150 group"
                          onClick={() => clickHandler(token)}
                        >
                          <TableCell className="sticky left-0 z-20 bg-[#0e203f] group-hover:bg-blue-900 transition-colors duration-150">
                            <div className="flex items-center gap-2">
                              <Tooltip>
                                {/* Wrap the date cell content with a Tooltip */}
                                <TooltipTrigger asChild>
                                  <Image
                                    src="/dexes/sui_dex.png"
                                    alt="sui_dex"
                                    width={20}
                                    height={20}
                                    className="rounded-full"
                                  />
                                </TooltipTrigger>
                                <TooltipContent className="p-1.5 text-xs bg-gray-50 text-gray-900">
                                  Sui Dex
                                </TooltipContent>
                              </Tooltip>
                              {/* Token info cell content */}
                              <div className="flex items-center gap-2">
                                <img
                                  src={token.token_metadata?.iconUrl}
                                  alt=""
                                  className="h-8 w-8 rounded-full"
                                />
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-400">
                                      {token.token_metadata?.symbol}
                                    </span>
                                    <button
                                      className={`${
                                        copiedTokenIds.has(token.token_address)
                                          ? "text-green-500"
                                          : "text-gray-500"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyAddress(token);
                                      }}
                                    >
                                      {!copiedTokenIds.has(token.symbol) ? (
                                        <CopyIcon width={12} height={12} />
                                      ) : (
                                        <ClipboardCheckIcon
                                          width={12}
                                          height={12}
                                        />
                                      )}
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">
                                      {token.created_by &&
                                        formatAddress(token.created_by)}
                                    </span>
                                    {token.website && (
                                      <button
                                        className="text-gray-500"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(
                                            token.website,
                                            "_blank",
                                            "noopener noreferrer"
                                          );
                                        }}
                                      >
                                        <GlobeIcon width={12} height={12} />
                                      </button>
                                    )}
                                    {token.twitter && (
                                      <button
                                        className="text-gray-500"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(
                                            token.twitter,
                                            "_blank",
                                            "noopener noreferrer"
                                          );
                                        }}
                                      >
                                        <Twitter />
                                      </button>
                                    )}
                                    {token.telegram && (
                                      <button
                                        className="text-gray-500"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(
                                            token.telegram,
                                            "_blank",
                                            "noopener noreferrer"
                                          );
                                        }}
                                      >
                                        <SendIcon width={12} height={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              {/* Wrap the date cell content with a Tooltip */}
                              <TooltipTrigger asChild>
                                {/* Use TooltipTrigger for accessibility */}
                                <span className="text-green-400 font-medium text-[15px] cursor-pointer">
                                  {/* Make it look clickable */}
                                  {token.created_at &&
                                    calculateDaysSinceCreation(
                                      token.created_at
                                    )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-50 text-gray-900">
                                {/* Tooltip content shows the original date */}
                                {token.created_at &&
                                  format(
                                    new Date(token.created_at),
                                    "yyyy-MM-dd"
                                  )}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex text-gray-400 font-bold text-[15px]">
                                  $
                                  {token.token_price_usd && (
                                    <PriceFormatter
                                      price={token.token_price_usd}
                                    />
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-50 text-gray-900">
                                {formatTokenPrice(token.token_price_usd)}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-400 font-semibold text-[15px]">
                              {token.market_cap_sui
                                ? formatVolume(token.market_cap_usd)
                                : "--"}
                            </span>
                          </TableCell>                     
                          <TableCell>
                            <span className="text-sky-600 font-bold text-[15px]">
                              ${formatVolume(+token.volume_usd)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sky-600 font-bold text-[15px]">
                              --
                            </span>
                          </TableCell>
                          <TableCell className="flex items-center gap-3">
                            <Button
                              size="sm"
                              onClick={() => clickHandler(token)}
                              className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50 border border-bluesky"
                            >
                              <Image
                                src="/flash.png"
                                alt="flash"
                                width={20}
                                height={20}
                              />
                              <span className="text-[15px] font-medium">
                                Buy
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                predictionHandler(
                                  token.token_metadata.name,
                                  token.token_metadata.symbol
                                );
                              }}
                              className="px-2.5 bg-transparent hover:bg-bluesky text-yellow-400 border border-bluesky rounded-full"
                            >
                              <SparklesIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </>
            )}
          </Table>
          {isPredictionLoading && !pricePrediction && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
          )}
          {!isPredictionLoading && pricePrediction && (
            <PricePredictionModal
              isOpen={isPredictionOpen}
              onClose={() => setIsPredictionOpen(false)}
              data={pricePrediction}
            />
          )}
          <ScrollBar orientation="horizontal" />
          <div className="hidden md:flex justify-center items-center p-4 w-full bg border-t border-[#132D5B]">
            {hasMore && (
              <Button
                variant="outline"
                size="lg"
                onClick={fetchTokenInfoList}
                disabled={isLoading}
                className="bg-blue-950 hover:bg-blue-900 text-gray-100 hover:text-gray-100 border-gray-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>

      {hasMore && (
        <Button
          variant="outline"
          size="lg"
          onClick={fetchTokenInfoList}
          disabled={isLoading}
          className="md:hidden bg-blue-950 hover:bg-blue-900 text-gray-100 hover:text-gray-100 border-gray-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            "Load More"
          )}
        </Button>
      )}
    </>
  );
}

export const LoadingRow = () => (
  <TableRow className="bg hover:bg-transparent">
    <TableCell colSpan={7} className="p-0">
      <Skeleton className="h-12 w-full rounded-none bg-gray-600 mb-1.5" />
    </TableCell>
  </TableRow>
);

const calculateDaysSinceCreation = (cdate: string): string => {
  try {
    const date = new Date(cdate);
    return formatDistanceToNowStrict(date, { addSuffix: false }); // Use strict mode
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid date"; // Or a suitable fallback
  }
};
