import { api } from "@/lib/api/axios";

// ─────────────────────────────
// Vendor APIs
// ─────────────────────────────

export const getPendingVendors = async () => {
    const res = await api.get("/admin/pending");
    return res.data;
};

export const getAllVendors = async (status?: string) => {
    const res = await api.get("/vendors", {
        params: status ? { status } : {},
    });
    return res.data;
};

export const approveVendor = async (id: string) => {
    const res = await api.patch(`/admin/${id}/approve`);
    return res.data;
};

export const rejectVendor = async (id: string, reason?: string) => {
    const res = await api.patch(`/admin/${id}/reject`, { reason });
    return res.data;
};

export const suspendVendor = async (id: string) => {
    const res = await api.patch(`/admin/${id}/suspend`);
    return res.data;
};

// ✅ THIS MUST EXIST (fix your error)
export const updateVendorStatus = async (
    vendorId: string,
    status: string
) => {
    const res = await api.patch(`/vendors/${vendorId}/status`, {
        status,
    });
    return res.data;
};