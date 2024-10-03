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
import Price from "../Price";
import News from "../News";
import TrackitSearch from "../TrackitSearch";
import FilterForm from "../FilterForm";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from 'axios';
import { GovernanceInfo } from "@/lib/interface";

const dummy_airdrop = [
    {
        coin_type: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH",
        name: "Wrapped Ether",
        price: 2500,
        change: 2.85,
        transaction_timestamp: "2024-09-30T09:16:01",
        transaction_version_created: 1740927519,
    },
    {
        coin_type: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
        name: "USD Coin",
        price: 1,
        change: 0.05,
        transaction_timestamp: "2024-09-30T09:13:22",
        transaction_version_created: 1740922012,
    },
    {
        coin_type: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDD",
        name: "Decentralized USD",
        price: 1,
        change: 0.05,
        transaction_timestamp: "2024-09-21T06:54:28",
        transaction_version_created: 1713889549,
    },
    {
        coin_type: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WBTC",
        name: "Wrapped BTC",
        price: 64000,
        change: 1.05,
        transaction_timestamp: "2024-09-30T01:55:06",
        transaction_version_created: 1740033631,
    },
    {
        coin_type: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH",
        name: "Wrapped Ether",
        price: 2500,
        change: 2.85,
        transaction_timestamp: "2024-09-30T09:16:01",
        transaction_version_created: 1740927519,
    },
    {
        coin_type: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
        name: "USD Coin",
        price: 1,
        change: 0.05,
        transaction_timestamp: "2024-09-30T09:13:22",
        transaction_version_created: 1740922012,
    },
    {
        coin_type: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDD",
        name: "Decentralized USD",
        price: 1,
        change: 0.05,
        transaction_timestamp: "2024-09-21T06:54:28",
        transaction_version_created: 1713889549,
    },
    {
        coin_type: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WBTC",
        name: "Wrapped BTC",
        price: 64000,
        change: 1.05,
        transaction_timestamp: "2024-09-30T01:55:06",
        transaction_version_created: 1740033631,
    }
].map((item, index) => <li key={index}>
    <Pool info={item} />
</li>);



const dummy_price = Array.from({ length: 3 }, () => {
    return {
        name: "ZKsync",
        symbol: "ZK",
        price: 0.14,
        change: 12.85,
    }
}).map((item, index) => <li key={index}>
    <Price info={item} />
</li>);

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

        fetchGovernanceVoteData();
    }, []);

    return (
        <main className="px-3 py-4">
            <div className="max-w-[2400px] mx-auto grid gap-4 grid-cols-8 lg:grid-cols-12">
                <div className="col-span-2 lg:col-span-3 hidden lg:block">
                    <Panel title="Coins Created" height="h-[490px]">
                        <List list={dummy_airdrop} />
                    </Panel>
                </div>
                <div className="col-span-8 lg:col-span-6 grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <Panel title="News" height="h-[235px]">
                            <List list={dummy_news} />
                        </Panel>
                        <Panel title="Prices" height="h-[235px]">
                            <List list={dummy_price} />
                        </Panel>
                    </div>
                    <div className="space-y-4">
                        <Panel title="Governance Vote" height="h-[235px]">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">Loading...</div>
                            ) : error ? (
                                <div className="text-red-500">{error}</div>
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