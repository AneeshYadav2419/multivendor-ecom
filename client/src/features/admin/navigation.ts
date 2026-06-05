import {
    LayoutDashboard,
    Store,
    Package,
    FolderTree,
    Users,
    ShoppingCart,
    MessageSquare,
    Ticket,
    BarChart3,
    Settings,
} from "lucide-react";

export const adminNavigation = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Vendors",
        href: "/admin/vendors",
        icon: Store,
    },
    {
        title: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        title: "Reviews",
        href: "/admin/reviews",
        icon: MessageSquare,
    },
    {
        title: "Coupons",
        href: "/admin/coupons",
        icon: Ticket,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];