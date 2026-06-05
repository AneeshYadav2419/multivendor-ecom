import type { Metadata } from "next";

import "./globals.css";


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