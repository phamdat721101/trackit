import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import {
  ChainId,
  Coin,
  Pair,
  Route,
  Trade,
  Router,
  Currency,
  SWAP_ADDRESS,
  Percent,
  CurrencyAmount,
  DEFAULT_FEE,
} from "warpgate-swap-sdk";

// Enum to track pair states
export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

// Initialize Aptos client
const config = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: "https://mainnet.movementnetwork.xyz/v1",
});
const aptos = new Aptos(config);

export function aptosClient() {
  return aptos;
}

// Function to fetch pair reserves from blockchain
async function getPairReserves(tokenA: Currency, tokenB: Currency) {
  try {
    const pairReservesAddress = Pair.getReservesAddress(tokenA, tokenB);

    const resource = await aptos.getAccountResource({
      accountAddress: SWAP_ADDRESS, // Swap contract address
      resourceType: pairReservesAddress as any,
    });

    if (!resource) {
      return null;
    }

    return {
      reserve_x: (resource as any).reserve_x,
      reserve_y: (resource as any).reserve_y,
    };
  } catch (error) {
    console.error("Error fetching pair reserves:", error);
    return null;
  }
}

export async function getPair(
  tokenA?: Currency,
  tokenB?: Currency
): Promise<[PairState, Pair | null]> {
  if (!tokenA || !tokenB || tokenA.equals(tokenB)) {
    return [PairState.INVALID, null];
  }

  const reserves = await getPairReserves(tokenA, tokenB);

  if (!reserves) {
    return [PairState.NOT_EXISTS, null];
  }

  const [token0, token1] = Pair.sortToken(tokenA, tokenB);

  return [
    PairState.EXISTS,
    new Pair(
      CurrencyAmount.fromRawAmount(token0, reserves.reserve_x),
      CurrencyAmount.fromRawAmount(token1, reserves.reserve_y)
    ),
  ];
}

// Example usage
// async function main() {
//   // Define tokens
//   const RushiCoin = new Coin(
//     ChainId.MOVE_MAINNET,
//     "0xa9e39026c4a793078bec2dda05c0d46a1d961145d3d666eb63d150fdf44b6ccf::rushi_coin::RushiCoin",
//     8,
//     "RushiCoin"
//   );

//   const CoopCoin = new Coin(
//     ChainId.MOVE_MAINNET,
//     "0xa9e39026c4a793078bec2dda05c0d46a1d961145d3d666eb63d150fdf44b6ccf::coop_coin::CoopCoin",
//     8,
//     "CoopCoin"
//   );

//   // Get pair
//   const [pairState, pair] = await getPair(RushiCoin, CoopCoin);

//   if (pairState === PairState.EXISTS && pair) {
//     // Create a route
//     const route = new Route([pair], RushiCoin, CoopCoin);

//     // Create a trade with 1 RushiCoin
//     const trade = Trade.exactIn(
//       route,
//       CurrencyAmount.fromRawAmount(RushiCoin, "100000000"), // 1 RushiCoin
//       DEFAULT_FEE // 0.25% fee
//     );

//     // Execute the swap with 0.5% slippage tolerance
//     const swapParams: any = Router.swapCallParameters(trade, {
//       allowedSlippage: new Percent("50", "10000"), // 0.5%
//     });

//     // Log the swap parameters and reserves
//     console.log("Swap Parameters:", {
//       typeArguments: swapParams?.typeArguments,
//       functionArguments: swapParams?.functionArguments,
//       function: swapParams?.function,
//     });

//     console.log("Pair Reserves:", {
//       reserve0: pair.reserve0.toExact(),
//       reserve1: pair.reserve1.toExact(),
//       price0: pair.token0Price.toSignificant(6),
//       price1: pair.token1Price.toSignificant(6),
//     });
//   } else {
//     console.log("Pair does not exist on blockchain");
//   }
// }

// main().catch(console.error);
