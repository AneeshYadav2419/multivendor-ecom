// import { ReactNode } from "react";

// interface StatCardProps {
//     title: string;
//     value: number;
//     icon?: ReactNode;
// }

// export function StatCard({
//     title,
//     value,
//     icon,
// }: StatCardProps) {
//     return (
//         <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 transition-all hover:scale-[1.02] hover:border-indigo-500/50">
//             <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">
//                     {title}
//                 </span>

//                 {icon}
//             </div>

//             <h2 className="mt-4 text-4xl font-bold tracking-tight">
//                 {value}
//             </h2>
//         </div>
//     );
// }
import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: number;
    icon?: ReactNode;
}

export function StatCard({
    title,
    value,
    icon,
}: StatCardProps) {
    return (
        <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 transition-all hover:scale-[1.02] hover:border-indigo-500/50">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                    {title}
                </span>

                {icon}
            </div>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
                {value}
            </h2>
        </div>
    );
}