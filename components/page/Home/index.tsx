"use client";
import {
  GovernanceInfo,
  TokenIndicatorInfo,
  TokenSentimentInfo,
} from "../../../types/interface";
import Governance from "./Governance";
import Indicator from "./Indicator";
import List, { renderList } from "../List";
import News from "./News";
import Panel from "./Panel";
import Pool from "./Pool";
import { useEffect, useState } from "react";
import { API_URL } from "../../../constants/constants";
import axios from "axios";

const dummy_news = [
  {
    author: "Lido",
    is_positive: false,
    time_created: "1h 29m ago",
    content:
      "Introducing the Community Staking Module Early Adoption Program: A Unique Opportunity for Solo Stakers 🌐",
  },
  {
    author: "The Block",
    is_positive: false,
    time_created: "1h 31m ago",
    content:
      "Bitwise revamps three of its crypto futures ETFs to rotate in Treasuries in an effort to curb volatility",
  },
  {
    author: "CoinDesk",
    is_positive: false,
    time_created: "13h 18m ago",
    content:
      "Canada's CBDC Departure Risks Web3's Interoperable Future. A lack of interoperability poses an existential threat to central bank digital currencies, as it does to Web3 itself, says Temujin Louie, CEO of Wanchain.",
  },
];

export default function HomePage() {
  const [governanceVoteData, setGovernanceVoteData] = useState<
    GovernanceInfo[]
  >([]);
  const [tokenSentimentData, setTokenSentimentData] = useState<
    TokenSentimentInfo[]
  >([]);
  const [tokenIndicatorData, setTokenIndicatorData] = useState<
    TokenIndicatorInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGovernanceVoteData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/apt-gov`);
        const formattedData: GovernanceInfo[] = response.data.map(
          (item: GovernanceInfo) => ({
            proposal_id: item.proposal_id,
            num_votes: item.num_votes,
            should_pass: item.should_pass,
            staking_pool_address: item.staking_pool_address,
            transaction_timestamp: item.transaction_timestamp,
            transaction_version: item.transaction_version,
            voter_address: item.voter_address,
          })
        );
        setGovernanceVoteData(formattedData);
      } catch (err) {
        setError("Failed to fetch governance data");
      } finally {
        setIsLoading(false);
      }
    };

    const getTokenSentiment = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/token-sentiment`);
        console.log("Token sentiment: ", response.data);
        const formattedData: TokenSentimentInfo[] = response.data.map(
          (item: TokenSentimentInfo) => ({
            name: item.name,
            price: item.price,
            change_24h: item.change_24h,
            transaction_timestamp: Date.now(),
            sentiment: item.sentiment,
            description: item.description,
          })
        );
        console.log("Token format: ", formattedData);
        setTokenSentimentData(formattedData);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    const getTokenIndicator = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/token-indicator`);
        const formattedData: TokenIndicatorInfo[] = response.data.map(
          (item: TokenIndicatorInfo) => ({
            name: item.name,
            symbol: item.symbol,
            price: item.price,
            volume_24h: item.volume_24h,
            rsi: item.rsi,
            moving_average_50d: item.moving_average_50d,
            moving_average_200d: item.moving_average_200d,
            signal: item.signal,
            description: item.description,
          })
        );
        console.log("Token format: ", formattedData);
        setTokenIndicatorData(formattedData);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchGovernanceVoteData();
    getTokenSentiment();
    getTokenIndicator();
  }, []);

  return (
    <main className="p-3 grow">
      <div className="max-w-[2400px] mx-auto grid gap-4 grid-cols-8 lg:grid-cols-12">
        <div className="col-span-8 lg:col-span-3 lg:block">
          <Panel title="Token Sentiment" height="h-[445px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-50">
                Loading...
              </div>
            ) : error ? (
              <div className="flex items-center justify-center text-red-500">
                {error}
              </div>
            ) : (
              <List list={renderList(tokenSentimentData, Pool)} />
            )}
          </Panel>
        </div>
        <div className="col-span-8 lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <Panel title="Analysis" height="h-[190px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-gray-50">
                  Loading...
                </div>
              ) : error ? (
                <div className="flex items-center justify-center text-red-500">
                  {error}
                </div>
              ) : (
                <List list={renderList(dummy_news, News)} />
              )}
            </Panel>
            <Panel title="Token Indicator" height="h-[191px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-gray-50">
                  Loading...
                </div>
              ) : error ? (
                <div className="flex items-center justify-center text-red-500">
                  {error}
                </div>
              ) : (
                <List list={renderList(tokenIndicatorData, Indicator)} />
              )}
            </Panel>
          </div>
          <div className="space-y-4 ">
            <Panel title="Proposal Effects" height="h-[445px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-gray-50">
                  Loading...
                </div>
              ) : error ? (
                <div className="flex items-center justify-center text-red-500">
                  {error}
                </div>
              ) : (
                <List list={renderList(governanceVoteData, Governance)} />
              )}
            </Panel>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-3 hidden lg:block"></div>
      </div>
    </main>
  );
}
