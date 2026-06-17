export interface CartProductRef {
  id: string;
  name: string;
  price: string | number;
  images: string[];
  stock: number;
  slug: string;
    vendor?: {
    storeName: string;
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  cartId: string;
  product: CartProductRef;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}
