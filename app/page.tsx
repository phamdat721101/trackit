"use client";
import React, { useContext, useEffect, useState } from "react";
import { WalletName, useWallet } from '@aptos-labs/wallet-adapter-react';
import { fetchAssetBalance, fetchNFTsBalance, BalanceDataType, NftDataType } from "@/utils/getData";
import { Pagination, PaginationProps, Tabs } from 'antd';
import GlobalContext from "@/context/store";
import { getBlockchain } from "@/utils/chain";

interface TableAssetDataType {
  name: string;
  symbol: string;
  quantity: number;
  price: string;
  change24h: string;
  value: string;
}

interface TableNftDataType {
  name: string;
  quantity: number;
  creator: string;
}

const tabList = [
  'Coins',
  'NFT',
]

const asset_table_head = [
  'Asset',
  'Symbol',
  'Quantity',
  'Price',
  'Change (24h)',
  'Value'
];

const nft_table_head = [
  'Name',
  'Amount',
  'Creator',
]

const getTableData = (data: BalanceDataType[]) => {
  // This function will transform the balance data and potentially fetch additional info
  return data.map((item) => {
    // Extract relevant information from each balance item
    const name = item.metadata.name;
    const symbol = item.metadata.symbol;
    const quantity = item.amount;
    const price = '';
    const change24h = '';
    const value = '';

    // Fetch price and change data from an external API (replace with your logic)
    // const priceResponse = await fetch(`https://your-api.com/price/${symbol}`);
    // const priceData = await priceResponse.json();
    // const price = priceData.currentPrice;
    // const percentChangeFor24h = priceData.change24h;

    // Calculate the value based on balance and price
    // const value = (Number(balance) * Number(price)).toFixed(2);

    return {
      name,
      symbol,
      quantity,
      price,
      change24h,
      value,
    };
  });
};

const getNftTableData = (data: NftDataType[]) => {
  // This function will transform the balance data and potentially fetch additional info
  return data.map((item) => {
    // Extract relevant information from each balance item
    const name = item.current_token_data.token_name;
    const quantity = item.amount;
    const creator = item.current_token_data.current_collection.creator_address;

    return {
      name,
      quantity,
      creator,
    };
  });
};

