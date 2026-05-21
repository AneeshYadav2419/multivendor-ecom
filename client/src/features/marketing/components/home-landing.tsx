"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Store,
  Shield,
  Zap,
  ShoppingBag,
  TrendingUp,
  Users,
  CheckCircle2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const features = [
  {
    icon: Store,
    title: "Multi-vendor storefronts",
    description:
      "Independent sellers run branded shops under one marketplace with unified checkout.",
  },
  {
    icon: Shield,
    title: "Enterprise-grade security",
    description:
      "JWT sessions, refresh rotation, and role-based access built for production scale.",
  },
  {
    icon: Zap,
    title: "Fast vendor onboarding",
    description:
      "Register as a vendor, get approved, and list products in minutes—not weeks.",
  },
  {
    icon: TrendingUp,
    title: "Real-time insights",
    description:
      "Track orders, inventory, and revenue from a single dashboard experience.",
  },
];

const steps = [
  { step: "01", title: "Create your account", body: "Sign up as a customer or apply as a vendor." },
  { step: "02", title: "Browse or list", body: "Shop curated products or publish your catalog." },
  { step: "03", title: "Checkout securely", body: "Complete purchases with trusted payment flows." },
];

const stats = [
  { label: "Active vendors", value: "500+", icon: Users },
  { label: "Products listed", value: "12k+", icon: Package },
  { label: "Orders fulfilled", value: "98%", icon: CheckCircle2 },
];

export const HomeLanding: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-20 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">AuraMarket</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <Link href="/products" className="transition hover:text-white">
              Products
            </Link>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-white/5">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-600 hover:to-fuchsia-600"
            >
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <motion.div
                custom={0}
                variants={fadeUp}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-200"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
                </span>
                The elite multivendor commerce platform
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeUp}
                className="max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
              >
                One marketplace.{" "}
                <span className="bg-gradient-to-r from-indigo-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                  Infinite brands.
                </span>
              </motion.h1>

              <motion.p
                custom={2}
                variants={fadeUp}
                className="mt-6 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg"
              >
                AuraMarket connects customers, vendors, and admins in a secure,
                scalable ecosystem—built with modern auth, real-time catalog, and
                enterprise-ready architecture.
              </motion.p>

              <motion.div
                custom={3}
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              >
                <Button
                  size="lg"
                  asChild
                  className="h-12 gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-8 text-base shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-fuchsia-600"
                >
                  <Link href="/products">
                    Explore products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 border-slate-700 bg-slate-900/50 px-8 text-base text-slate-200 hover:bg-slate-800/80 hover:text-white"
                >
                  <Link href="/register">Start selling</Link>
                </Button>
              </motion.div>

              <motion.div
                custom={4}
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 lg:justify-start"
              >
                {["No credit card required", "Vendor approval workflow", "Secure JWT auth"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                      {item}
                    </span>
                  )
                )}
              </motion.div>
            </motion.div>

            {/* Hero visual — dashboard mock */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/80 p-1 shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-2 text-xs text-slate-500">dashboard.auramarket.app</span>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Total revenue</p>
                      <p className="text-2xl font-bold text-white">₹2,84,500</p>
                    </div>
                    <div className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                      +24.5%
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Orders", value: "1,248", color: "from-indigo-500/20 to-indigo-500/5" },
                      { label: "Vendors", value: "86", color: "from-fuchsia-500/20 to-fuchsia-500/5" },
                      { label: "Products", value: "3.2k", color: "from-violet-500/20 to-violet-500/5" },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className={`rounded-xl border border-slate-800 bg-gradient-to-b ${card.color} p-3`}
                      >
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          {card.label}
                        </p>
                        <p className="mt-1 text-lg font-semibold">{card.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex h-24 items-end gap-1.5 rounded-xl border border-slate-800 bg-slate-950/50 px-4 pb-3 pt-4">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-indigo-600 to-fuchsia-500 opacity-80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-white/5 bg-slate-900/40 py-12 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:px-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
                <stat.icon className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Platform features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to run a marketplace
            </h2>
            <p className="mt-4 text-slate-400">
              From vendor onboarding to secure checkout—AuraMarket is engineered for
              growth-stage SaaS standards.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 transition hover:border-indigo-500/40 hover:bg-slate-900/70"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 text-indigo-300 transition group-hover:from-indigo-500/30 group-hover:to-fuchsia-500/30">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative z-10 border-t border-white/5 bg-gradient-to-b from-slate-900/50 to-slate-950 px-4 py-20 sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-3 text-slate-400">Launch in three simple steps</p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative text-center md:text-left"
              >
                <span className="text-5xl font-black text-slate-800">{item.step}</span>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.body}</p>
                {i < steps.length - 1 && (
                  <div className="absolute -right-4 top-8 hidden h-px w-8 bg-gradient-to-r from-indigo-500/50 to-transparent md:block lg:-right-6 lg:w-12" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-fuchsia-950/50 p-10 text-center sm:p-14"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
            <ShoppingBag className="mx-auto h-10 w-10 text-indigo-400" />
            <h2 className="relative mt-4 text-2xl font-bold sm:text-3xl">
              Ready to experience AuraMarket?
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-slate-400">
              Join as a shopper or open your vendor store today. Built for modern
              multivendor commerce at scale.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="bg-white text-slate-900 hover:bg-slate-100"
              >
                <Link href="/register">Create free account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-slate-600 text-white hover:bg-white/10"
              >
                <Link href="/products">Browse catalog</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold">AuraMarket</span>
          </div>
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} AuraMarket. Elite multivendor commerce.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/products" className="hover:text-slate-300">
              Products
            </Link>
            <Link href="/login" className="hover:text-slate-300">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-slate-300">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
