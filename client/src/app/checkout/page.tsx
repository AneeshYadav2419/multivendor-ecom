"use client";

import Link from "next/link";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Construction className="h-12 w-12 text-indigo-400" />
      <h1 className="mt-4 text-2xl font-semibold text-white">Checkout</h1>
      <p className="mt-2 max-w-md text-slate-400">
        Order placement and Razorpay payment will connect here. Your cart items are
        saved on the server.
      </p>
      <Button asChild className="mt-8 bg-white text-slate-900">
        <Link href="/cart">Back to cart</Link>
      </Button>
    </main>
  );
}
