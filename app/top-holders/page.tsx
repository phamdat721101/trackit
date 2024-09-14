"use client";
import React, { useContext, useEffect, useState } from "react";
import { WalletName, useWallet } from '@aptos-labs/wallet-adapter-react';
import { fetchAssetBalance, fetchTokenMetadata, fetchTopHolder, HolderDataType, TokenMetadataType } from "@/utils/getData";
import { Pagination, Select } from "antd";
import type { PaginationProps, SelectProps } from 'antd';
import Link from "next/link";
import { getBlockchain } from "@/utils/chain";
import GlobalContext from "@/context/store";
import { tokenAptLists } from "@/constants/constants";

const top_holder_table_head = [
    'Rank',
    'Address',
    'Aptos Balance',
    'Percentage',
]

// const getDataList = (data: TokenMetadataType[]) => {
//     return data.map(item => {
//         return {
//             label: item.symbol,
//             value: item.asset_type,
//         }
//     })
// }

export default function HoldersPage() {
    const [topHolderData, setTopHolderData] = useState<HolderDataType[] | []>();
    const [tokenList, setTokenList] = useState<{ value: string, label: string, supply: number }[]>();
    const [currentToken, setCurrentToken] = useState<{ value: string, label: string, supply: number }>(
        {
            label: "APT",
            value: "0x1::aptos_coin::AptosCoin",
            supply: 1104566513.1
        }
    );
    const [supply, setSupply] = useState(1007589983.9);
    const [currentPage, setCurrentPage] = useState(1);
    const { chain } = useContext(GlobalContext);

    useEffect(() => {
        const blockchain = getBlockchain(chain);

        const fetchData = async () => {
            // Set token list for select-option
            if (!tokenList) {
                // const list = await fetchTokenMetadata();
                // const processList = getDataList(list);
                // setTokenList(processList);
                setTokenList(tokenAptLists);
            }

            if (chain === 'apt') {
                const holderData = await blockchain.fetchTopHolder(currentToken.value, 30, chain);
                setTopHolderData(holderData);
            }

            if (chain === 'sui' || chain === 'icp') {
                const holderData = await blockchain.fetchTopHolder("", 1, chain);
                setTopHolderData(holderData);
            }
        };

        fetchData();
    }, [currentToken, chain]);

    const searchHandler = (value: string) => {
        const token = tokenList?.filter(token => token.value === value);
        if (token) {
            setCurrentToken(token[0]);
        }
    }

    const changeHandler: PaginationProps['onChange'] = (page) => {
        setCurrentPage(page);
    };

    return (
        <main className="flex-grow px-5 sm:px-20 py-8">
            <section className="flex flex-col gap-6">
                <div className="text-2xl leading-normal font-semibold">Top Holders By Token Balance</div>
                <div>
                    <div className="relative flex flex-col gap-4 px-6 py-4 w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                        <div className="flex justify-between">
                            <h2 className="text-sm">TOP HOLDERS</h2>
                            <Select
                                showSearch
                                placeholder="Select a token"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={tokenList}
                                onChange={searchHandler}
                            />
                        </div>
                        <p className="text-sm text-[#aeb4bc]">A Total of {topHolderData ? topHolderData?.length : '--'} holders</p>
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden border-gray-200 shadow sm:rounded-lg">

                                    <table className="mb-2 w-full text-left table-auto min-w-max">
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
                                            {topHolderData?.length ? topHolderData?.slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10).map((token, index) => {
                                                return (
                                                    <tr key={index} className="transition-colors duration-200 hover:bg-sky-50">
                                                        <td className="p-4 border-b border-slate-200">
                                                            <p className="block text-sm">
                                                                {(currentPage - 1) * 10 + index + 1}
                                                            </p>
                                                        </td>
                                                        <td className="p-4 border-b border-slate-200">
                                                            <p className="block text-sm">
                                                                <Link href={`/account/${chain === "apt" ? token.owner_address : token.address}`}>{chain === "apt" ? token.owner_address : token.address}</Link>
                                                            </p>
                                                        </td>
                                                        <td className="p-4 border-b border-slate-200">
                                                            <p className="block text-sm">
                                                                {chain === "apt" ? (Number(token.amount / (currentToken.value === "0x1::aptos_coin::AptosCoin" ? 100000000 : 1000000)).toFixed(2)) : token.amount}{chain === "apt" && ` ${token.metadata.symbol}`}
                                                            </p>
                                                        </td>
                                                        <td className="p-4 border-b border-slate-200">
                                                            {chain === "apt" ? ((Number(token.amount / (currentToken.value === "0x1::aptos_coin::AptosCoin" ? 100000000 : 1000000)) / currentToken.supply * 100).toFixed(4)) : token.percentage}%
                                                        </td>
                                                    </tr>
                                                )
                                            }) : (
                                                <tr>
                                                    <td colSpan={top_holder_table_head.length} className="text-center py-4 border-b border-slate-200">
                                                        No Data
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Pagination align="center" current={currentPage} onChange={changeHandler} total={topHolderData?.length} pageSize={10} />
                    </div>
                </div>
            </section>
        </main >
    );
}
