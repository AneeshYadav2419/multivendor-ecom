
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Construction } from "lucide-react";
// import { api } from "@/lib/api/axios";

// export default function CheckoutPage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [cart, setCart] = useState<any>(null);

//   // =========================
//   // 1. LOAD CART
//   // =========================

//   useEffect(() => {
//     console.log(
//       "LOCAL STORAGE ORDER ID =",
//       localStorage.getItem("dbOrderId")
//     );
//   }, []);

//   useEffect(() => {
//     async function fetchCart() {
//       try {
//         const res = await api.get("/cart");
//         console.log("CART DATA:", res.data);
//         setCart(res.data);
//       } catch (err) {
//         console.error("Cart error:", err);
//       }
//     }

//     fetchCart();
//   }, []);

//   // =========================
//   // 2. INIT PAYMENT
//   // =========================
//   useEffect(() => {
//     if (!cart?.data?.totalAmount) return;

//     //let dbOrderId: string; // 🔥 IMPORTANT FIX

//     async function initPayment() {
//       try {
//         console.log("Checkout started...");
//         const dbOrderId = localStorage.getItem("dbOrderId");
//         const amount = localStorage.getItem("orderAmount");

//         // =========================
//         // CREATE ORDER
//         // =========================
//         const res = await api.post("/payments/create-order", {
//           // amount: cart.data.totalAmount,
//           amount: Number(amount),
//         });

//         const data = res.data;

//         console.log("ORDER DATA:", data);

//         if (!data?.order?.id) {
//           alert("Order not created");
//           return;
//         }
//         const dbOrderId = localStorage.getItem("dbOrderId");

//         console.log("DB ORDER FROM STORAGE =", dbOrderId);

//         if (!dbOrderId) {
//           alert("Order not found");
//           router.push("/shipping");
//           return;
//         }

//         // dbOrderId = data.order.id; // 🔥 SAVE DB ORDER ID

//         // =========================
//         // CHECK RAZORPAY SDK
//         // =========================
//         if (!(window as any).Razorpay) {
//           alert("Razorpay SDK not loaded");
//           return;
//         }

//         // =========================
//         // RAZORPAY OPTIONS
//         // =========================
//         const options = {
//           key: data.razorpayKey,
//           amount: data.order.amount,
//           currency: data.order.currency,
//           name: "My Store",
//           description: "Order Payment",
//           order_id: data.order.id,

//           handler: async function (response: any) {
//             console.log("PAYMENT SUCCESS:", response);
//             console.log("VERIFY PAYLOAD", {
//               orderId: dbOrderId,

//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             });

//             console.log("LOCAL STORAGE ORDER =", localStorage.getItem("dbOrderId"));

//             try {
//               // =========================
//               // VERIFY PAYMENT (FIXED)
//               // =========================
//               const verifyRes = await api.post("/payments/verify", {
//                 orderId: dbOrderId, // 🔥 FIXED (NO UNDEFINED)

//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               });

//               console.log("DB ORDER ID =", dbOrderId);
//               console.log("RAZORPAY ORDER ID =", response.razorpay_order_id);

//               const verifyData = verifyRes.data;

//               console.log("VERIFY RESPONSE:", verifyData);

//               if (verifyData.success) {
//                 router.push("/success");
//               } else {
//                 alert("Payment verification failed");
//               }
//             } catch (err: any) {
//               console.error("Verify error response:", err?.response?.data);
//               console.error("Verify error:", err);
//               alert(JSON.stringify(err?.response?.data));
//             }
//           },

//           theme: {
//             color: "#528FF0",
//           },
//         };

//         const rzp = new (window as any).Razorpay(options);

//         rzp.on("payment.failed", function (response: any) {
//           console.log("PAYMENT FAILED:", response);
//           alert("Payment Failed");
//         });

//         rzp.open();

//         setLoading(false);
//       } catch (err) {
//         console.error("Checkout error:", err);
//         alert("Something went wrong");
//       }
//     }

