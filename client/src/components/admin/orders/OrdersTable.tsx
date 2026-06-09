// "use client";

// import { Order } from "@/types/order";
// import OrderStatusBadge from "./OrderStatusBadge";

// interface Props {
//     orders: Order[];
//     loading: boolean;
//     onSelect: (order: Order) => void;
// }

// export default function OrdersTable({ orders, loading, onSelect }: Props) {
//     if (loading) {
//         return <div className="p-6 text-slate-400">Loading orders...</div>;
//     }

//     if (!orders.length) {
//         return (
//             <div className="p-10 text-center text-slate-500">
//                 No orders found
//             </div>
//         );
//     }

//     return (
//         <div className="overflow-x-auto rounded-xl border border-slate-800">
//             <table className="w-full text-sm">
//                 <thead className="bg-slate-900 text-slate-400">
//                     <tr>
//                         <th className="p-3 text-left">Order ID</th>
//                         <th className="p-3 text-left">Customer</th>
//                         <th className="p-3 text-left">Amount</th>
//                         <th className="p-3 text-left">Payment</th>
//                         <th className="p-3 text-left">Status</th>
//                         <th className="p-3 text-left">Date</th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {orders.map((order) => (
//                         <tr
//                             key={order.id}
//                             onClick={() => onSelect(order)}
//                             className="border-t border-slate-800 hover:bg-slate-900 cursor-pointer"
//                         >
//                             <td className="p-3 font-medium text-slate-200">
//                                 #{order.id.slice(0, 8)}
//                             </td>

//                             <td className="p-3">
//                                 <div className="text-slate-200">{order.customerName}</div>
//                                 <div className="text-xs text-slate-500">
//                                     {order.customerEmail}
//                                 </div>
//                             </td>

//                             <td className="p-3 text-slate-200">
//                                 ₹{order.totalAmount}
//                             </td>

//                             <td className="p-3">
//                                 <OrderStatusBadge status={order.paymentStatus} />
//                             </td>

//                             <td className="p-3">
//                                 <OrderStatusBadge status={order.fulfillmentStatus} />
//                             </td>

//                             <td className="p-3 text-slate-400">
//                                 {new Date(order.createdAt).toLocaleDateString()}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
"use client";

import { Order } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
    orders: Order[];
    loading: boolean;
    onSelect: (order: Order) => void;
}

export default function OrdersTable({ orders, loading, onSelect }: Props) {
    if (loading) {
        return (
            <div className="p-6 text-slate-400">
                Loading orders...
            </div>
        );
    }

    if (!Array.isArray(orders) || orders.length === 0) {
        return (
            <div className="p-10 text-center text-slate-500">
                No orders found
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
                <thead className="bg-slate-900 text-slate-400">
                    <tr>
                        <th className="p-3 text-left">Order ID</th>
                        <th className="p-3 text-left">Customer</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-left">Payment Status</th>
                        <th className="p-3 text-left">Order Status</th>
                        <th className="p-3 text-left">Date</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <tr
                            key={order.id}
                            onClick={() => onSelect(order)}
                            className="border-t border-slate-800 hover:bg-slate-900 cursor-pointer"
                        >
                            {/* ORDER ID */}
                            <td className="p-3 font-medium text-slate-200">
                                #{order.id.slice(0, 8)}
                            </td>

                            {/* CUSTOMER */}
                            <td className="p-3">
                                <div className="text-slate-200">
                                    {order.customer?.name || "Unknown"}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {order.customer?.email || "-"}
                                </div>
                            </td>

                            {/* AMOUNT */}
                            <td className="p-3 text-slate-200">
                                ₹{Number(order.totalAmount).toFixed(2)}
                            </td>

                            {/* PAYMENT STATUS */}
                            <td className="p-3">
                                <OrderStatusBadge status={order.paymentStatus} />
                            </td>

                            {/* ORDER STATUS */}
                            <td className="p-3">
                                <OrderStatusBadge status={order.status} />
                            </td>

                            {/* DATE */}
                            <td className="p-3 text-slate-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}