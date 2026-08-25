import { createContext } from "react";
import type { Cart } from "../types/Cart";

export type CartContextValue = {
    cart: Cart | null;
    itemCount: number;
    isLoading: boolean;
    addItem: (productId: number, quantity?: number) => Promise<void>;
    updateItem: (productId: number, quantity: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    reset: () => void;
    refresh: () => Promise<void>;
};

export const CartContext = createContext<CartContextValue | undefined>(
    undefined
);
