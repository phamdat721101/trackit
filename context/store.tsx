"use client";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { Blockchain, getBlockchain } from "@/utils/chain"

interface ContextProps {
    chain: string;
    setChain: Dispatch<SetStateAction<string>>,
    chainInstance: Blockchain | null;

}

const GlobalContext = createContext<ContextProps>(
    {
        chain: '',
        setChain: () => { },
        chainInstance: null,
    }
);

export const GlobalContextProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [chain, setChain] = useState('apt');
    const chainInstance = getBlockchain(chain);

    return (
        <GlobalContext.Provider value={{ chain, setChain, chainInstance }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext;