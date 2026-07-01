"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/axios";
import { Loader2, Truck, CreditCard, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/features/cart/hooks/use-cart";
import { formatPrice } from "@/features/products/lib/format-price";
import { Button } from "@/components/ui/button";

export default function ShippingPage() {
  const router = useRouter();
  const { data: cart, isLoading: cartLoading } = useCart();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    paymentMethod: "UPI",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (form.shippingName.trim().length < 2) {
      alert("Enter a valid name");
      return false;
    }
    if (!/^[0-9]{10}$/.test(form.shippingPhone)) {
      alert("Enter a valid 10-digit phone number");
      return false;
    }
    if (form.addressLine1.trim().length < 5) {
      alert("Address is too short");
      return false;
    }
    if (!form.city.trim() || !form.state.trim() || !form.country.trim()) {
      alert("City, State, and Country are required");
      return false;
    }
    if (!/^[0-9]{6}$/.test(form.pincode)) {
      alert("Invalid pincode");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const coupon = localStorage.getItem(
        "appliedCoupon"
      );

      const appliedCoupon = coupon
        ? JSON.parse(coupon)
        : null;

      const payload = {
        ...form,
        couponCode: appliedCoupon?.code,
      };

      console.log("ORDER PAYLOAD", payload);

      const res = await api.post("/orders", payload);

      const order = res.data.data;

      localStorage.setItem("dbOrderId", order.id);
      localStorage.setItem("orderAmount", String(order.totalAmount));

      router.push("/checkout");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const total = cart?.totalAmount ?? 0;
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    const coupon =
      localStorage.getItem("appliedCoupon");

    if (coupon) {
      const parsed = JSON.parse(coupon);

      setDiscount(
        parsed.discountAmount
      );

      setFinalTotal(
        parsed.finalAmount
      );
    } else {
      setFinalTotal(total);
    }
  }, [total]);

  return (
    <main className="min-h-screen bg-[#020617] selection:bg-indigo-500/30">

      {/* Top Navbar specifically for Checkout */}
      <div className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto flex flex-col sm:flex-row gap-2 py-3 sm:py-0 h-auto sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-xl font-bold text-white tracking-tight">AuraMarket</span>
          <div className="flex items-center flex-wrap justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-slate-500">
            <span className="text-white flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" /> Cart</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-indigo-400 font-semibold border-b-2 border-indigo-400 pb-1 flex items-center gap-1">Information</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">

          {/* Left Form Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Shipping Information</h1>
              <p className="text-slate-400 mt-2">Enter your delivery details to complete the order.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-sm space-y-6">
                <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                    <Truck className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Delivery Address</h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                    <Input
                      name="shippingName"
                      value={form.shippingName}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <Input
                      name="shippingPhone"
                      value={form.shippingPhone}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Address Line 1</label>
                  <Input
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                    placeholder="House no, Street, Area"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Address Line 2 (Optional)</label>
                  <Input
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                    placeholder="Landmark, Apartment, Suite"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">City</label>
                    <Input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">State</label>
                    <Input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Country</label>
                    <Input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      readOnly
                      className="h-12 rounded-xl border-white/10 bg-slate-900/80 text-white focus-visible:ring-0 opacity-80 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pincode</label>
                    <Input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Preview */}
              <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-sm space-y-6">
                <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Payment Method</h2>
                </div>

                <div className="space-y-1">
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl border border-white/10 bg-slate-950/50 px-4 text-white focus-visible:ring-indigo-500 outline-none"
                  >
                    <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="COD">Cash on Delivery (if available)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-2 ml-1 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> All transactions are secure and encrypted.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <button type="button" onClick={() => router.push('/cart')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center">
                  <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Return to cart
                </button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 px-10 text-base font-semibold text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              </div>

            </form>
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-900/30 p-8 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              {cartLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                    {cart?.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-xl bg-slate-950 overflow-hidden border border-white/5 shrink-0">
                          {/* Assuming item.product.images[0] exists, fallback omitted for brevity */}
                          <img src={item.product.images?.[0] || "/file.svg"} alt={item.product.name} className="h-full w-full object-cover" />
                          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700/80 text-[10px] font-bold text-white backdrop-blur-sm z-10 border border-white/10">{item.quantity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{item.product.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{item.product.vendor?.storeName}</p>
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {formatPrice((typeof item.product.price === "string" ? parseFloat(item.product.price) : item.product.price) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm border-t border-white/10 pt-6 mb-6">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span className="text-white font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Shipping</span>
                      <span className="text-emerald-400 font-medium">Free</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount</span>
                        <span>
                          -{formatPrice(discount)}
                        </span>
                      </div>
                    )}

                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-6">
                    <div>
                      <span className="block text-base font-medium text-slate-300">Total</span>
                    </div>
                    {/* <span className="text-3xl font-extrabold text-white">{formatPrice(total)}</span> */}
                    <span className="text-3xl font-extrabold text-white">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}