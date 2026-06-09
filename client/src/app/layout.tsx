import type { Metadata } from "next";

import "./globals.css";
import Script from "next/script";


import QueryProvider from "@/providers/query-provider";
import { AuthHydrationProvider } from "@/providers/auth-hydration-provider";

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AuraMarket — Elite Multivendor Commerce",
  description:
    "Discover products from trusted vendors. Secure marketplace built for customers, sellers, and admins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <QueryProvider>
          <AuthHydrationProvider>
            {children}
          </AuthHydrationProvider>

          <Toaster
            richColors
            position="top-right"
          />
        </QueryProvider>
      </body>
    </html>
  );
}