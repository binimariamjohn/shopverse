import { apiFetch, authHeader } from "./http";
import type { Order, OrdersPage } from "../types/Order";

export function checkout(
    token: string,
    shippingAddress: string,
    paymentCardNumber: string
): Promise<Order> {
    return apiFetch<Order>("/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(token),
        },
        body: JSON.stringify({ shippingAddress, paymentCardNumber }),
    });
}

export function getOrders(
    token: string,
    page: number = 0,
    size: number = 10
): Promise<OrdersPage> {
    return apiFetch<OrdersPage>(
        `/orders?page=${page}&size=${size}`,
        { headers: authHeader(token) }
    );
}

export function getOrderById(token: string, id: number): Promise<Order> {
    return apiFetch<Order>(`/orders/${id}`, {
        headers: authHeader(token),
    });
}
