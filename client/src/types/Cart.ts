export type CartItem = {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
};

export type Cart = {
    items: CartItem[];
    total: number;
    itemCount: number;
};
