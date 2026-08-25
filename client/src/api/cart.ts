import { apiFetch, authHeader } from "./http";
import type { Cart } from "../types/Cart";

export function getCart(token: string): Promise<Cart> {
    return apiFetch<Cart>("/cart", {
        headers: authHeader(token),
    });
}

export function addToCart(
    token: string,
    productId: number,
    quantity: number = 1
): Promise<Cart> {
    return apiFetch<Cart>("/cart/items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(token),
        },
        body: JSON.stringify({ productId, quantity }),
    });
}

export function updateCartItem(
    token: string,
    productId: number,
    quantity: number
): Promise<Cart> {
    return apiFetch<Cart>(`/cart/items/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(token),
        },
        body: JSON.stringify({ productId, quantity }),
    });
}

export function removeFromCart(
    token: string,
    productId: number
): Promise<Cart> {
    return apiFetch<Cart>(`/cart/items/${productId}`, {
        method: "DELETE",
        headers: authHeader(token),
    });
}

export function clearCart(token: string): Promise<void> {
    return apiFetch<void>("/cart", {
        method: "DELETE",
        headers: authHeader(token),
    });
}
