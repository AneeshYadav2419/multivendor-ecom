// "use client";

// import { useState } from "react";
// import OrdersTable from "@/components/admin/orders/OrdersTable";
// import { useOrders } from "@/features/admin/hooks/useOrders";
// import { Order } from "@/types/order";

// export default function AdminOrdersPage() {
//     const { orders, loading } = useOrders();
//     const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//     return (
//         <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-white">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <h1 className="text-2xl font-semibold">Orders</h1>
//             </div>

//             {/* Table */}
//             <OrdersTable
//                 orders={orders}
//                 loading={loading}
//                 // onSelect={(order) => setSelectedOrder(order)}
//                 onSelect={(order) => {
//                     if (!order?.id) {
//                         console.log("INVALID ORDER:", order);
//                         return;
//                     }

//                     setSelectedOrder(order);
//                 }}
//             />

//             {/* Drawer placeholder (next step) */}
//             {selectedOrder && (
//                 <div className="fixed right-0 top-0 h-full w-[420px] bg-slate-900 border-l border-slate-800 p-4">
//                     <h2 className="text-lg font-semibold">Order Details</h2>
//                     <p className="text-sm text-slate-400">
//                         #{selectedOrder.id}
//                     </p>

//                     <button
//                         onClick={() => setSelectedOrder(null)}
//                         className="mt-4 text-sm text-red-400"
//                     >
//                         Close
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";

import { useState } from "react";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import { useOrders } from "@/features/admin/hooks/useOrders";
import { Order } from "@/types/order";

export default function AdminOrdersPage() {
    const { orders, loading } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-semibold">
                    Orders
                </h1>
            </div>

            {/* TABLE */}
            <OrdersTable
                orders={orders}
                loading={loading}
                onSelect={(order) => {
                    if (!order?.id) return;
                    setSelectedOrder(order);
                }}
            />

            {/* DRAWER */}
            {selectedOrder && (
                <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] max-w-full bg-slate-900 border-l border-slate-800 p-4 sm:p-6 overflow-y-auto shadow-2xl">
                    <h2 className="text-lg font-semibold">
                        Order Details
                    </h2>

                    <p className="text-sm text-slate-400">
                        #{selectedOrder.id}
                    </p>

                    <div className="mt-4 space-y-2 text-sm">
                        <p>
                            <span className="text-slate-400">Customer:</span>{" "}
                        
                           {selectedOrder.customerName}
                        </p>

                        <p>
                            <span className="text-slate-400">Email:</span>{" "}
                
                            {selectedOrder.customerEmail}
                        </p>

                        <p>
                            <span className="text-slate-400">Status:</span>{" "}
                          
                              {selectedOrder.fulfillmentStatus}
                        </p>

                        <p>
                            <span className="text-slate-400">Payment:</span>{" "}
                            {selectedOrder.paymentStatus}
                        </p>
                    </div>

                    <button
                        onClick={() => setSelectedOrder(null)}
                        className="mt-6 text-sm text-red-400"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}