"use client";
import Panel from "../Panel";
import Pool from "../Pool";
import React, { useState, useEffect } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import List from "../List";
import Governance from "../Gov";
import { Search, X, Maximize2, DollarSign, BarChart2, TrendingUp, Droplet } from 'lucide-react'
import Indicator from "../Indicator";
import News from "../News";
import TrackitSearch from "../TrackitSearch";
import FilterForm from "../FilterForm";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from 'axios';
import { GovernanceInfo, TokenSentimentInfo, TokenIndicatorInfo } from "@/lib/interface";

const dummy_news = Array.from({ length: 3 }, () => {
    return {
        author: "CoinDesk",
        is_positive: false,
        time_created: "1h 18m ago",
        content: "",
    }
}).map((item, index) => <li key={index}>
    <News info={item} />
</li>);

const renderList = (items: any[], Component: React.ComponentType<{ info: any }>) => {
    return items.map((item, index) => (
        <li key={index}>
            <Component info={item} />
        </li>
    ));
};

const HomePage = () => {
    const { connect, disconnect, account, connected } = useWallet();
    const [governanceVoteData, setGovernanceVoteData] = useState<GovernanceInfo[]>([]);
    const [tokenSentimentData, setTokenSentimentData] = useState<TokenSentimentInfo[]>([]);
    const [tokenIndicatorData, setTokenIndicatorData] = useState<TokenIndicatorInfo[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGovernanceVoteData = async () => {
            try {
                const response = await axios.get('http://localhost:3003/api/apt-gov');
                const formattedData: GovernanceInfo[] = response.data.map((item: any) => ({
                    proposal_id: item.proposal_id,
                    num_votes: item.num_votes,
                    should_pass: item.should_pass,
                    staking_pool_address: item.staking_pool_address,
                    transaction_timestamp: item.transaction_timestamp,
                    transaction_version: item.transaction_version,
                    voter_address: item.voter_address,
                }));
                setGovernanceVoteData(formattedData);
            } catch (err) {
                setError('Failed to fetch governance data');
                console.error('Error fetching governance data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const getTokenSentiment = async() =>{
            try {
                const response = await axios.get('http://localhost:3003/api/token-sentiment');
                console.log("Token sentiment: ", response.data)
                const formattedData: TokenSentimentInfo[] = response.data.map((item: any) => ({
                    name: item.name,
                    price: item.price,
                    change_24h: item.change_24h,
                    transaction_timestamp: Date.now(),
                    sentiment: item.sentiment,
                    description: item.description,
                }));
                console.log("Token format: ", formattedData)
                setTokenSentimentData(formattedData);
            } catch (err) {
                setError('Failed to fetch token sentiment data');
                console.error('Error fetching token sentiment data:', err);
            } finally {
                setIsLoading(false);
            }
        }

        const getTokenIndicator = async() =>{
            try {
                const response = await axios.get('http://localhost:3003/api/token-indicator');
                const formattedData: TokenIndicatorInfo[] = response.data.map((item: any) => ({
                    name: item.name,
                    symbol: item.symbol,
                    price: item.price,
                    volume_24h: item.volume_24h,
                    rsi: item.rsi,
                    moving_average_50d: item.moving_average_50d,
                    moving_average_200d: item.moving_average_200d,
                    signal: item.signal,
                    description: item.description,
                }));
                console.log("Token format: ", formattedData)
                setTokenIndicatorData(formattedData);
            } catch (err) {
                setError('Failed to fetch token indicator data');
                console.error('Error fetching token indicator data:', err);
            } finally {
                setIsLoading(false);
            }
        }
        
        
        fetchGovernanceVoteData();
        getTokenSentiment();
        getTokenIndicator()
    }, []);

    return (
        <main className="px-3 py-4">
            <div className="max-w-[2400px] mx-auto grid gap-4 grid-cols-8 lg:grid-cols-12">
                <div className="col-span-2 lg:col-span-3 hidden lg:block">
                    <Panel title="Token Sentiment" height="h-[490px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">Loading...</div>
                            ) : error ? (
                                <div className="text-red-500">{error}</div>
                            ) : (
                                <List list={renderList(tokenSentimentData, Pool)} />
                            )}
                    </Panel>
                </div>
                <div className="col-span-8 lg:col-span-6 grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <Panel title="Analysis" height="h-[235px]">
                            <List list={dummy_news} />
                        </Panel>
                        <Panel title="Token Indicator" height="h-[235px]">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">Loading...</div>
                                ) : error ? (
                                    <div className="text-red-500">{error}</div>
                                ) : (
                                    <List list={renderList(tokenIndicatorData, Indicator)} />
                            )}
                        </Panel>
                    </div>
                    <div className="space-y-4">
                        <Panel title="Proposal Effects" height="h-[235px]">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">Loading...</div>
                            ) : error ? (
                                <div className="text-gray-50">{error}</div>
                            ) : (
                                <List list={renderList(governanceVoteData, Governance)} />
                            )}
                        </Panel>
                        <Panel title="TrackItSearch" height="h-[235px]">
                            <TrackitSearch />
                        </Panel>
                    </div>
                </div>
                <div className="col-span-2 lg:col-span-3 hidden lg:block">
                    {/* <Panel title="Claimable Airdrops" className="max-h-[490px]">
                        <List list={dummy_airdrop} />
                    </Panel> */}
                    <FilterForm />
                </div>
            </div>
        </main>
    );
}

export default HomePage;