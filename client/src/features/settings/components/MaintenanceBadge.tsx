"use client";

export default function MaintenanceBadge({ maintenanceMode }: { maintenanceMode: boolean }) {
    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
      ${maintenanceMode
                    ? "bg-red-500/10 text-red-500 border border-red-500/30"
                    : "bg-green-500/10 text-green-500 border border-green-500/30"
                }`}
        >
            <span className={`h-2 w-2 rounded-full ${maintenanceMode ? "bg-red-500" : "bg-green-500"}`} />
            {maintenanceMode ? "Maintenance Mode Enabled" : "System Live"}
        </div>
    );
}