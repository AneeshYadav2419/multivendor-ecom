export interface Setting {
    id: string;

    storeName: string;
    supportEmail: string;
    supportPhone: string;

    currency: string;
    taxRate: number;

    maintenanceMode: boolean;
}