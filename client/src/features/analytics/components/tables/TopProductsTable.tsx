import { TopProduct } from "../../types/analytics.types";

interface Props {
    products: TopProduct[];
}

export default function TopProductsTable({
    products,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">
                Top Products
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="pb-3 text-left text-sm text-slate-400">
                                Product
                            </th>

                            <th className="pb-3 text-center text-sm text-slate-400">
                                Orders
                            </th>

                            <th className="pb-3 text-right text-sm text-slate-400">
                                Revenue
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.productId}
                                className="border-b border-slate-800/50"
                            >
                                <td className="py-4 text-white">
                                    {product.name}
                                </td>

                                <td className="py-4 text-center text-slate-300">
                                    {product.orders}
                                </td>

                                <td className="py-4 text-right font-medium text-emerald-400">
                                    ₹{product.revenue.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}