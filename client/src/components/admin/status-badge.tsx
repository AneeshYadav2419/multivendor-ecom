interface Props {
    status: string;
}

export function StatusBadge({ status }: Props) {
    const styles = {
        PENDING:
            "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

        APPROVED:
            "bg-green-500/10 text-green-400 border-green-500/20",

        REJECTED:
            "bg-red-500/10 text-red-400 border-red-500/20",

        SUSPENDED:
            "bg-slate-500/10 text-slate-300 border-slate-500/20",
    };

    return (
        <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[status as keyof typeof styles]
                }`}
        >
            {status}
        </span>
    );
}