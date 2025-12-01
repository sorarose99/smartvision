'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Airplay,
  Camera,
  LayoutDashboard,
  PanelLeft,
  Settings,
  Shield,
  Car,
  TrafficCone,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SmartVisionIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: NavItem[];
  isActive?: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/camera', label: 'Camera Processor', icon: Camera },
  { href: '/dashboard/traffic-signal', label: 'Traffic Signal', icon: TrafficCone },
  { href: '/dashboard/signage', label: 'Digital Signage', icon: Airplay },
  { href: '/dashboard/parking-status', label: 'Parking Status', icon: Car },
  { href: '/admin/screens', label: 'Admin', icon: Shield },
];


function NavMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const active = item.isActive ? item.isActive(pathname) : pathname === item.href;
        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const avatarImage = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible={isMobile ? 'offcanvas' : 'icon'}>
        <SidebarHeader>
          <div className="flex h-14 items-center gap-2 px-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <SmartVisionIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary-foreground">SmartVision</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
            <NavMenu items={navItems} />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="w-full justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="User" />}
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="truncate">user@example.com</span>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@smartvision.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            {/* Can add breadcrumbs or search here */}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
