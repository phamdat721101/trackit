import { useEffect, useState } from "react";

interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  price: number;
  icon: string;
  address: string;
}

// Mock token data
const list: Token[] = [
  {
    id: "move",
    name: "Movement",
    symbol: "MOVE",
    balance: "0",
    price: 0.5,
    icon: "/movement-mark-full-color.png",
    address: "0x1::aptos_coin::AptosCoin",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    balance: "0",
    price: 2000,
    icon: "/eth-logo.png",
    address:
      "0x18394ec9e2a191e2470612a57547624b12254c9fbb552acaff6750237491d644::MAHA::MAHA",
  },
  {
    id: "aptos",
    name: "Aptos",
    symbol: "APT",
    balance: "0",
    price: 5,
    icon: "/aptos_mark.svg",
    address: "0x1::aptos_coin::AptosCoin",
  },
];

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>(list);
  const [loading, setLoading] = useState(true);

  const fetchTokens = async () => {
    try {
      setLoading(true);

      // Call api to fetch tokens
      const response = await fetch("YOUR_TOKEN_LIST_API");
      if (response.ok) {
        const data = await response.json();
        setTokens(data);
      }
    } catch (error) {
      console.log("Failed to fetch tokens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return { tokens, loading, refreshTokens: fetchTokens };
}
