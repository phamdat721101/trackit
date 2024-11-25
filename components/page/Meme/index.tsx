"use client";
import Panel from "./Panel";
import List, { renderList } from "../List";
import Item from "./Item";
import { useEffect, useState } from "react";
import { TokenInfo } from "../../../types/interface";
import axios from "axios";

import CryptoTable from "./CryptoTable";

export default function Page() {
  return (
    <div className="grow p-3">
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-3 md:col-span-2 lg:col-span-1 lg:block">
          <Panel title={"Token"} height="h-[445px]">
            <List list={renderList(tokenInfoList, Item)} />
          </Panel>
        </div>
        <Panel title={"Burnt"} height="h-[445px]">
          <List list={renderList(tokenInfoList, Item)} />
        </Panel>

        <Panel title={"DEXScreener Spent"} height="h-[445px]">
          <List list={renderList(tokenInfoList, Item)} />
        </Panel>
      </div> */}
      <CryptoTable />
    </div>
  );
}