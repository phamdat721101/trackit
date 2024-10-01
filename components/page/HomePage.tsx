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

const dummy_gov = Array.from({ length: 3 }, () => {
    return {
        name: "ZKsync (ZK)",
        price: 0.14,
        change: 12.85,
    }
}).map((item, index) => <li key={index}>
    <Governance />
</li>);

const dummy_price = Array.from({ length: 3 }, () => {
    return {
        name: "ZKsync (ZK)",
        price: 0.14,
        change: 12.85,
    }
}).map((item, index) => <li key={index}>
    <Price />
</li>);

const dummy_news = Array.from({ length: 3 }, () => {
    return {
        name: "ZKsync (ZK)",
        price: 0.14,
        change: 12.85,
    }
}).map((item, index) => <li key={index}>
    <News />
</li>);

const HomePage = () => {
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
                            <List list={dummy_gov} />
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