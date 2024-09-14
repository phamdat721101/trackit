"use client";
import GlobalContext from "@/context/store";
import GroupIcon from "@/icons/Group";
import WalletIcon from "@/icons/Wallet";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import Link from "next/link";
import { useContext, useState } from "react";
import { GoogleSignInButton } from "@/components/authBtn"

const Header = () => {
    const { chain, setChain, chainInstance } = useContext(GlobalContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const changeHandler = (value: string) => {
        setChain(value);
    }

    return (
        // <header className="p-4 mx-auto w-full max-w-5xl flex items-center justify-between font-mono text-sm">
        //     <div className="text-3xl font-bold"><Link href={"/"}>Trackit</Link></div>
        //     <nav className="flex gap-20">
        //         <Link href={"/"} className="flex items-end gap-1">
        //             <WalletIcon />
        //             <span>My assets</span>
        //         </Link>
        //         <Link href={"/top-holders"} className="flex items-end gap-1">
        //             <GroupIcon />
        //             <span>Top holders</span>
        //         </Link>
        //     </nav>
        //     <div className="flex items-center gap-1">
        //         <select
        //             className="py-2 rounded-lg"
        //             onChange={(e) => changeHandler(e.target.value)}
        //             name="chain" id="chain"
        //         >
        //             <option value="apt">APT</option>
        //             <option value="sui">SUI</option>
        //             <option value="icp">ICP</option>
        //         </select>
        //         <WalletSelector />
        //     </div>
        // </header>
        <header className="p-4 mx-auto w-full max-w-5xl font-mono text-sm">
            <div className="flex items-center justify-between">
                <div className="text-3xl font-bold"><Link href={"/"}>Trackit</Link></div>

                {/* Hamburger menu for mobile */}
                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                {/* Desktop navigation */}
                <nav className="hidden md:flex gap-20">
                    <Link href={"/"} className="flex items-end gap-1">
                        <WalletIcon />
                        <span>My assets</span>
                    </Link>
                    <Link href={"/top-holders"} className="flex items-end gap-1">
                        <GroupIcon />
                        <span>Top holders</span>
                    </Link>
                </nav>

                {/* Desktop chain selector and wallet */}
                <div className="hidden md:flex items-center gap-1">
                    <select
                        className="py-2 rounded-lg"
                        onChange={(e) => changeHandler(e.target.value)}
                        name="chain" id="chain"
                    >
                        <option value="apt">APT</option>
                        <option value="sui">SUI</option>
                        <option value="icp">ICP</option>
                    </select>
                    <WalletSelector />
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden mt-4">
                    <nav className="flex flex-col gap-4">
                        <Link href={"/"} className="flex items-center gap-1">
                            <WalletIcon />
                            <span>My assets</span>
                        </Link>
                        <Link href={"/top-holders"} className="flex items-center gap-1">
                            <GroupIcon />
                            <span>Top holders</span>
                        </Link>
                    </nav>
                    <div className="mt-4 flex flex-col gap-2">
                        <select
                            className="py-2 rounded-lg"
                            onChange={(e) => changeHandler(e.target.value)}
                            name="chain" id="chain"
                        >
                            <option value="apt">APT</option>
                            <option value="sui">SUI</option>
                            <option value="icp">ICP</option>
                        </select>
                        <WalletSelector />
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header;