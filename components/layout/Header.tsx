"use client";

import { FormEvent, useContext, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { WalletSelector } from "../wallet/WalletSelector";
import GlobalContext from "@/context/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const { setLoadingFullScreen } = useContext(GlobalContext);
  const [selectedChain, setSelectedChain] = useState("APTOS");
  const [input, setInput] = useState<string>();
  const router = useRouter();

  const changeHandler = (value: string) => {
    setInput(value);
    console.log(input);
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log(input);
    setLoadingFullScreen(true);
    setTimeout(() => setLoadingFullScreen(false), 2000);
    setInput("");
    router.push("/kana");
  };

  return (
    <header className="mb-1">
      <div className="container mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center text-white">
          <Image src={"/logo.png"} alt="trackit" height={40} width={40} />
          <span className="font-bold text-2xl leading-10">TrackIt</span>
        </Link>

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
                  <Select
                    value={selectedChain}
                    onValueChange={setSelectedChain}
                  >
                    <SelectTrigger id="mobile-chain">
                      <SelectValue placeholder="Select chain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUI">SUI</SelectItem>
                      <SelectItem value="APTOS">APTOS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="mobile-search"
                    className="text-sm font-medium"
                  >
                    Search
                  </label>
                  <form className="relative" onSubmit={(e) => submitHandler(e)}>
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      onChange={(e) => changeHandler(e.target.value)}
                      id="search"
                      placeholder="Search with TrackIt"
                      className="pl-8"
                      value={input}
                    />
                    <Input type="submit" value="Search" className="hidden" />
                  </form>
                </div>
                <WalletSelector />
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <form className="relative" onSubmit={(e) => submitHandler(e)}>
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={input}
              onChange={(e) => changeHandler(e.target.value)}
              id="search"
              placeholder="Search with TrackIt"
              className="pl-8 w-[300px]"
            />
            <Input type="submit" value="Search" className="hidden" />
          </form>

          <Select value={selectedChain} onValueChange={setSelectedChain}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUI">SUI</SelectItem>
              <SelectItem value="APTOS">APTOS</SelectItem>
            </SelectContent>
          </Select>

          <WalletSelector />
        </div>
      </div>
    </header>
  );
}
