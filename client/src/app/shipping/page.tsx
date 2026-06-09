
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/axios";
import { Loader2, Truck } from "lucide-react";

export default function ShippingPage() {
    const router = useRouter();

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validateForm = () => {
        if (form.shippingName.trim().length < 2) {
            alert("Enter valid name");
            return false;
        }

        if (!/^[0-9]{10}$/.test(form.shippingPhone)) {
            alert("Enter valid phone number");
            return false;
        }

        if (form.addressLine1.trim().length < 5) {
            alert("Address is too short");
            return false;
        }

        if (!form.city.trim()) {
            alert("City is required");
            return false;
        }

        if (!form.state.trim()) {
            alert("State is required");
            return false;
        }

        if (!form.country.trim()) {
            alert("Country is required");
            return false;
        }

        if (!/^[0-9]{6}$/.test(form.pincode)) {
            alert("Invalid pincode");
            return false;
        }

        return true;
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            const res = await api.post("/orders", form);
            console.log("FULL RESPONSE =", res);
            console.log("RESPONSE DATA =", res.data);

            //console.log("ORDER CREATED:", res.data);


            const order = res.data.data;
            console.log("SAVING ORDER ID =", order.id);
            console.log("SAVING AMOUNT =", order.totalAmount);

            localStorage.setItem("dbOrderId", order.id);
            localStorage.setItem("orderAmount", String(order.totalAmount));

            console.log(
                "CHECK STORAGE AMOUNT =",
                localStorage.getItem("orderAmount")
            );

            router.push("/checkout");
        } catch (error: any) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Failed to create order"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-10">
            <div className="mx-auto max-w-3xl">

                <div className="mb-8 flex items-center gap-3">
                    <Truck className="h-8 w-8 text-indigo-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Shipping Details
                        </h1>
                        <p className="text-slate-400">
                            Enter your delivery information
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                    <div className="grid gap-4 md:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Full Name
                            </label>

                            <input
                                name="shippingName"
                                value={form.shippingName}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                                placeholder="Aneesh Yadav"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Phone Number
                            </label>

                            <input
                                name="shippingPhone"
                                value={form.shippingPhone}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                                placeholder="9876543210"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Address Line 1
                        </label>

                        <input
                            name="addressLine1"
                            value={form.addressLine1}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                            placeholder="House no, Street, Area"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Address Line 2
                        </label>

                        <input
                            name="addressLine2"
                            value={form.addressLine2}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                            placeholder="Landmark (optional)"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                City
                            </label>

                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                                placeholder="Delhi"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                State
                            </label>

                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                                placeholder="Delhi"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Country
                            </label>

                            <input
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Pincode
                            </label>

                            <input
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                                placeholder="110001"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Payment Method
                        </label>

                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                        >
                            <option value="UPI">UPI</option>
                            <option value="CARD">CARD</option>
                            <option value="COD">COD</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex h-12 w-full items-center justify-center rounded-lg bg-indigo-600 font-semibold text-white hover:bg-indigo-500"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Creating Order...
                            </>
                        ) : (
                            "Continue To Payment"
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}