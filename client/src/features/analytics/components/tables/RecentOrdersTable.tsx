import { RecentOrder } from "../../types/analytics.types";

interface Props {
    orders: RecentOrder[];
}

export default function RecentOrdersTable({
    orders,
}: Props) {
    return (
        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/50 p-6 backdrop-blur-sm">
            <h2 className="mb-6 text-lg font-semibold text-white">
                Recent Orders
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="pb-3 text-left text-slate-400">
                                Customer
                            </th>

                            <th className="pb-3 text-left text-slate-400">
                                Status
                            </th>

                            <th className="pb-3 text-left text-slate-400">
                                Payment
                            </th>

                            <th className="pb-3 text-right text-slate-400">
                                Amount
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b border-slate-800/50"
                            >
                                <td className="py-4 text-white">
                                    {order.customerName}
                                </td>

                                <td className="py-4 text-slate-300">
                                    {order.status}
                                </td>

                                <td className="py-4 text-slate-300">
                                    {order.paymentStatus}
                                </td>

                                <td className="py-4 text-right text-emerald-400">
                                    ₹{order.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}