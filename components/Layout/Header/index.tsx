"use client";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

const Header = () => {
    return (
        <header className="p-4 mx-auto w-full max-w-5xl flex items-center justify-between font-mono text-sm">
            <div>Trackit</div>
            <WalletSelector />
        </header>
    )
}

export default Header;