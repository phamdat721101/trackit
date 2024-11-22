"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  TrendingUp,
  DollarSign,
  Users,
  ExternalLink,
} from "lucide-react";

interface Token {
  id: string;
  name: string;
  tickerSymbol: string;
  desc: string;
  image: string;
  creatorName: string;
  marketCapUSD: number;
  aptosUSDPrice: number;
  holderPercentage: string;
}

const initialTokens: Token[] = [
  {
    id: "2bd7e020-a768-11ef-9d7e-fb2b1f0dc49c",
    name: "Jere",
    tickerSymbol: "JERE",
    desc: "Jere - A revolutionary token in the Aptos ecosystem",
    image:
      "https://hatchy.s3.us-east-2.amazonaws.com/1732125132479-97e32a420f7503ea61c0cf1e1ab1a9d0.jpeg",
    creatorName: "metaphoricbrass",
    marketCapUSD: 302567.741135143,
    aptosUSDPrice: 3025.67741135143,
    holderPercentage: "1",
  },
  {
    id: "0f5aa1d0-a768-11ef-9d7e-fb2b1f0dc49c",
    name: "Kels",
    tickerSymbol: "KELS",
    desc: "Kels - Empowering decentralized finance on Aptos",
    image: "https://hatchy.s3.us-east-2.amazonaws.com/1732125084651-151.jpeg",
    creatorName: "unsatisfactoryrover",
    marketCapUSD: 302567.741135143,
    aptosUSDPrice: 3025.67741135143,
    holderPercentage: "1",
  },
];

export default function ModernDarkTokenList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tokens, setTokens] = useState<Token[]>(initialTokens);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = initialTokens.filter(
      (token) =>
        token.name.toLowerCase().includes(term) ||
        token.tickerSymbol.toLowerCase().includes(term)
    );
    setTokens(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Token Explorer
        </h1>
        <div className="relative mb-12 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-3 rounded-full border-2 border-gray-700 bg-gray-800 text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-300 ease-in-out"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tokens.map((token) => (
            <Card
              key={token.id}
              className="bg-gray-800 border-gray-700 overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
            >
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="text-2xl font-bold">{token.name}</span>
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold bg-white text-purple-600"
                  >
                    {token.tickerSymbol}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Image
                    src={token.image}
                    alt={token.name}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-purple-500 shadow-lg"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Created by
                    </p>
                    <p className="text-lg font-semibold text-gray-100">
                      {token.creatorName}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-6">{token.desc}</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <TrendingUp className="text-green-400 mr-3" size={24} />
                    <div>
                      <p className="text-xs text-gray-400">Market Cap</p>
                      <p className="font-semibold text-lg">
                        $
                        {token.marketCapUSD.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="text-blue-400 mr-3" size={24} />
                    <div>
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="font-semibold text-lg">
                        $
                        {token.aptosUSDPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-900 p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="text-purple-400 mr-2" size={18} />
                  <span className="text-sm font-medium text-gray-400">
                    {token.holderPercentage}% Holders
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="bg-transparent border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-300"
                >
                  View Details
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
