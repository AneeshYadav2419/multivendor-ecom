"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Package, 
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartItemCount } from "@/features/cart/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Explore" },
];

export const GlassNavbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartItemCount();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!user;

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout API failed (safe fallback)");
    }
    logout?.();
  useWishlistStore.setState({ ids: [] });
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-2xl shadow-sm shadow-black/10"
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* ---------------- LOGO ---------------- */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              AuraMarket
            </span>
          </Link>

          {/* ---------------- DESKTOP NAV LINKS ---------------- */}
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    active ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {active && (
                    <motion.span 
                      layoutId="nav-pill" 
                      className="absolute inset-0 rounded-full bg-white/10" 
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* ---------------- RIGHT ACTIONS ---------------- */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-white/10 rounded-full" asChild>
              <Link href="/wishlist">
                <Heart className="h-[18px] w-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-bold text-white ring-2 ring-slate-950">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Cart */}
            {(!user || user.role === "CUSTOMER") && (
              <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-white/10 rounded-full" asChild>
                <Link href="/cart">
                  <ShoppingBag className="h-[18px] w-[18px]" />
                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white ring-2 ring-slate-950">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            )}

            <div className="h-5 w-px bg-white/10 hidden sm:block mx-1"></div>

            {/* Desktop Auth / User Dropdown */}
            {isLoggedIn ? (
              <div className="hidden sm:block relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-white/10 bg-slate-900/50 hover:bg-slate-800 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", isDropdownOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <User className="h-4 w-4" /> My Profile
                      </Link>
                      
                      {user.role === "CUSTOMER" ? (
                        <Link href="/orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                          <Package className="h-4 w-4" /> My Orders
                        </Link>
                      ) : (
                        <Link href="/vendor/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                          <Package className="h-4 w-4" /> Vendor Dashboard
                        </Link>
                      )}
                      
                      <Link href="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      
                      <div className="h-px bg-white/5 my-1" />
                      
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 rounded-full" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button className="bg-white text-slate-900 hover:bg-slate-200 rounded-full font-semibold px-5" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="sm:hidden text-slate-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

          </div>
        </nav>
      </motion.header>

      {/* ---------------- MOBILE MENU ---------------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden fixed inset-x-0 top-16 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6">
              {/* Links */}
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-white/10 w-full" />

              {/* User Section */}
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 rounded-xl">
                    <User className="h-5 w-5" /> Profile
                  </Link>
                  {user.role === "CUSTOMER" ? (
                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 rounded-xl">
                      <Package className="h-5 w-5" /> Orders
                    </Link>
                  ) : (
                    <Link href="/vendor/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 rounded-xl">
                      <Package className="h-5 w-5" /> Vendor Dashboard
                    </Link>
                  )}
                  <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 rounded-xl">
                    <Settings className="h-5 w-5" /> Settings
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl">
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="w-full border-white/10 bg-transparent text-white" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button className="w-full bg-white text-slate-900 hover:bg-slate-200" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};