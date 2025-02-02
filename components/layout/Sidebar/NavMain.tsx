import {
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuItem,
  SidebarMenu,
  SidebarGroup,
} from "../../ui/Sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { ChevronRight, type LucideIcon } from "lucide-react";

export function NavMain({
  items,
}: {
  items: {
    title: string | React.ReactNode;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    collapsible?: boolean;
    items?: {
      title: string | React.ReactNode;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item, index) => {
          // No submenus
          if (!item.collapsible || !item.items?.length) {
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  tooltip={
                    typeof item.title === "string" ? item.title : undefined
                  }
                >
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // Have submenus
          return (
            <Collapsible
              key={index}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={
                      typeof item.title === "string" ? item.title : undefined
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem, subIndex) => (
                      <SidebarMenuSubItem key={subIndex}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
