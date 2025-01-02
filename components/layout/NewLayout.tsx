"use client";
import { AppSidebar } from "../layout/Sidebar/AppSidebar";
import SearchForm from "./SearchForm";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider className="text-gray-50">
      <div className="flex min-h-screen w-full">
        <div className="md:sticky top-0 h-screen flex-shrink-0">
          <AppSidebar />
        </div>
        <main className="flex-1 min-w-0">
          <SidebarInset className="flex flex-col min-h-screen bg-transparent">
            <header className="flex h-16 shrink-0 items-center gap-2">
              {/* <SidebarTrigger className="-ml-1" /> */}

              {/* Search Form */}
              <SearchForm />
            </header>
            <div className="flex-1">
              <div className="p-4 w-full">{children}</div>
            </div>
          </SidebarInset>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
