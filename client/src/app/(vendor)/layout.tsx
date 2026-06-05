"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/use-ui-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Menu,
  X,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Store,
  Bell,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/vendor/products",
    icon: Package,
  },
  {
    name: "Create Product",
    href: "/vendor/products/create",
    icon: PlusCircle,
  },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, accessToken, logout } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Authentication & authorization check
  useEffect(() => {
    if (!accessToken || !user) {
      toast.error("Please login to access the vendor portal.");
      router.replace("/login");
    } else if (user.role !== "VENDOR") {
      toast.error("Unauthorized. Only vendor accounts are permitted here.");
      router.replace("/");
    } else {
      setIsCheckingAuth(false);
    }
  }, [user, accessToken, router]);

  // Click outside to close profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#020617] text-[#f1f5f9]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="mt-4 text-sm text-slate-400">Verifying vendor session...</p>
      </div>
    );
  }

  // Derive page title for breadcrumb
  const currentNav = navItems.find((item) => pathname === item.href) || 
                     (pathname.startsWith("/vendor/products/edit") ? { name: "Edit Product", href: "" } : null);
  const pageTitle = currentNav?.name || "Vendor Panel";

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
      {/* ── MOBILE SIDEBAR DRAWER (OVERLAY) ── */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-[#090d1f]/95 backdrop-blur-md transition-transform duration-300 lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <Link href="/vendor/dashboard" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-indigo-500" />
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Aura Vendor
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="w-full justify-start gap-2 bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900 hover:text-white mt-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* ── DESKTOP COLLAPSIBLE SIDEBAR ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-slate-800 bg-[#060a17] transition-all duration-300 shrink-0",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <Link href="/vendor/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Store className="h-5 w-5" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent truncate">
                Aura Vendor
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg py-2.5 transition-all duration-200 relative group",
                  isSidebarOpen ? "px-4" : "justify-center px-0",
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                {!isSidebarOpen && (
                  <span className="absolute left-full ml-3 rounded bg-slate-900 border border-slate-800 px-2 py-1 text-xs font-semibold text-slate-200 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4 flex flex-col gap-2">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-3 px-2 py-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full justify-start gap-2 bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-950/40 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div 
                className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 cursor-pointer"
                title={`${user?.name} (${user?.email})`}
              >
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900 hover:text-white"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── TOP NAVBAR ── */}
        <header className="h-16 border-b border-slate-800 bg-[#020617]/70 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Toggle button for desktop sidebar */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-slate-400 hover:text-white hover:bg-slate-800/50"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
            {/* Menu trigger for mobile drawer */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800/50"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumbs / Page Title */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Vendor</span>
              <span className="text-slate-600">/</span>
              <span className="font-semibold text-slate-200">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification placeholder */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-[#020617]" />
            </Button>

            <Separator orientation="vertical" className="h-6 bg-slate-800" />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 group-hover:border-indigo-400/50 transition-colors">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-slate-300 group-hover:text-slate-200 transition-colors truncate max-w-[120px]">
                  {user?.name}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-slate-800 bg-[#080d1e] p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 text-xs text-slate-400">
                    <p className="font-semibold text-slate-200 truncate">{user?.name}</p>
                    <p className="truncate mt-0.5">{user?.email}</p>
                    <div className="mt-1.5 inline-block rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                      {user?.role}
                    </div>
                  </div>
                  <Separator className="my-1 bg-slate-800" />
                  <Link href="/vendor/products/create" onClick={() => setIsProfileOpen(false)}>
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
                      <PlusCircle className="h-4 w-4 text-slate-400" />
                      Add New Product
                    </div>
                  </Link>
                  <Separator className="my-1 bg-slate-800" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 hover:text-red-300 cursor-pointer transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT AREA ── */}
        <main className="flex-1 overflow-y-auto bg-[#020617] p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
