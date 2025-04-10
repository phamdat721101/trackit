"use client";
import Panel from "./Panel";
import List, { renderList } from "../List";
import Item from "./Item";
import { useContext, useEffect, useState } from "react";
import { TokenInfo } from "../../../types/interface";
import axios from "axios";
import CryptoTable from "./CryptoTable";
import GlobalContext from "../../../context/store";
import YieldInfo from "./YieldInfo";
import TokenCards from "./TokenCards";
import Home from "./Home";
import TokenSaleBanner from "./TokenSaleBanner";

export default function Page() {
  const { selectedChain } = useContext(GlobalContext);

  return (
    <div className="grow w-full">
      <TokenSaleBanner />
      {selectedChain === "movement" ||
      selectedChain === "sui" ||
      selectedChain === "aptos" ? (
        <Home />
      ) : selectedChain === "viction" ? (
        <TokenCards />
      ) : (
        <YieldInfo />
      )}
    </div>
  );
}