"use client";

import * as React from "react";
import {
  Link as Chain,
  Scan,
  PanelLeft,
  Search,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "../ui/Button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/Sidebar";
import Link from "next/link";
import Image from "next/image";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full text-gray-50">
        <Sidebar className="border-r border-itemborder" collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/" className="flex items-center text-white">
                    <Image
                      src={"/logo.png"}
                      alt="trackit"
                      height={40}
                      width={40}
                    />
                    <span className="font-bold text-2xl leading-10">
                      TrackIt
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-grow bg-transparent">
          <header className="flex items-center border-b border-b-itemborder px-4 py-2">
            <SidebarTrigger>
              <Button variant="ghost" size="icon">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SidebarTrigger>
            <h1 className="ml-4 text-lg font-semibold">Main Content</h1>
          </header>
          <main className="flex-grow p-4 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Menu items.
const items = [
  {
    title: "Chains",
    url: "#",
    icon: Chain,
  },
  {
    title: "Dexes",
    url: "#",
    icon: Scan,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: PanelLeft,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
