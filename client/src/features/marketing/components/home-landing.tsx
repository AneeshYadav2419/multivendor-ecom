"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  Quote,
  Zap,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  ChevronRight,
  MonitorSmartphone,
  CheckCircle2,
  PackageSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const categories = [
  { name: "Electronics", icon: MonitorSmartphone, color: "from-blue-500/20 to-blue-500/5", border: "group-hover:border-blue-500/50" },
  { name: "Fashion", icon: Sparkles, color: "from-pink-500/20 to-pink-500/5", border: "group-hover:border-pink-500/50" },
  { name: "Home & Garden", icon: PackageSearch, color: "from-emerald-500/20 to-emerald-500/5", border: "group-hover:border-emerald-500/50" },
  { name: "Beauty", icon: Star, color: "from-fuchsia-500/20 to-fuchsia-500/5", border: "group-hover:border-fuchsia-500/50" },
];

const featuredProducts = [
  { name: "Sony WH-1000XM5", price: "₹29,990", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600", category: "Electronics" },
  { name: "Minimalist Desk Mat", price: "₹2,499", image: "https://images.unsplash.com/photo-1627398225056-f3a41fee9141?auto=format&fit=crop&q=80&w=600", category: "Accessories" },
  { name: "Aesop Resurrection Hand Balm", price: "₹3,100", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600", category: "Beauty" },
  { name: "Mechanical Keyboard Pro", price: "₹12,500", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600", category: "Electronics" },
];

const testimonials = [
  { quote: "AuraMarket changed how we discover independent brands. The checkout experience is seamless and blazing fast.", author: "Sarah Jenkins", role: "Verified Buyer" },
  { quote: "As a vendor, the dashboard gives me everything I need. The storefront looks incredibly premium, driving more conversions.", author: "David Chen", role: "Store Owner" },
  { quote: "I've never seen an eCommerce platform this smooth. It feels like a high-end native app in the browser.", author: "Elena Rodriguez", role: "Verified Buyer" },
];

export const HomeLanding: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50 selection:bg-indigo-500/30">
      
      {/* ---------------- BACKGROUND AMBIENT GLOWS ---------------- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -left-32 h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
          }}
        />
      </div>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative z-10 px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.1)]"
            >
              <Sparkles className="h-4 w-4" />
              <span>The Next Generation of Commerce</span>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-[5.5rem] lg:leading-[1.05]"
            >
              Elevate Your <br className="hidden sm:block" />
              <span className="relative bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                Shopping Experience
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl"
            >
              Discover curated products from premium independent brands. 
              AuraMarket brings you a seamless, secure, and beautiful way to shop.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Button
                size="lg"
                asChild
                className="h-14 gap-2 rounded-full bg-white px-8 text-base font-semibold text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:bg-slate-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                <Link href="/products">
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 rounded-full border-slate-700 bg-slate-900/50 px-8 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-slate-800"
              >
                <Link href="/register">Become a Vendor</Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-indigo-500/20 to-transparent blur-2xl opacity-50" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
              <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-black/20 text-[10px] text-slate-500 font-mono">
                  auramarket.app / storefront
                </div>
              </div>
              <div className="p-2 sm:p-4 opacity-80 pointer-events-none">
                 <Image src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=1200" alt="Dashboard Mockup" width={1200} height={600} className="rounded-lg object-cover h-[300px] sm:h-[500px] w-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- TRUST BADGES ---------------- */}
      <section className="relative z-10 border-y border-white/5 bg-slate-900/20 py-10 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500">
            POWERING COMMERCE FOR INNOVATIVE BRANDS
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-8 opacity-60 sm:gap-16 grayscale">
            {["Acme Corp", "GlobalTech", "Nexus", "Aria", "Nova"].map((brand) => (
              <span key={brand} className="text-xl font-bold tracking-tighter text-slate-400">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORIES SECTION ---------------- */}
      <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Shop by Category</h2>
              <p className="mt-2 text-slate-400">Explore curated collections tailored for you.</p>
            </div>
            <Link href="/products" className="hidden text-sm font-semibold text-indigo-400 hover:text-indigo-300 sm:flex items-center gap-1 transition-colors">
              Browse All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {categories.map((category, i) => (
              <Link href={`/products?category=${category.name}`} key={category.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/60 ${category.border}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${category.color}`} />
                  <div className="relative z-10 rounded-xl bg-slate-950 p-4 shadow-lg ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110">
                    <category.icon className="h-6 w-6 text-slate-300" />
                  </div>
                  <h3 className="relative z-10 font-semibold text-slate-200 group-hover:text-white">{category.name}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURED PRODUCTS ---------------- */}
      <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 bg-slate-900/20 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Trending Now</h2>
            <p className="mt-4 text-slate-400">Handpicked premium products driving the market today.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm transition-all hover:border-white/10"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-950">
                  <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/10">
                    {product.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-white group-hover:text-indigo-300 transition-colors">{product.name}</h3>
                  <p className="mt-1 text-slate-400">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button variant="outline" asChild className="rounded-full border-white/10 bg-slate-900 text-white hover:bg-slate-800 hover:text-white px-8">
               <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-white text-center sm:text-4xl mb-16">
            Loved by thousands
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((test, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/30 p-8 backdrop-blur-sm"
              >
                <Quote className="absolute right-6 top-6 h-10 w-10 text-white/5" />
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-slate-300 mb-8">&quot;{test.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center font-bold text-white shadow-lg">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{test.author}</p>
                    <p className="text-sm text-slate-500">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- NEWSLETTER CTA ---------------- */}
      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/50 p-10 sm:p-20 text-center backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-fuchsia-500/10" />
            <h2 className="relative z-10 text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Stay ahead of the curve.
            </h2>
            <p className="relative z-10 max-w-xl mx-auto text-slate-400 mb-10 text-lg">
              Join 10,000+ shoppers receiving the latest drops, exclusive discounts, and marketplace news.
            </p>
            <form className="relative z-10 flex max-w-md mx-auto flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="h-12 flex-1 rounded-full border-white/10 bg-slate-950/50 px-6 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
              />
              <Button type="submit" className="h-12 rounded-full bg-white px-8 text-slate-950 hover:bg-slate-200 hover:scale-105 transition-all font-semibold">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950 pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-xl text-white">AuraMarket</span>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                The elite multivendor commerce platform designed for modern brands and discerning shoppers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="/products" className="hover:text-white transition">Browse Products</Link></li>
                <li><Link href="/register" className="hover:text-white transition">Become a Vendor</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} AuraMarket Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              {/* Social icons placeholders */}
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white cursor-pointer transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white cursor-pointer transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
