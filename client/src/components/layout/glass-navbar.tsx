// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { motion } from "framer-motion";
// import { Heart, ShoppingBag, Sparkles, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useWishlistStore } from "@/store/useWishlistStore";
// import { useAuthStore } from "@/store/useAuthStore";
// import { useCartItemCount } from "@/features/cart/hooks/use-cart";
// import { cn } from "@/lib/utils";

// const navLinks = [
//   { href: "/", label: "Home" },
//   { href: "/products", label: "Shop" },
// ];

// export const GlassNavbar: React.FC = () => {
//   const pathname = usePathname();
//   const wishlistCount = useWishlistStore((s) => s.ids.length);
//   const user = useAuthStore((s) => s.user);
//   const cartCount = useCartItemCount();

//   return (
//     <motion.header
//       initial={{ y: -12, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
//       className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/70 backdrop-blur-2xl backdrop-saturate-150"
//     >
//       <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//         <Link href="/" className="flex items-center gap-2.5">
//           <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/20">
//             <Sparkles className="h-4 w-4 text-white" />
//           </div>
//           <span className="text-lg font-semibold tracking-tight text-white">
//             AuraMarket
//           </span>
//         </Link>

//         <div className="hidden items-center gap-1 md:flex">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className={cn(
//                 "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
//                 pathname === link.href ||
//                   (link.href === "/products" && pathname.startsWith("/products"))
//                   ? "bg-white/10 text-white"
//                   : "text-slate-400 hover:bg-white/5 hover:text-white"
//               )}
//             >
//               {link.label}
//             </Link>
//           ))}
//           {user?.role === "CUSTOMER" && (
//             <Link
//               href="/cart"
//               className={cn(
//                 "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
//                 pathname === "/cart"
//                   ? "bg-white/10 text-white"
//                   : "text-slate-400 hover:bg-white/5 hover:text-white"
//               )}
//             >
//               Cart
//             </Link>
//           )}
//         </div>

//         <div className="flex items-center gap-1 sm:gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="relative text-slate-300 hover:bg-white/5 hover:text-white"
//             asChild
//           >
//             <Link href="/products" aria-label="Wishlist">
//               <Heart className="h-5 w-5" />
//               {wishlistCount > 0 && (
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-bold text-white">
//                   {wishlistCount}
//                 </span>
//               )}
//             </Link>
//           </Button>

//           {user?.role === "CUSTOMER" && (
//             <Button
//               variant="ghost"
//               size="icon"
//               className="relative text-slate-300 hover:bg-white/5 hover:text-white"
//               asChild
//             >
//               <Link href="/cart" aria-label="Cart">
//                 <ShoppingBag className="h-5 w-5" />
//                 {cartCount > 0 && (
//                   <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white">
//                     {cartCount}
//                   </span>
//                 )}
//               </Link>
//             </Button>
//           )}

//           {user ? (
//             <Button
//               variant="ghost"
//               className="hidden gap-2 text-slate-300 sm:inline-flex"
//               asChild
//             >
//               <Link href={user.role === "VENDOR" ? "/vendor/dashboard" : "/products"}>
//                 <User className="h-4 w-4" />
//                 <span className="max-w-[100px] truncate">{user.name}</span>
//               </Link>
//             </Button>
//           ) : (
//             <Button
//               variant="ghost"
//               className="hidden text-slate-300 hover:bg-white/5 hover:text-white sm:inline-flex"
//               asChild
//             >
//               <Link href="/login">Sign in</Link>
//             </Button>
//           )}

//           {!user && (
//             <Button asChild className="bg-white text-slate-900 hover:bg-slate-100">
//               <Link href="/register">Get started</Link>
//             </Button>
//           )}
//         </div>
//       </nav>
//     </motion.header>
//   );
// };

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartItemCount } from "@/features/cart/hooks/use-cart";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Explore" },
  { href: "/orders", label: "Orders", auth: true },
];

export const GlassNavbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartItemCount();

  const isLoggedIn = !!user;

  // ✅ FIXED: logout must be inside component
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (err) {
      console.log("Logout API failed (safe fallback)");
    }

    // clear stores safely
    logout?.();
    useWishlistStore.getState().clear?.();

    router.push("/login");
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-2xl"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            AuraMarket
          </span>
        </Link>

        {/* CENTER NAV */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks
            .filter((l) => !l.auth || isLoggedIn)
            .map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-all",
                    active
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-white/10" />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-300 hover:text-white hover:bg-white/5"
            asChild
          >
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Cart (only customers) */}
          {user?.role === "CUSTOMER" && (
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-300 hover:text-white hover:bg-white/5"
              asChild
            >
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
          )}

          {/* AUTH SECTION */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">

              {/* Dashboard */}
              <Button
                asChild
                className="hidden sm:inline-flex bg-white text-slate-900 hover:bg-slate-200"
              >
                <Link
                  href={
                    user.role === "VENDOR"
                      ? "/vendor/dashboard"
                      : "/orders"
                  }
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>

              {/* Logout */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-red-500/10"
              >
                Logout
              </Button>

            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden sm:inline-flex text-slate-300 hover:text-white hover:bg-white/5"
                asChild
              >
                <Link href="/login">Sign in</Link>
              </Button>

              <Button
                asChild
                className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
              >
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}

        </div>
      </nav>
    </motion.header>
  );
};