export default function HomePage() {
  const { connect, disconnect, account, connected } = useWallet();
  const [aptBalance, setAptBalance] = useState<number | undefined>();
  const [currentAddress, setCurrentAddress] = useState();
  const [assetData, setAssetData] = useState<TableAssetDataType[] | []>();
  const [nftData, setNftData] = useState<TableNftDataType[] | []>();
  const [selectedTab, setSelectedTab] = useState<string>('0');
  const [currentPage, setCurrentPage] = useState(1);
  const [curentNftPage, setCurentNftPage] = useState(1);
  const { chain } = useContext(GlobalContext);

  useEffect(() => {
    const blockchain = getBlockchain(chain);

    const fetchData = async () => {
      if (account?.address) {
        if (chain === 'apt') {
          const assetData = await blockchain.fetchAssetBalance(account?.address);
          const processedAssetData = getTableData(assetData);

          const assetBalance = processedAssetData.filter(token => token.symbol === 'APT');

          const nftData = await blockchain.fetchNFTsBalance(account?.address);
          const processedNftData = getNftTableData(nftData);

          setAptBalance(assetBalance[0].quantity);
          setAssetData(processedAssetData);
          setNftData(processedNftData);
        }

        if (chain === 'sui' || chain === 'icp') {
          const assetData: TableAssetDataType[] = await blockchain.fetchAssetBalance(account?.address);
          let assetBalance: TableAssetDataType[];
          if (chain === 'sui') {
            assetBalance = assetData.filter(token => token.symbol === 'SUI');
          } else {
            assetBalance = assetData.filter(token => token.symbol === 'ICP');
          }
          const nftData = await blockchain.fetchNFTsBalance(account?.address);

          assetBalance.length > 0 ? setAptBalance(assetBalance[0].quantity) : setAptBalance(0);
          setAssetData(assetData);
          setNftData(nftData);
        }
      }
    };

    fetchData();
    setCurrentPage(1);
    setCurentNftPage(1);
  }, [account?.address, chain]);

  const changeHandler: PaginationProps['onChange'] = (page) => {
    setCurrentPage(page);
  };

  const changeNftHandler: PaginationProps['onChange'] = (page) => {
    setCurentNftPage(page);
  };

  const tabChangeHandler = (key: string) => {
    setSelectedTab(key);
  };

  return (
    <main className="flex-grow px-5 sm:px-20 py-8">
      <section className="flex flex-col gap-6">
        <div>
          <div className="text-2xl leading-normal font-semibold">Your Account</div>
          <div className="text-ellipsis overflow-hidden">
            {chain === "apt" && account?.address}

          </div>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h2 className="mb-1 text-xs leading-normal font-bold text-[#76808f]">
            {chain === "apt" ? "Aptos" : chain === "sui" ? "Sui" : "Icp"} Balance
          </h2>
          <div className="flex justify-between items-end">
            <p className="text-xl font-semibold leading-6	">
              {chain === "apt" && (aptBalance ? `${aptBalance / 100000000} APT` : '-- APT')}
              {chain === "sui" && (aptBalance ? `${aptBalance} SUI` : '-- SUI')}
              {chain === "icp" && (aptBalance ? `${aptBalance} ICP` : '-- ICP')}
            </p>
            {/* <p className="text-xs ">5 $</p> */}
          </div>
        </div>
        <Tabs
          onChange={tabChangeHandler}
          type="card"
          items={tabList.map((val, i) => {
            return {
              label: `${val}`,
              key: String(i),
            };
          })}
        />
        {selectedTab === '0' &&
          <div className="-mt-10 relative flex flex-col gap-4 px-6 py-4 w-full h-full text-gray-700 bg-white shadow-md rounded-b-lg bg-clip-border">
            <h2 className="text-sm">ASSETS HOLDING</h2>
            <p className="text-sm	text-[#aeb4bc]">A Total of {assetData?.length} tokens</p>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border-gray-200 shadow sm:rounded-lg">

                  <table className="mb-2 w-full text-left table-auto min-w-max">
                    <thead>
                      <tr>
                        {asset_table_head.map((head, index) => (

                          <th key={index} className="p-4 border-b border-slate-300 bg-customBlue">
                            <p className="block text-sm font-normal leading-none text-white">
                              {head}
                            </p>
                          </th>

                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {assetData?.length ? (assetData?.slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10).map((token, index) => {
                        return (
                          <tr key={index} className="transition-colors duration-200 hover:bg-sky-50">
                            <td className="p-4 border-b border-slate-200">
                              <p className="block text-sm">
                                {token.name}
                              </p>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              <p className="block text-sm">
                                {token.symbol}
                              </p>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              <p className="block text-sm">
                                {chain === "apt" ? Number(token.quantity / 100000000).toFixed(3) : Number(token.quantity).toFixed(2)}
                              </p>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              {chain !== "apt" ? `${Number(token.price).toFixed(2)} $` : "-"}
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              {chain !== "apt" ? `${token.change24h} %` : "-"}
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              {chain !== "apt" ? `${(Number(token.quantity) * Number(token.price)).toFixed(2)} $` : "-"}
                            </td>
                          </tr>
                        )
                      })) : (
                        <tr>
                          <td colSpan={asset_table_head.length} className="text-center py-4 border-b border-slate-200">
                            No Token
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Pagination align="center" current={currentPage} onChange={changeHandler} total={assetData?.length} pageSize={10} />
          </div>
        }

        {selectedTab === '1' &&
          <div className="-mt-10 relative flex flex-col gap-4 px-6 py-4 w-full h-full text-gray-700 bg-white shadow-md rounded-b-lg bg-clip-border">
            <h2 className="text-sm">NFT ASSETS</h2>
            <p className="text-sm	text-[#aeb4bc]">A Total of {nftData?.length} NFTs</p>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border-gray-200 shadow sm:rounded-lg">

                  <table className="mb-2 w-full text-left table-auto min-w-max">
                    <thead>
                      <tr>
                        {nft_table_head.map((head, index) => (

                          <th key={index} className="p-4 border-b border-slate-300 bg-customBlue">
                            <p className="block text-sm font-normal leading-none text-white">
                              {head}
                            </p>
                          </th>

                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {nftData?.length ? (nftData?.slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10).map((item, index) => {
                        return (
                          <tr key={index} className="transition-colors duration-200 hover:bg-sky-50">
                            <td className="p-4 border-b border-slate-200">
                              <p className="block text-sm">
                                {item.name}
                              </p>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              <p className="block text-sm">
                                {item.quantity}
                              </p>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              <p className="block text-sm">
                                {item.creator}
                              </p>
                            </td>
                          </tr>
                        )
                      })) : (
                        <tr>
                          <td colSpan={nft_table_head.length} className="text-center py-4 border-b border-slate-200">
                            No NFT
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Pagination align="center" current={curentNftPage} onChange={changeNftHandler} total={nftData?.length} pageSize={10} />
          </div>
        }
      </section>
    </main >
  );
}
