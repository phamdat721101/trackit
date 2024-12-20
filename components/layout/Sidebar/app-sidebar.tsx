"use client";

import * as React from "react";
import {
  Link as Chain,
  Scan,
  PanelLeft,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { NavMain } from "@/components/layout/Sidebar/NavMain";
import { NavProjects } from "@/components/layout/Sidebar/nav-project";
import { NavUser } from "@/components/layout/Sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "Dang Hoang Lam",
    email: "m@example.com",
    avatar: "/logo.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Chains",
      url: "#",
      icon: Chain,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Dexes",
      url: "#",
      icon: Scan,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Dashboard",
      url: "#",
      icon: PanelLeft,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "More",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

const items = [
  {
    title: "Chains",
    url: "#",
    icon: Chain,
    collapsible: true,
    items: [
      {
        title: (
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/movement-mark.svg"
              alt="WarpGate"
              width={24}
              height={24}
            />
            <span>MOVE</span>
          </div>
        ),
        url: "#",
      },
      {
        title: (
          <div className="flex items-center justify-center gap-2">
            <Image src="/Aptos_mark.png" alt="Aptos" width={24} height={24} />
            <span>APT</span>
          </div>
        ),
        url: "#",
      },
    ],
  },
  {
    title: "Dexes",
    url: "#",
    icon: Scan,
    collapsible: true,
    items: [
      {
        title: (
          <div className="flex items-center justify-center gap-2">
            <Image src="/warpgate.png" alt="WarpGate" width={24} height={24} />
            <span>WarpGate</span>
          </div>
        ),
        url: "#",
      },
      {
        title: (
          <div className="flex items-center justify-center gap-2">
            <Image src="/routex.png" alt="RouteX" width={24} height={24} />
            <span>RouteX</span>
          </div>
        ),
        url: "#",
      },
    ],
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: PanelLeft,
    collapsible: false,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center text-white">
                <Image src={"/logo.png"} alt="trackit" height={40} width={40} />
                <span className="font-bold text-2xl leading-10">TrackIt</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
