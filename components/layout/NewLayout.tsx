"use client";
import { AppSidebar } from "../layout/Sidebar/AppSidebar";
import SearchForm from "./SearchForm";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { ChatBox } from "./Chatbox";
import { useContext } from "react";
import GlobalContext from "../../context/store";
import { BellIcon, BoltIcon, UserCircleIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import SelectChain from "./SelectChain";
import { WalletSelector } from "../wallet/WalletConnect";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { selectedNav, isLogged, setIsLogged } = useContext(GlobalContext);

  return (
    <SidebarProvider className="text-gray-50">
      <div className="flex min-h-screen w-full">
        <div className="md:sticky top-0 h-screen flex-shrink-0">
          <AppSidebar />
        </div>
        <main className="flex-1 min-w-0">
          <SidebarInset className="flex flex-col min-h-screen bg-transparent">
            <header className="flex h-16 px-6 py-4 shrink-0 items-center justify-between border-b border-b-[#132D5B]">
              {/* <SidebarTrigger className="-ml-1" /> */}

              <span className="hidden md:block text-gray-300 font-semibold text-xl">
                {selectedNav}
              </span>

              <div className="md:hidden ml-auto">
                <SearchForm />
              </div>

              <div className="hidden md:flex items-center text-gray-500 gap-8">
                <SearchForm />
                <SelectChain />
                <button>
                  <BoltIcon strokeWidth={1} />
                </button>
                <button>
                  <BellIcon strokeWidth={1} />
                </button>
                <Separator
                  orientation="vertical"
                  className="h-5 w-0.5 bg-gray-700"
                />
                <WalletSelector />
              </div>
            </header>
            <div className="flex-1">
              <div className="p-4 w-full">{children}</div>
              <ChatBox />
            </div>
          </SidebarInset>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
