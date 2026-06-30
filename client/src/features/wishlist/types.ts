

export interface WishlistItem {
    id: string;
    productId: string;
    createdAt: string;
    product: {
        id: string;
        name: string;
        slug: string;
        price: string;
        images: string[];
        stock: number;
        category: {
            name: string;
        };
    };
}

export interface Wishlist {
    id?: string;
    items: WishlistItem[];
    totalItems: number;
}

export interface WishlistResponse {
    success: boolean;
    data: Wishlist;
}

export interface ToggleWishlistResponse {
    success: boolean;
    message: string;
    data: {
        added: boolean;
    };
}