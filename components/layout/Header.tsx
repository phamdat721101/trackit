"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { Menu, Search, Wallet } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/Sheet"

export default function Header() {
    const [selectedChain, setSelectedChain] = useState('SUI');
    const [isClicked, setIsClicked] = useState(false);

    const clickHandler = () => {
        setIsClicked(!isClicked);
    }

    return (
        <header className="border-b">
            <div className="container mx-auto px-5 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 mr-2"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="font-bold text-xl">TrackIt</span>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <nav className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="mobile-chain" className="text-sm font-medium">
                                        Select Chain
                                    </label>
                                    <Select value={selectedChain} onValueChange={setSelectedChain}>
                                        <SelectTrigger id="mobile-chain">
                                            <SelectValue placeholder="Select chain" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SUI">SUI</SelectItem>
                                            <SelectItem value="APTOS">APTOS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* <div className="flex flex-col gap-2">
                                    <label htmlFor="mobile-search" className="text-sm font-medium">
                                        Search Address
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="mobile-search" placeholder="Enter address" className="pl-8" />
                                    </div>
                                </div> */}
                                <Button className="w-full" onClick={clickHandler}>
                                    {!isClicked && (<><Wallet className="mr-2 h-4 w-4" /> Login</>)}
                                    {isClicked && (<span>{`${"0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa".slice(0, 5)}...${"0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa".slice(-5)}`}</span>)}
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Type your prompt" className="pl-8 w-[300px]" />
                    </div>

                    <Select value={selectedChain} onValueChange={setSelectedChain}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select chain" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SUI">SUI</SelectItem>
                            <SelectItem value="APTOS">APTOS</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={clickHandler}>
                        {!isClicked && (<><Wallet className="mr-2 h-4 w-4" /> Login </>)}
                        {isClicked && (<span>{`${"0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa".slice(0, 5)}...${"0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa".slice(-5)}`}</span>)}
                    </Button>
                </div>
            </div>
        </header>
    )
}