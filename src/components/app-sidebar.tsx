import { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Logout from "@/components/modals/logout";
import { LayoutGrid, Tags, LogOut } from "lucide-react";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Articles",
          url: "#",
          isActive: false,
        },
        {
          title: "Category",
          url: "#",
          isActive: false,
        },
        // {
        //   title: "Logout",
        //   url: "#",
        // },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <Sidebar {...props} className="bg-blue-600">
      <SidebarHeader className="bg-blue-600">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-blue-600">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 text-white hover:bg-blue-700"
                      // onClick={() => router.push("/admin")}
                    >
                      <LayoutGrid size={18} color="white" />
                      <span>Articles</span>
                    </Button>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 text-white hover:bg-blue-700"
                      // onClick={() => router.push("/admin/category")}
                    >
                      <Tags size={18} color="white" />
                      <span>Category</span>
                    </Button>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 text-white hover:bg-blue-700 mt-2"
                      onClick={() => setIsLogoutOpen(true)}
                    >
                      <LogOut size={18} color="white" />
                      <span>Logout</span>
                    </Button>
                    {/* <a href="#" className="text-white">
                      Logout
                    </a> */}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
