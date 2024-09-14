import { API_KEY } from "@/constants/constants";
import { BalanceDataType, HolderDataType, NftDataType, TableTransactionDataType } from "./getData";
import axios, { AxiosInstance } from 'axios';


export interface Blockchain {
    fetchAssetBalance(address: string): Promise<any>;
    fetchNFTsBalance(address: string): Promise<any>;
    fetchTopHolder(asset_type: string, numberAccount: number, chain: string): Promise<any>;
    fetchTransactionByAccount(account: string, numberTransaction: number): Promise<any>;
}

class AptosBlockChain implements Blockchain {
    private url: any;

    constructor(network: any) {
        this.url = {
            indexer: `https://aptos-${network}.nodit.io/${API_KEY}/v1/graphql`,
            urlGet: `https://aptos-${network}.nodit.io/v1`
        }
    }

    async fetchAssetBalance(address: string): Promise<any> {
        const operationsDoc = `
query MyQuery {
  current_fungible_asset_balances(
    where: {owner_address: {_eq: "${address}"}}
  ) {
    owner_address
    amount
    storage_id
    is_frozen
    metadata {
      asset_type
      creator_address
      decimals
      icon_uri
      name
      project_uri
      symbol
      token_standard
      maximum_v2
      supply_v2
    }
  }
}
`;

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                query: operationsDoc,
                variables: {},
                operationName: "MyQuery",
            }),
        };

        try {
            const response = await fetch(this.url.indexer, options);
            if (response.ok) {
                const result = await response.json();
                const assetBalances: BalanceDataType[] = result.data.current_fungible_asset_balances;
                return assetBalances;
            } else {
                return [];
            }
        } catch (error) {
            throw new Error('Cannot fetch asset data. Try again later.');
        }
    }

    async fetchNFTsBalance(address: string): Promise<any> {
        const operationsDoc = `
query MyQuery {
  current_token_ownerships_v2(
    limit: 5
    offset: 0
    where: {
      owner_address: {
        _eq: "${address}"
      }
    }
  ) {
    amount
    is_fungible_v2
    is_soulbound_v2
    last_transaction_timestamp
    non_transferrable_by_owner
    last_transaction_version
    owner_address
    property_version_v1
    storage_id
    table_type_v1
    token_data_id
    token_properties_mutated_v1
    token_standard
    current_token_data {
      collection_id
      token_name
      current_collection {
        creator_address
      }
    }
  }
}
`;

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                query: operationsDoc,
                variables: {},
                operationName: "MyQuery",
            }),
        };

        try {
            const response = await fetch(this.url.indexer, options);

            if (response.ok) {
                const result = await response.json();
                const nftBalance: NftDataType[] = result.data.current_token_ownerships_v2;
                return nftBalance;
            } else {
                return [];
            }
        } catch (error) {
            throw new Error('Cannot fetch NFT asset data. Try again later.');
        }
    }

    async fetchTopHolder(asset_type: string, numberAccount: number, chain: string): Promise<any> {
        const operationsDoc = `
query MyQuery {
  current_fungible_asset_balances(
    limit: ${numberAccount}
    where: {metadata: {asset_type: {_eq: "${asset_type}"}}, amount: {_gt: "0"}}
    order_by: {amount: desc}
  ) {
    amount
    owner_address
    asset_type
    is_frozen
    is_primary
    last_transaction_timestamp
    last_transaction_version
    storage_id
    token_standard
    metadata {
      icon_uri
      maximum_v2
      project_uri
      supply_aggregator_table_handle_v1
      supply_aggregator_table_key_v1
      supply_v2
      name
      symbol
      token_standard
      last_transaction_version
      last_transaction_timestamp
      decimals
      creator_address
      asset_type
    }
  }
}
`;

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                query: operationsDoc,
                variables: {},
                operationName: "MyQuery",
            }),
        };

        try {
            const response = await fetch(this.url.indexer, options);
            if (response.ok) {
                const result = await response.json();
                const topHolder: HolderDataType[] = result.data.current_fungible_asset_balances;
                return topHolder;
            } else {
                return [];
            }
        } catch (error) {
            throw new Error('Cannot fetch top holder data. Try again later.');
        }
    }

    async fetchTransactionByAccount(account: string, numberTransaction: number): Promise<any> {
        const link = `${this.url.urlGet}/accounts/${account}/transactions?limit=${numberTransaction}`
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'X-API-KEY': API_KEY,
            }
        };

        try {
            const response = await fetch(link, options);
            if (response.ok) {
                const result: TableTransactionDataType[] = await response.json();
                return result;
            } else {
                return [];
            }
        } catch (error) {
            throw new Error('Cannot fetch transaction data. Try again later.');
        }
    }
}

