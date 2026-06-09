// "use client";

// import { motion } from "framer-motion";
// import { SlidersHorizontal } from "lucide-react";
// import { ProductGrid } from "./product-grid";
// import { Badge } from "@/components/ui/badge";

// export const ProductsCatalog: React.FC = () => {
//   return (
//     <main className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         <motion.header
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
//         >
//           <div className="max-w-2xl">
//             <Badge className="mb-4">Curated marketplace</Badge>
//             <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
//               Designed for how you shop.
//             </h1>
//             <p className="mt-4 text-lg leading-relaxed text-slate-400">
//               Premium products from verified vendors—crafted with the clarity and
//               calm of a modern startup storefront.
//             </p>
//           </div>
//           <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-400">
//             <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
//             <span>Newest first</span>
//           </div>
//         </motion.header>

//         <ProductGrid params={{ limit: 12, sortBy: "newest" }} />
//       </div>
//     </main>
//   );
// };
"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react";
import { ProductGrid } from "./product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ProductsCatalog: React.FC = () => {
  return (
    <main className="relative px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      {/* Ambient SaaS background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          {/* LEFT */}
          <div className="max-w-2xl">
            <Badge className="mb-4 border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 backdrop-blur-md">
              <Sparkles className="mr-1 h-3 w-3" />
              Curated marketplace
            </Badge>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Designed for how you shop.
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              Premium products from verified vendors—built with SaaS-grade
              reliability, speed, and trust.
            </p>

            {/* SaaS micro stats */}
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                Live inventory
              </span>
              <span className="flex items-center gap-1">
                ⚡ Fast checkout
              </span>
              <span className="flex items-center gap-1">
                🛡 Verified vendors
              </span>
            </div>
          </div>

          {/* RIGHT CONTROL PANEL */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Filters
            </Button>

            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">
              <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
              <span>Newest first</span>
            </div>
          </div>
        </motion.header>

        {/* GRID */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProductGrid params={{ limit: 12, sortBy: "newest" }} />
        </motion.div>
      </div>
    </main>
  );
};