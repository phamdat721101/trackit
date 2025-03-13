"use client";

import { ArrowRightLeftIcon, Loader2, MinusIcon, PlusIcon } from "lucide-react";
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
import { useContext, useEffect, useState } from "react";
import { LoadingRow } from "./CryptoTable";
import {
  aptosClient,
  estimateLiquidToAdd,
  getAddLiquidParams,
  getPairParams,
  getRemoveLiquidParams,
  getSwapParams,
  TESTNET_SWAP_CONTRACT_ADDRESS,
} from "../../warpgate/index";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { SWAP_ADDRESS } from "warpgate-swap-sdk";
import { useToast } from "@/hooks/use-toast";
import { convertAmountFromHumanReadableToOnChain } from "@aptos-labs/ts-sdk";
import { formatAddress, formatVolume } from "@/types/helper";
import Link from "next/link";
import OperationDialog from "./OperationDialog";
import GlobalContext from "../../../context/store";
import axios from "axios";
import { Pool } from "../../../types/interface";

export default function Pools() {
  const { selectedChain } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { account, signAndSubmitTransaction } = useWallet();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState("swap");
  const { toast } = useToast();
  const [poolData, setPoolData] = useState<Pool[]>([]);
  const limitPool = 3;

  // const addLiquid = async () => {
  //   if (!account) {
  //     throw new Error("Wallet not connected");
  //   }

  //   const params = await getPairParams(
  //     "0x1::aptos_coin::AptosCoin",
  //     "MOVE",
  //     "0x18394ec9e2a191e2470612a57547624b12254c9fbb552acaff6750237491d644::MAHA::MAHA",
  //     "MAHA"
  //   );

  //   if (!params) return;
  //   const amount1 = 1;

  //   const amount2 = estimateLiquidToAdd(
  //     `${amount1}`,
  //     params.reserve0,
  //     params.reserve1
  //   );

  //   const addParams = await getAddLiquidParams(
  //     `${amount1}`,
  //     `${amount2}`,
  //     "0",
  //     "0",
  //     "0x1::aptos_coin::AptosCoin",
  //     "0x18394ec9e2a191e2470612a57547624b12254c9fbb552acaff6750237491d644::MAHA::MAHA",
  //     "9975"
  //   );

  //   if (!addParams) return;

  //   const response = await signAndSubmitTransaction({
  //     sender: account.address,
  //     data: {
  //       function: `${TESTNET_SWAP_CONTRACT_ADDRESS}::router::add_liquidity`,
  //       typeArguments: [...addParams.typeArguments],
  //       functionArguments: [...addParams.functionArguments],
  //     },
  //   });

  //   if (response) {
  //     const client = aptosClient();
  //     const txResult = await client.waitForTransaction({
  //       transactionHash: response.hash,
  //       options: {
  //         checkSuccess: true,
  //       },
  //     });

  //     txResult.success &&
  //       toast({
  //         title: "Successfully added liquidity!",
  //         description: (
  //           <Link
  //             target="_blank"
  //             href={`https://explorer.movementnetwork.xyz/txn/${txResult.hash}?network=bardock+testnet`}
  //           >
  //             Hash: {txResult.hash}
  //           </Link>
  //         ),
  //       });
  //   }
  // };

  // const removeLiquid = async () => {
  //   if (!account) {
  //     throw new Error("Wallet not connected");
  //   }

  //   const amount = "0.005";

  //   const removeParams = await getRemoveLiquidParams(
  //     convertAmountFromHumanReadableToOnChain(+amount, 8).toString(),
  //     "0",
  //     "0",
  //     "0x18394ec9e2a191e2470612a57547624b12254c9fbb552acaff6750237491d644::MAHA::MAHA",
  //     "0x1::aptos_coin::AptosCoin"
  //   );

  //   if (!removeParams) return;

  //   const response = await signAndSubmitTransaction({
  //     sender: account.address,
  //     data: {
  //       function: `${TESTNET_SWAP_CONTRACT_ADDRESS}::router::remove_liquidity`,
  //       typeArguments: [...removeParams.typeArguments],
  //       functionArguments: [...removeParams.functionArguments],
  //     },
  //   });

  //   if (response) {
  //     const client = aptosClient();
  //     const txResult = await client.waitForTransaction({
  //       transactionHash: response.hash,
  //       options: {
  //         checkSuccess: true,
  //       },
  //     });

  //     txResult.success &&
  //       toast({
  //         title: "Successfully removed liquidity!",
  //         description: (
  //           <Link
  //             target="_blank"
  //             href={`https://explorer.movementnetwork.xyz/txn/${txResult.hash}?network=bardock+testnet`}
  //           >
  //             Hash: {txResult.hash}
  //           </Link>
  //         ),
  //       });
  //   }
  // };

  // const swapHandler = async () => {
  //   if (!account) {
  //     throw new Error("Wallet not connected");
  //   }

  //   const params = await getSwapParams(
  //     "1",
  //     "0x1::aptos_coin::AptosCoin",
  //     "MOVE",
  //     "0x18394ec9e2a191e2470612a57547624b12254c9fbb552acaff6750237491d644::MAHA::MAHA",
  //     "MAHA"
  //   );

  //   if (!params) return;

  //   const response = await signAndSubmitTransaction({
  //     sender: account.address,
  //     data: {
  //       function: `${TESTNET_SWAP_CONTRACT_ADDRESS}::router::swap_exact_input`,
  //       typeArguments: [...params.typeArguments],
  //       functionArguments: [...params.functionArguments], // swap 1 move
  //     },
  //   });

  //   if (response) {
  //     const client = aptosClient();
  //     const txResult = await client.waitForTransaction({
  //       transactionHash: response.hash,
  //       options: {
  //         checkSuccess: true,
  //       },
  //     });

  //     txResult.success &&
  //       toast({
  //         title: "Successfully swapped!",
  //         description: (
  //           <Link
  //             target="_blank"
  //             href={`https://explorer.movementnetwork.xyz/txn/${txResult.hash}?network=bardock+testnet`}
  //           >
  //             Hash: {txResult.hash}
  //           </Link>
  //         ),
  //       });
  //   }
  // };

  const onOpenSwap = () => {
    setShowDialog(true);
    setSelectedTab("swap");
  };

  const onOpenAddLiquidity = () => {
    setShowDialog(true);
    setSelectedTab("add");
  };

  const onOpenRemoveLiquidity = () => {
    setShowDialog(true);
    setSelectedTab("remove");
  };

  useEffect(() => {
    const fetchPools = async () => {
      const url = `https://api.trackit-app.xyz/v1/yield/pools?chain=${selectedChain}&limit=${limitPool}`;
      try {
        const response = await axios.get(url);

        if (response.status === 200) {
          if (response.data) {
            setPoolData(() => [...response.data]);
          } else {
            console.log("API response data is empty.");
          }
        } else {
          console.log("Failed to fetch data: ", response.status);
        }
      } catch (error) {
        console.log("Error fetching pools:", error);
      }
    };

    fetchPools();
  }, [selectedChain]);

  return (
    <>
      <div className="md:mx-auto flex-1 max-w-5xl overflow-hidden">
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
                    <TableHead className="sticky left-0 z-20 bg-[#0e203f] min-w-32 text-gray-400 font-medium">
                      Pool
                    </TableHead>
                    <TableHead className="min-w-32 text-gray-400 font-medium">
                      TVL
                    </TableHead>
                    <TableHead className="min-w-32 text-gray-400 font-medium">
                      Volume (24h)
                    </TableHead>
                    <TableHead className="min-w-28 text-gray-400 font-medium">
                      Add liquid.
                    </TableHead>
                    <TableHead className="min-w-28 text-gray-400 font-medium">
                      Remove liquid.
                    </TableHead>
                    <TableHead className="min-w-28 text-gray-400 font-medium">
                      Swap
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {poolData.length === 0 &&
                    [...Array(1)].map((_, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-blue-900 transition-colors duration-150 group"
                      >
                        <TableCell className="sticky left-0 z-20 bg-[#0e203f] group-hover:bg-blue-900 transition-colors duration-150">
                          MOVE/ETH
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50 border border-bluesky"
                            onClick={onOpenAddLiquidity}
                          >
                            <PlusIcon />
                            <span className="text-[15px] font-medium">Add</span>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50 border border-bluesky"
                            onClick={onOpenRemoveLiquidity}
                          >
                            <MinusIcon />
                            <span className="text-[15px] font-medium">
                              Remove
                            </span>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50 border border-bluesky"
                            onClick={onOpenSwap}
                          >
                            <ArrowRightLeftIcon />
                            <span className="text-[15px] font-medium">
                              Swap
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {poolData.length > 0 &&
                    poolData.map((item, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-blue-900 transition-colors duration-150 group"
                      >
                        <TableCell className="sticky left-0 z-20 bg-[#0e203f] group-hover:bg-blue-900 transition-colors duration-150">
                          {item.pool?.symbol || "N/A"}
                        </TableCell>
                        <TableCell>
                          ${formatVolume(item.pool?.tvl) || "-"}
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50 border border-bluesky"
                            onClick={onOpenAddLiquidity}
                          >
                            <PlusIcon />
                            <span className="text-[15px] font-medium">Add</span>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50 border border-bluesky"
                            onClick={onOpenRemoveLiquidity}
                          >
                            <MinusIcon />
                            <span className="text-[15px] font-medium">
                              Remove
                            </span>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50 border border-bluesky"
                            onClick={onOpenSwap}
                          >
                            <ArrowRightLeftIcon />
                            <span className="text-[15px] font-medium">
                              Swap
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </>
            )}
          </Table>

          <ScrollBar orientation="horizontal" />
          <div className="hidden md:flex justify-center items-center p-4 w-full bg border-t border-[#132D5B]">
            {hasMore && (
              <Button
                variant="outline"
                size="lg"
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

      <OperationDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        initialTab={selectedTab}
      />

      {hasMore && (
        <Button
          variant="outline"
          size="lg"
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
