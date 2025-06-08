'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LayoutDashboard, List, Tag, Package } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/product',   label: 'Products',  icon: List },
  { href: '/category',  label: 'Categories', icon: Tag },
  { href: '/inventory', label: 'Inventory', icon: Package },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="space-y-4">
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarMenu>
            <div className="space-y-3 mt-2 px-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/50"
                    >
                      <Icon className="w-6 h-6" />
                      <span className="font-medium text-sm">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </div>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
