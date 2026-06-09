import { cn } from "@/lib/utils";

export default function OrderStatusBadge({
    status,
}: {
    status: "PAID" | "PENDING" | "FAILED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}) {
    const styles = {
        PAID: "bg-green-500/10 text-green-400",
        PENDING: "bg-yellow-500/10 text-yellow-400",
        FAILED: "bg-red-500/10 text-red-400",
        PROCESSING: "bg-blue-500/10 text-blue-400",
        SHIPPED: "bg-indigo-500/10 text-indigo-400",
        DELIVERED: "bg-emerald-500/10 text-emerald-400",
        CANCELLED: "bg-gray-500/10 text-gray-400",
    };

    return (
        <span className={cn("px-2 py-1 rounded-md text-xs font-medium", styles[status])}>
            {status}
        </span>
    );
}