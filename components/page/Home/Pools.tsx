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
import { useState } from "react";
import { LoadingRow } from "./CryptoTable";
import { aptosClient } from "../../warpgate/index";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { SWAP_ADDRESS } from "warpgate-swap-sdk";

export default function Pools() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { account, signAndSubmitTransaction } = useWallet();

  const addLiquid = async () => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${SWAP_ADDRESS}::router::add_liquidity`,
        typeArguments: [
          "0xa9e39026c4a793078bec2dda05c0d46a1d961145d3d666eb63d150fdf44b6ccf::rushi_coin::RushiCoin",
          "0xa9e39026c4a793078bec2dda05c0d46a1d961145d3d666eb63d150fdf44b6ccf::coop_coin::CoopCoin",
        ],
        functionArguments: [1, 1, 1, 1, 1],
      },
    });

    const txResult = await aptosClient().waitForTransaction(response.hash);
    console.log("Add liquid. hash: ", txResult);
  };

  const removeLiquid = async () => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${SWAP_ADDRESS}::router::remove_liquidity`,
        typeArguments: [
          "0xa9e39026c4a793078bec2dda05c0d46a1d961145d3d666eb63d150fdf44b6ccf::rushi_coin::RushiCoin",
          "0xa9e39026c4a793078bec2dda05c0d46a1d961145d3d666eb63d150fdf44b6ccf::coop_coin::CoopCoin",
        ],
        functionArguments: [1, 1, 1],
      },
    });

    const txResult = await aptosClient().waitForTransaction(response.hash);
    console.log("Add liquid. hash: ", txResult);
  };

  const swapHandler = async () => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${SWAP_ADDRESS}::router::swap_exact_input`,
        typeArguments: [
          "0xa9e39026c4a793078bec2dda05c0d46a1d961145d3d666eb63d150fdf44b6ccf::rushi_coin::RushiCoin",
          "0xa9e39026c4a793078bec2dda05c0d46a1d961145d3d666eb63d150fdf44b6ccf::coop_coin::CoopCoin",
        ],
        functionArguments: [1, 1],
      },
    });
    const txResult = await aptosClient().waitForTransaction(response.hash);
    console.log("Swap hash: ", txResult);
  };

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
                    <TableHead className="sticky left-0 z-20 bg-[#0e203f] min-w-52 text-gray-400 font-medium">
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
                  {[...Array(1)].map((_, index) => (
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
                          onClick={addLiquid}
                        >
                          <PlusIcon />
                          <span className="text-[15px] font-medium">Add</span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="px-5 flex items-center bg-transparent hover:bg-bluesky text-[#8899A8] hover:text-gray-50 border border-bluesky"
                          onClick={removeLiquid}
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
                          onClick={swapHandler}
                        >
                          <ArrowRightLeftIcon />
                          <span className="text-[15px] font-medium">Swap</span>
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
