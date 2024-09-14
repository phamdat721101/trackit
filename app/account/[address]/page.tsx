'use client'

import GlobalContext from '@/context/store';
import { getBlockchain } from '@/utils/chain';
import { fetchTransactionByAccount, fetchAssetBalance, BalanceDataType } from '@/utils/getData';
import { Pagination, PaginationProps } from 'antd';
import { useParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react';

interface TableAssetDataType {
    name: string;
    symbol: string;
    quantity: number;
    price: string;
    change24h: string;
    value: string;
}

interface TableTransactionDataType {
    version: string;
    block: string;
    hash: string;
    shortHash: string;
    timestamp: string;
    date: string;
    from: string;
    to: string;
    shortFrom: string;
    shortTo: string;
    amount: number;
    fee: number;
    func: string;
}

const table_head = [
    'Version #',
    'Hash',
    'Age',
    'Sender',
    'Amount',
];

const icp_sui_table_head = [
    'Block',
    'Hash',
    'Date',
    'From',
    'To',
    'Function',
    'Fee',
    'Amount',
];

function timestampToString(timestamp: string) {
    const date = new Date(+timestamp / 1000);
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const
        month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

const getTransactionTableData = (data: any[]) => {
    // This function will transform the data and potentially fetch additional info
    return data.reverse().map((item) => {
        const version: string = item.version || '';
        const block: string = item.block || ''
        const hash: string = item.hash;
        const shortHash: string = `${hash.slice(0, 5)}...${hash.slice(-6)}`;
        const timestamp: string = item.timestamp;
        const date = timestampToString(timestamp);
        const from: string = item.sender || item.from;
        const shortFrom: string = from ? `${from.slice(0, 4)}...${from.slice(-7)}` : '';
        const to: string = item.to || '';
        const shortTo: string = to ? `${to.slice(0, 4)}...${to.slice(-7)}` : '';
        let amount: number = 0;
        if (item.payload) {
            amount = +(item.payload.arguments[1]) / 100000000;
        }
        else if (item.amount) {
            amount = item.amount;
        }
        const fee: number = item.fee || 0;
        const func: string = item.function || '';

        return {
            version,
            block,
            hash,
            shortHash,
            timestamp,
            date,
            from,
            shortFrom,
            to,
            shortTo,
            amount,
            fee,
            func,
        };
    });
};

const getTableData = (data: BalanceDataType[]) => {
    // This function will transform the balance data and potentially fetch additional info
    return data.map((item) => {
        // Extract relevant information from each balance item
        const name = item.metadata?.name;
        const symbol = item.metadata?.symbol;
        const amount = item.amount;
        const price = '';
        const percentChangeFor24h = '';
        const value = '';

        return {
            name,
            symbol,
            amount,
            price,
            percentChangeFor24h,
            value,
        };
    });
};

export default function AccountPage() {
    const params = useParams<{ address: string }>();
    const [aptBalance, setAptBalance] = useState<number>();
    const [transactionData, setTransactionData] = useState<TableTransactionDataType[] | []>();
    const { chain } = useContext(GlobalContext);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const blockchain = getBlockchain(chain);

        const fetchData = async () => {
            if (params.address) {
                if (chain === 'apt') {
                    const assetData = await blockchain.fetchAssetBalance(params.address);
                    const processedAssetData = getTableData(assetData);
                    const assetBalance = processedAssetData.filter(token => token.symbol === 'APT');

                    const transactionData = await blockchain.fetchTransactionByAccount(params.address, 100);
                    const processedData = getTransactionTableData(transactionData);

                    setTransactionData(processedData);
                    setAptBalance(assetBalance[0].amount);
                }

                if (chain === 'sui' || chain === 'icp') {
                    const assetData: TableAssetDataType[] = await blockchain.fetchAssetBalance(params.address);
                    let assetBalance: TableAssetDataType[];
                    if (chain === 'sui') {
                        assetBalance = assetData.filter(token => token.symbol === 'SUI');
                    } else {
                        assetBalance = assetData.filter(token => token.symbol === 'ICP');
                    }
                    assetBalance.length > 0 ? setAptBalance(assetBalance[0].quantity) : setAptBalance(0);

                    const transactionData = await blockchain.fetchTransactionByAccount(params.address, 10);
                    const processedData = getTransactionTableData(transactionData);
                    setTransactionData(processedData);
                }
            }
        }

        fetchData();
        setCurrentPage(1);
    }, [params.address, chain]);

    const changeHandler: PaginationProps['onChange'] = (page) => {
        setCurrentPage(page);
    };

    return (
        <main className="flex-grow px-5 sm:px-20 py-8">
            <section className="flex flex-col gap-6">
                <div>
                    <div className="text-2xl leading-normal font-semibold">Account</div>
                    <div className="text-ellipsis overflow-hidden">{params.address}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="mb-1 text-xs leading-normal font-bold text-[#76808f]">Aptos Balance</h2>
                    <div className="flex justify-between items-end">
                        <p className="text-xl font-semibold leading-6	">
                            {chain === "apt" && (aptBalance ? `${aptBalance / 100000000} APT` : '-- APT')}
                            {chain === "sui" && (aptBalance ? `${aptBalance} SUI` : '-- SUI')}
                            {chain === "icp" && (aptBalance ? `${aptBalance} ICP` : '-- ICP')}
                        </p>
                        {/* <p className="text-xs ">5 $</p> */}
                    </div>
                </div>
                <div>
                    <div className="relative flex flex-col gap-4 px-6 py-4 w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                        <h2 className="text-sm">TRANSACTIONS</h2>
                        <p className="text-sm	text-[#aeb4bc]">Latest {transactionData?.length} transactions</p>
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden border-gray-200 shadow sm:rounded-lg">

                                    <table className="mb-2 w-full text-left table-auto min-w-max">
                                        <thead>
                                            <tr>
                                                {chain === "apt" && table_head.map((head, index) => (

                                                    <th key={index} className="p-4 border-b border-slate-300 bg-customBlue">
                                                        <p className="block text-sm font-normal leading-none text-white">
                                                            {head}
                                                        </p>
                                                    </th>

                                                ))}
                                                {chain !== "apt" && icp_sui_table_head.map((head, index) => (

                                                    <th key={index} className="p-4 border-b border-slate-300 bg-customBlue">
                                                        <p className="block text-sm font-normal leading-none text-white">
                                                            {head}
                                                        </p>
                                                    </th>

                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactionData ? transactionData?.slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10).map((item, index) => {
                                                return (
                                                    <tr key={index} className="transition-colors duration-200 hover:bg-sky-50">
                                                        <td className="p-4 border-b border-slate-200">
                                                            <p className="block text-sm">
                                                                {chain === "apt" && item.version}
                                                                {chain !== "apt" && item.block}
                                                            </p>
                                                        </td>
                                                        <td className="p-4 border-b border-slate-200">
                                                            <p className="block text-sm">
                                                                {item.shortHash}
                                                            </p>
                                                        </td>
                                                        <td className="p-4 border-b border-slate-200">
                                                            <p className="block text-sm">
                                                                {item.date}
                                                            </p>
                                                        </td>
                                                        <td className="p-4 border-b border-slate-200">
                                                            <p className="block text-sm">
                                                                {item.shortFrom}
                                                            </p>
                                                        </td>
                                                        {chain !== "apt" && (
                                                            <>
                                                                <td className="p-4 border-b border-slate-200">
                                                                    <p className="block text-sm">
                                                                        {item.shortTo}
                                                                    </p>
                                                                </td>
                                                                <td className="p-4 border-b border-slate-200">
                                                                    <p className="block text-sm">
                                                                        {item.func}
                                                                    </p>
                                                                </td>
                                                                <td className="p-4 border-b border-slate-200">
                                                                    <p className="block text-sm">
                                                                        {item.fee}
                                                                    </p>
                                                                </td>
                                                            </>
                                                        )}
                                                        <td className="p-4 border-b border-slate-200">
                                                            <p className="block text-sm">
                                                                {`${item.amount || '0'} ${chain === "apt" ? "APT" : ""}`}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                )
                                            }) : (
                                                <tr>
                                                    <td colSpan={chain === "apt" ? table_head.length : icp_sui_table_head.length} className="text-center py-4 border-b border-slate-200">
                                                        No NFT
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Pagination align="center" current={currentPage} onChange={changeHandler} total={transactionData?.length} pageSize={10} />
                    </div>
                </div>
            </section>
        </main >
    );
}