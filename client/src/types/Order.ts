export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type OrderItem = {
    productId: number;
    productName: string;
    priceAtPurchase: number;
    quantity: number;
    subtotal: number;
};

export type Order = {
    id: number;
    status: OrderStatus;
    shippingAddress: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
};

export type OrdersPage = {
    content: Order[];
    totalPages: number;
    totalElements: number;
};