class OtherBlockchain implements Blockchain {
    private fetchUrl: string;
    private api: AxiosInstance;
    constructor(url: string) {
        this.fetchUrl = url;
        this.api = axios.create({
            baseURL: 'http://dgt-dev.vercel.app/v1',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // You can add more default configurations here
        });
        this.api.interceptors.response.use(
            response => response,
            error => {
                console.error('API request failed:', error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Error data:', error.response.data);
                    console.error('Error status:', error.response.status);
                    console.error('Error headers:', error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received:', error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up request:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    private async fetchData(endpoint: string, params: Record<string, any> = {}): Promise<any> {
        try {
            const response = await this.api.get(endpoint, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            throw new Error(`Cannot fetch data from ${endpoint}.`);
        }
    }

    async fetchAssetBalance(address: string): Promise<BalanceDataType[]> {
        const result = await this.fetchData('/user', { wallet: address });
        return result.assetHoldings;
    }

    async fetchNFTsBalance(address: string): Promise<NftDataType[]> {
        const result = await this.fetchData('/user', { wallet: address });
        return result.nftHoldings;
    }

    async fetchTopHolder(asset_type: string, numberAccount: number, chain: string): Promise<HolderDataType[]> {
        const result = await this.fetchData('/top_holders', { chain: chain });
        return result.topHolders;
    }

    async fetchTransactionByAccount(account: string, numberTransaction: number): Promise<TableTransactionDataType[]> {
        const result = await this.fetchData('/user', { wallet: account, limit: numberTransaction });
        return result.transactions;
    }


    // async fetchAssetBalance(address: string): Promise<any> {
    //     try {
    //         const response = await fetch(this.fetchUrl, {
    //             mode: 'no-cors'
    //         });
    //         console.log(response)
    //         if (response.ok) {
    //             const result = await response.json();
    //             const assetHoldings = result.assetHoldings;
    //             return assetHoldings;
    //         } else {
    //             throw new Error("Cannot fetch data. Try again.");
    //         }
    //     } catch (error) {
    //         throw new Error("Cannot fetch data. Try again.");
    //     }
    // }
    // async fetchNFTsBalance(address: string): Promise<any> {
    //     try {
    //         const response = await fetch(this.fetchUrl, {
    //             mode: 'no-cors'
    //         });
    //         if (response.ok) {
    //             const result = await response.json();
    //             const nftHoldings = result.nftHoldings;
    //             return nftHoldings;
    //         } else {
    //             throw new Error("Cannot fetch data. Try again.");
    //         }
    //     } catch (error) {
    //         throw new Error("Cannot fetch data. Try again.");
    //     }
    // }
    // async fetchTopHolder(asset_type: string, numberAccount: number): Promise<any> {
    //     try {
    //         const response = await fetch(this.fetchUrl, {
    //             mode: 'no-cors'
    //         });
    //         if (response.ok) {
    //             const result = await response.json();
    //             const topHolders = result.topHolders;
    //             return topHolders;
    //         } else {
    //             throw new Error("Cannot fetch data. Try again.");
    //         }
    //     } catch (error) {
    //         throw new Error("Cannot fetch data. Try again.");
    //     }
    // }
    // async fetchTransactionByAccount(account: string, numberTransaction: number): Promise<any> {
    //     try {
    //         const response = await fetch(this.fetchUrl, {
    //             mode: 'no-cors'
    //         });

    //         const result = await response.json();
    //         const transactions = result.transactions;
    //         return transactions;

    //     } catch (error) {
    //         throw new Error("Cannot fetch data. Try again.");
    //     }
    // }
}

export function getBlockchain(chainName: string): Blockchain {
    if (chainName === 'apt') {
        return new AptosBlockChain('mainnet'); // Thay thế bằng URL của node Ethereum
    } else if (chainName === 'sui' || chainName === 'icp') {
        return new OtherBlockchain('http://dgt-dev.vercel.app/v1');
    } else {
        throw new Error('Invalid blockchain');
    }
}