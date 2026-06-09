// import prisma from "../../config/prismaClient.js";

// export const getDashboardStats = async () => {
//   const [
//     totalUsers,
//     totalVendors,
//     pendingVendors,
//     totalProducts,
//     pendingProducts,
//     totalOrders,
//   ] = await Promise.all([
//     prisma.user.count(),
//     prisma.vendor.count(),
//     prisma.vendor.count({
//       where: {
//         status: "PENDING",
//       },
//     }),
//     prisma.product.count(),
//     prisma.product.count({
//       where: {
//         status: "DRAFT",
//       },
//     }),
//     prisma.order.count(),
//   ]);

//   return {
//     totalUsers,
//     totalVendors,
//     pendingVendors,
//     totalProducts,
//     pendingProducts,
//     totalOrders,
//   };
// };
// import prisma from "../../config/prismaClient.js";

// export const getDashboardStats = async () => {
//   const [
//     totalUsers,
//     totalVendors,
//     activeVendors,
//     pendingVendors,
//     totalProducts,
//     pendingProducts,
//     activeProducts,
//     totalOrders,
//     completedOrders,
//   ] = await Promise.all([
//     prisma.user.count(),

//     prisma.vendor.count(),

//     prisma.vendor.count({
//       where: { status: "APPROVED" },
//     }),

//     prisma.vendor.count({
//       where: { status: "PENDING" },
//     }),

//     prisma.product.count(),

//     prisma.product.count({
//       where: { status: "DRAFT" },
//     }),

//     prisma.product.count({
//       where: { status: "ACTIVE" },
//     }),

//     prisma.order.count(),

//     prisma.order.count({
//       where: { status: "DELIVERED" },
//     }),
//   ]);

//   return {
//     totalUsers,
//     totalVendors,
//     activeVendors,
//     pendingVendors,
//     totalProducts,
//     pendingProducts,
//     activeProducts,
//     totalOrders,
//     completedOrders,
//   };
// };
import prisma from "../../config/prismaClient.js";

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalVendors,
    activeVendors,
    pendingVendors,

    totalProducts,
    pendingProducts,
    activeProducts,

    totalOrders,
    deliveredOrders,

    paidOrders,
    pendingOrders,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.vendor.count(),
    prisma.vendor.count({ where: { status: "APPROVED" } }),
    prisma.vendor.count({ where: { status: "PENDING" } }),

    prisma.product.count(),
    prisma.product.count({ where: { status: "DRAFT" } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),

    prisma.order.count(),

    prisma.order.count({
      where: { status: "DELIVERED" },
    }),

    prisma.order.count({
      where: { paymentStatus: "PAID" },
    }),

    prisma.order.count({
      where: { paymentStatus: "PENDING" },
    }),
  ]);

  // 💰 Revenue calculation (IMPORTANT ADDITION)
  const revenueData = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      paymentStatus: "PAID",
    },
  });

  const totalRevenue = revenueData._sum.totalAmount || 0;

  return {
    totalUsers,
    totalVendors,
    activeVendors,
    pendingVendors,

    totalProducts,
    pendingProducts,
    activeProducts,

    totalOrders,
    deliveredOrders,

    paidOrders,
    pendingOrders,

    totalRevenue,
  };
};