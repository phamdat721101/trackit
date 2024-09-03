"use client";
import React, { useEffect, useState } from "react";
import { WalletName, useWallet } from '@aptos-labs/wallet-adapter-react';
import { fetchAssetBalance, fetchTopHolder } from "@/utils/getData";
import { Pagination } from "antd";
import type { PaginationProps } from 'antd';
import Link from "next/link";

interface HolderDataType {
    amount: number;
    owner_address: string;
    asset_type: string;
    is_frozen: boolean;
    is_primary: boolean;
    last_transaction_timestamp: string;
    last_transaction_version: number;
    storage_id: string;
    token_standard: string;
    metadata: {
        icon_uri: string | null;
        maximum_v2: string | null;
        project_uri: string | null;
        supply_aggregator_table_handle_v1: string | null;
        supply_aggregator_table_key_v1: string | null;
        supply_v2: string | null;
        name: string | null;
        symbol: string | null;
        token_standard: string | null;
        last_transaction_version: number
        last_transaction_timestamp: string | null;
        decimals: number;
        creator_address: string | null;
        asset_type: string | null;
    }
}

const top_holder_table_head = [
    'Rank',
    'Address',
    'Aptos Balance',
    'Percentage',
]

export default function HoldersPage() {
    const [topHolderData, setTopHolderData] = useState<HolderDataType[] | []>();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            const holderData = await fetchTopHolder(10);
            setTopHolderData(holderData);
        };

        fetchData();
    }, []);

    const onChange: PaginationProps['onChange'] = (page) => {
        console.log(page);
        setCurrentPage(page);
    };

    return (
        <main className="flex-grow px-20 py-8">
            <section className="flex flex-col gap-6">
                <div className="text-2xl leading-normal font-semibold">Top Holders By APT Balance</div>
                <div>
                    <div className="relative flex flex-col gap-4 px-6 py-4 w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                        <h2 className="text-sm">TOP HOLDERS</h2>
                        <p className="text-sm	text-[#aeb4bc]">A Total of {topHolderData?.length} holders</p>
                        <table className="w-full text-left table-auto min-w-max">
                            <thead>
                                <tr>
                                    {top_holder_table_head.map((head, index) => (
                                        <th key={index} className="p-4 border-b border-slate-300 bg-customBlue">
                                            <p className="block text-sm font-normal leading-none text-white">
                                                {head}
                                            </p>
                                        </th>

                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {topHolderData?.length ? topHolderData?.map((token, index) => {
                                    return (
                                        <tr key={index} className="">
                                            <td className="p-4 border-b border-slate-200">
                                                <p className="block text-sm">
                                                    {index + 1}
                                                </p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                                <p className="block text-sm">
                                                    <Link href={`/account/${token.owner_address}`}>{token.owner_address}</Link>
                                                </p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                                <p className="block text-sm">
                                                    {Number(token.amount / 100000000).toFixed(2)} APT
                                                </p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={top_holder_table_head.length} className="text-center py-4 border-b border-slate-200">
                                            Loading...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* <Pagination align="center" current={currentPage} onChange={onChange} total={50} /> */}
                    </div>
                </div>
            </section>
        </main >
    );
}
