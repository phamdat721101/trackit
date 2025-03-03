import {
  Aptos,
  AptosConfig,
  InputEntryFunctionData,
  InputScriptData,
  Network,
} from "@aptos-labs/ts-sdk";
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

export const TESTNET_SWAP_CONTRACT_ADDRESS =
  "0xb75c5bbb44fcaaf0a0ec1299b890b665ec4fe229d0ef42cbfbaf8b59eda192cc";

// Initialize Aptos client
const config = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: "https://aptos.testnet.bardock.movementlabs.xyz/v1",
});
const aptos = new Aptos(config);

export function aptosClient() {
  return aptos;
}

// Function to fetch pair reserves from blockchain
async function getPairReserves(tokenA: Currency, tokenB: Currency) {
  try {
    const pairReservesAddress = `${TESTNET_SWAP_CONTRACT_ADDRESS}::swap::TokenPairReserve<${tokenA.address}, ${tokenB.address}>`;

    const resource = await aptos.getAccountResource({
      accountAddress: TESTNET_SWAP_CONTRACT_ADDRESS, // Swap contract address
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

export async function getSwapParams(
  addr1: string,
  symbol1: string,
  addr2: string,
  symbol2: string
) {
  const Move = new Coin(250, addr1, 8, symbol1);

  const token = new Coin(250, addr2, 8, symbol2);

  // Get pair
  const [pairState, pair] = await getPair(token, Move);

  if (pairState === PairState.EXISTS && pair) {
    // Create a route
    const route = new Route([pair], Move, token);

    // Create a trade with 1 Move
    const trade = Trade.exactIn(
      route,
      CurrencyAmount.fromRawAmount(Move, "100000000"), // 1 Move
      DEFAULT_FEE // 0.25% fee
    );

    // Execute the swap with 0.5% slippage tolerance
    const swapParams: any = Router.swapCallParameters(trade, {
      allowedSlippage: new Percent("50", "10000"), // 0.5%
    });

    // Log the swap parameters and reserves
    console.log("Swap Parameters:", {
      typeArguments: swapParams?.typeArguments,
      functionArguments: swapParams?.functionArguments,
      function: swapParams?.function,
    });

    return {
      typeArguments: swapParams?.typeArguments,
      functionArguments: swapParams?.functionArguments,
      function: swapParams?.function,
    };
  } else {
    console.log("Pair does not exist on blockchain");
    return null;
  }
}

export async function getAddLiquidParams(
  amount1: string,
  amount2: string,
  minAmount1: string,
  minAmount2: string,
  addr1: string,
  addr2: string,
  fee: string
) {
  const addLiquidParams = Router.addLiquidityParameters(
    amount1,
    amount2,
    minAmount1,
    minAmount2,
    addr1,
    addr2,
    fee
  );
  if (addLiquidParams) {
    return addLiquidParams;
  }
  return null;
}

export async function getRemoveLiquidParams(
  amountLP: string,
  minAmount1: string,
  minAmount2: string,
  addr1: string,
  addr2: string
) {
  const removeLiquidParams = Router.removeLiquidityParameters(
    amountLP,
    minAmount1,
    minAmount2,
    addr1,
    addr2
  );
  if (removeLiquidParams) {
    return removeLiquidParams;
  }
  return null;
}

// Example usage
async function main() {
  // Define tokens
  const Move = new Coin(250, "0x1::aptos_coin::AptosCoin", 8, "MOVE");

  const Maha = new Coin(
    250,
    "0x18394ec9e2a191e2470612a57547624b12254c9fbb552acaff6750237491d644::MAHA::MAHA",
    8,
    "MAHA"
  );

  // Get pair
  const [pairState, pair] = await getPair(Maha, Move);

  if (pairState === PairState.EXISTS && pair) {
    // Create a route
    const route = new Route([pair], Move, Maha);

    // Create a trade with 1 Move
    const trade = Trade.exactIn(
      route,
      CurrencyAmount.fromRawAmount(Move, "100000000"), // 1 Move
      DEFAULT_FEE // 0.25% fee
    );

    // Execute the swap with 0.5% slippage tolerance
    const swapParams: any = Router.swapCallParameters(trade, {
      allowedSlippage: new Percent("50", "10000"), // 0.5%
    });

    // Log the swap parameters and reserves
    console.log("Swap Parameters:", {
      typeArguments: swapParams?.typeArguments,
      functionArguments: swapParams?.functionArguments,
      function: swapParams?.function,
    });

    console.log("Pair Reserves:", {
      reserve0: pair.reserve0.toExact(),
      reserve1: pair.reserve1.toExact(),
      price0: pair.token0Price.toSignificant(6),
      price1: pair.token1Price.toSignificant(6),
    });
  } else {
    console.log("Pair does not exist on blockchain");
  }
}

main().catch(console.error);

// // Initialize Aptos client
// const config = new AptosConfig({
//   network: Network.CUSTOM,
//   fullnode: "https://mainnet.movementnetwork.xyz/v1",
// });
// const aptos = new Aptos(config);

// export function aptosClient() {
//   return aptos;
// }

// // Function to fetch pair reserves from blockchain
// async function getPairReserves(tokenA: Currency, tokenB: Currency) {
//   try {
//     const pairReservesAddress = Pair.getReservesAddress(tokenA, tokenB);

//     const resource = await aptos.getAccountResource({
//       accountAddress: SWAP_ADDRESS, // Swap contract address
//       resourceType: pairReservesAddress as any,
//     });

//     if (!resource) {
//       return null;
//     }

//     return {
//       reserve_x: (resource as any).reserve_x,
//       reserve_y: (resource as any).reserve_y,
//     };
//   } catch (error) {
//     console.error("Error fetching pair reserves:", error);
//     return null;
//   }
// }

// export async function getPair(
//   tokenA?: Currency,
//   tokenB?: Currency
// ): Promise<[PairState, Pair | null]> {
//   if (!tokenA || !tokenB || tokenA.equals(tokenB)) {
//     return [PairState.INVALID, null];
//   }

//   const reserves = await getPairReserves(tokenA, tokenB);

//   if (!reserves) {
//     return [PairState.NOT_EXISTS, null];
//   }

//   const [token0, token1] = Pair.sortToken(tokenA, tokenB);

//   return [
//     PairState.EXISTS,
//     new Pair(
//       CurrencyAmount.fromRawAmount(token0, reserves.reserve_x),
//       CurrencyAmount.fromRawAmount(token1, reserves.reserve_y)
//     ),
//   ];
// }

// // Example usage
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
