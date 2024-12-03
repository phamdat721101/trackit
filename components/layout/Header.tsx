"use client";

import { FormEvent, useContext, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/Sheet";
import { WalletSelector } from "../wallet/WalletSelector";
import GlobalContext from "@/context/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const { setLoadingFullScreen, setSelectedToken } = useContext(GlobalContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    const inputValue = inputRef.current?.value || "";

    if (inputValue.trim()) {
      setLoadingFullScreen(true);
      setTimeout(() => setLoadingFullScreen(false), 2000);
      router.push(`/token/${inputValue}`);

      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }
    }
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
                {/* <div className="flex flex-col gap-2">
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
                </div> */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="mobile-search"
                    className="text-sm font-medium"
                  >
                    Search
                  </label>
                  <form
                    className="relative"
                    ref={formRef}
                    onSubmit={submitHandler}
                  >
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search with TrackIt"
                      className="pl-8"
                      ref={inputRef}
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
          <form className="relative" ref={formRef} onSubmit={submitHandler}>
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              id="search"
              placeholder="Search with TrackIt"
              className="pl-8 w-[300px]"
            />
            <Input type="submit" value="Search" className="hidden" />
          </form>

          {/* <Select value={selectedChain} onValueChange={setSelectedChain}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUI">SUI</SelectItem>
              <SelectItem value="APTOS">APTOS</SelectItem>
            </SelectContent>
          </Select> */}

          <Image
            src={"/movement-mark.svg"}
            alt={"movement logo"}
            width={24}
            height={24}
          />

          <WalletSelector />
        </div>
      </div>
    </header>
  );
}
