"use client";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import Link from "next/link";

const Header = () => {
    return (
        <header className="p-4 mx-auto w-full max-w-5xl flex items-center justify-between font-mono text-sm">
            <div className="text-3xl font-bold"><Link href={"/"}>Trackit</Link></div>
            <nav className="flex gap-20">
                <Link href={"/"}>My assets</Link>
                <Link href={"top-holders"}>Top holders</Link>
            </nav>
            <WalletSelector />
        </header>
    )
}

export default Header;