//     initPayment();
//   }, [cart, router]);

//   return (
//     <main className="flex min-h-[60vh] flex-col items-center justify-center text-center">
//       <Construction className="h-12 w-12 text-indigo-400" />
//       <p className="mt-4 text-white">
//         {loading ? "Initializing payment..." : "Redirecting..."}
//       </p>
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Construction } from "lucide-react";
import { api } from "@/lib/api/axios";

export default function CheckoutPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(
      "DB ORDER ID =",
      localStorage.getItem("dbOrderId")
    );

    console.log(
      "ORDER AMOUNT =",
      localStorage.getItem("orderAmount")
    );
  }, []);

  useEffect(() => {
    async function initPayment() {
      try {
        console.log("========== CHECKOUT ==========");

        const dbOrderId = localStorage.getItem("dbOrderId");
        const orderAmount = localStorage.getItem("orderAmount");

        console.log("DB ORDER ID =", dbOrderId);
        console.log("ORDER AMOUNT =", orderAmount);
        console.log("RAZORPAY SDK =", !!(window as any).Razorpay);

        // =========================
        // VALIDATION
        // =========================

        if (!dbOrderId) {
          alert("Order ID not found");
          router.push("/shipping");
          return;
        }

        if (!orderAmount) {
          alert("Order amount not found");
          router.push("/shipping");
          return;
        }

        // =========================
        // CHECK SDK
        // =========================

        if (!(window as any).Razorpay) {
          alert("Razorpay SDK not loaded");
          return;
        }

        // =========================
        // CREATE RAZORPAY ORDER
        // =========================

        const res = await api.post("/payments/create-order", {
          amount: Number(orderAmount),
        });

        console.log("CREATE ORDER RESPONSE =", res.data);

        const data = res.data;

        if (!data?.order?.id) {
          alert("Razorpay order creation failed");
          return;
        }

        // =========================
        // OPEN RAZORPAY
        // =========================

        const options = {
          key: data.razorpayKey,

          amount: data.order.amount,

          currency: data.order.currency,

          name: "Aura Market",

          description: "Order Payment",

          order_id: data.order.id,

          handler: async function (response: any) {
            try {
              console.log("PAYMENT SUCCESS =", response);

              console.log("VERIFY PAYLOAD =", {
                orderId: dbOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              const verifyRes = await api.post("/payments/verify", {
                orderId: dbOrderId,

                razorpay_order_id: response.razorpay_order_id,

                razorpay_payment_id: response.razorpay_payment_id,

                razorpay_signature: response.razorpay_signature,
              });

              console.log("VERIFY RESPONSE =", verifyRes.data);

              if (verifyRes.data.success) {
                localStorage.removeItem("dbOrderId");
                localStorage.removeItem("orderAmount");

                router.push("/success");
              } else {
                alert("Payment verification failed");
              }
            } catch (err: any) {
              console.error("VERIFY ERROR =", err);
              console.error("VERIFY RESPONSE =", err?.response?.data);

              alert(
                err?.response?.data?.message ||
                "Payment verification failed"
              );
            }
          },

          theme: {
            color: "#528FF0",
          },
        };

        const rzp = new (window as any).Razorpay(options);

        rzp.on("payment.failed", function (response: any) {
          console.error("PAYMENT FAILED =", response);
          alert("Payment Failed");
        });

        rzp.open();

        setLoading(false);
      } catch (err: any) {
        console.error("CHECKOUT ERROR =", err);
        console.error("CHECKOUT RESPONSE =", err?.response?.data);

        alert(
          err?.response?.data?.message ||
          "Unable to initialize payment"
        );
      }
    }

    initPayment();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center">
      <Construction className="h-12 w-12 text-indigo-400" />

      <p className="mt-4 text-white text-lg">
        {loading
          ? "Initializing payment..."
          : "Opening Razorpay..."}
      </p>
    </main>
  );
}