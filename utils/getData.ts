const apiKey: string = process.env.NEXT_PUBLIC_NODIT_API_KEY || '';
const url = `https://aptos-mainnet.nodit.io/${apiKey}/v1/graphql`;

// With Aptos
export const fetchAssetBalance = async (address: string) => {
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
        const response = await fetch(url, options);
        console.log(response);
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            return result.data.current_fungible_asset_balances;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Cannot fetch asset data. Try again later.');
    }
}

export const fetchTopHolder = async (numberAPT: number) => {
    const operationsDoc = `
query MyQuery {
  current_fungible_asset_balances(
    where: {metadata: {asset_type: {_eq: "0x1::aptos_coin::AptosCoin"}}, amount: {_gt: "600000000000000"}}
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
        const response = await fetch(url, options);
        console.log(response);
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            return result.data.current_fungible_asset_balances;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Cannot fetch top holder data. Try again later.');
    }
}


// With ERC20

// export const getTokenByAccount = async (account: string, pageIndex: number) => {
//     const options = {
//         method: 'POST',
//         headers: {
//             accept: 'application/json',
//             'content-type': 'application/json',
//             'X-API-KEY': apiKey
//         },
//         body: JSON.stringify({
//             accountAddress: account,
//             withCount: true,
//             rpp: 10,
//             page: pageIndex
//         })
//     };

//     try {
//         const response = await fetch(url, options);
//         console.log(response);
//         if (response.ok) {
//             const result = await response.json();
//             console.log(result);
//             return result;
//         } else {
//             return null;
//         }
//     } catch (error) {
//         throw new Error('Cannot fetch asset data. Try again later.');
//     }
// }

// export const getTokenPriceByContract = async (tokenContracts: Array<string>) => {
//     const options = {
//         method: 'POST',
//         headers: {
//             accept: 'application/json',
//             'content-type': 'application/json',
//             'X-API-KEY': apiKey,
//         },
//         body: JSON.stringify({
//             contractAddresses: tokenContracts,
//             currency: 'USD'
//         })
//     };

//     try {
//         const response = await fetch(url, options);
//         console.log(response);
//         if (response.ok) {
//             const result = await response.json();
//             console.log(result);
//             return result;
//         } else {
//             return [];
//         }
//     } catch (error) {
//         throw new Error('Cannot fetch price data. Try again later.');
//     }
// }