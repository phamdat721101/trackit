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
    <div className="grow p-3 w-full">
      <CryptoTable />
    </div>
  );
}