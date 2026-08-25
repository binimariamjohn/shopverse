import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItem,
    clearCart as apiClearCart,
} from "../api/cart";
import type { Cart } from "../types/Cart";
import { useAuth } from "../auth/useAuth";
import { CartContext, type CartContextValue } from "./CartContextDef";

const emptyCart: Cart = { items: [], total: 0, itemCount: 0 };

type CartProviderProps = {
    children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
    const { token, isAuthenticated } = useAuth();
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (!token) {
            setCart(null);
            return;
        }

        setIsLoading(true);
        try {
            const data = await getCart(token);
            setCart(data);
        } catch {
            setCart(emptyCart);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        async function syncCart() {
            if (!isAuthenticated) {
                setCart(null);
                return;
            }
            await refresh();
        }

        void syncCart();
    }, [isAuthenticated, refresh]);

    async function addItem(productId: number, quantity: number = 1) {
        if (!token) return;
        const updated = await addToCart(token, productId, quantity);
        setCart(updated);
    }

    async function updateItem(productId: number, quantity: number) {
        if (!token) return;
        const updated = await updateCartItem(token, productId, quantity);
        setCart(updated);
    }

    async function removeItem(productId: number) {
        if (!token) return;
        const updated = await removeFromCart(token, productId);
        setCart(updated);
    }

    async function clearCart() {
        if (!token) return;
        await apiClearCart(token);
        setCart(emptyCart);
    }

    function reset() {
        setCart(emptyCart);
    }

    const value: CartContextValue = {
        cart,
        itemCount: cart?.itemCount ?? 0,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        reset,
        refresh,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
