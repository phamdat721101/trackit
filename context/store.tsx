"use client";
import { TokenInfo } from "@/types/interface";
import { createContext, Dispatch, SetStateAction, useState } from "react";

interface ContextProps {
  loadingFullScreen: boolean;
  setLoadingFullScreen: Dispatch<SetStateAction<boolean>>;
  selectedToken: TokenInfo | null;
  setSelectedToken: Dispatch<SetStateAction<TokenInfo | null>>;
}

const GlobalContext = createContext<ContextProps>({
  loadingFullScreen: false,
  setLoadingFullScreen: () => {},
  selectedToken: null,
  setSelectedToken: () => {},
});

export default GlobalContext;

export const GlobalContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);

  return (
    <GlobalContext.Provider
      value={{
        loadingFullScreen,
        setLoadingFullScreen,
        selectedToken,
        setSelectedToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
