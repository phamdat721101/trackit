export interface GovernanceInfo {
  proposal_id: string;
  num_votes: number;
  should_pass: boolean;
  staking_pool_address: string;
  transaction_timestamp: string;
  transaction_version: number;
  voter_address: string;
}

export interface TokenSentimentInfo {
  name: string;
  price: number;
  change_24h: number;
  transaction_timestamp: number;
  sentiment: string;
  description: string;
}

export interface TokenIndicatorInfo {
  name: string;
  symbol: string;
  price: number;
  volume_24h: number;
  rsi: number;
  moving_average_50d: number;
  moving_average_200d: number;
  signal: string;
  description: string;
}

export interface TokenInfo {
  id: string;
  name: string;
  tickerSymbol: string;
  desc: string | null;
  creator: string;
  mintAddr: string;
  image: string;
  twitter: string | null;
  telegram: string | null;
  website: string | null;
  status: string;
  cdate: string;
  creatorName: string;
  creatorWalletAddr: string;
  creatorAvatar: string | null;
  replies: number;
  marketCapUSD: number;
  trades: TradeInfo[];
  aptosUSDPrice: number;
  holderPercentage: string;
  bondinCurvepercentage: number;
  seeded: string | null;
}

export interface TradeInfo {
  side: string;
  count: string;
  volume: string;
}

export interface TxnInfo {
  tokenMint: string;
  txnHash: string;
  side: string;
  username: string;
  userWalletAddr: string;
  userAvatar: string | null;
  xAmt: string;
  yAmt: string;
  gas: null;
  timestamp: string;
  status: string;
}

export interface PoolInfo {
  token: string;
  apr: string;
  unit: string;
  protocol: string;
}

export interface SwapPool {
  id: number;
  attributes: {
    title: string;
    description_en: string;
    description_zh: string;
    link: string;
    apy: string | null;
    category: string;
    vToken: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    apy_var: string | null;
    logo: {
      data: {
        id: number;
        attributes: {
          name: string;
          alternativeText: string | null;
          caption: string | null;
          width: number;
          height: number;
          formats: string | null;
          hash: string;
          ext: string;
          mime: string;
          size: number;
          url: string;
          previewUrl: string | null;
          provider: string;
          provider_metadata: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
    };
  };
}
