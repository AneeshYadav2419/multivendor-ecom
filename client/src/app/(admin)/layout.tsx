// import { ReactNode } from "react";
// import { AdminSidebar } from "@/components/admin/sidebar";
// import { AdminHeader } from "@/components/admin/header";
// import { AdminGuard } from "@/components/auth/admin-guard";

// export default function AdminLayout({
//     children,
// }: {
//     children: ReactNode;
// }) {
//     return (
//         <AdminGuard>
//             <div className="flex min-h-screen">
//                 <AdminSidebar />

//                 <div className="flex flex-col flex-1">
//                     <AdminHeader />

//                     <main className="flex-1 p-6 overflow-auto">
//                         {children}
//                     </main>
//                 </div>
//             </div>
//         </AdminGuard>
//     );
// }

import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { AdminGuard } from "@/components/auth/admin-guard";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
                <AdminSidebar />

                <div className="flex flex-1 flex-col overflow-hidden">
                    <AdminHeader />

                    <main className="flex-1 overflow-y-auto bg-slate-950">
                        <div className="mx-auto max-w-[1600px] p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}