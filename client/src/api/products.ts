import type { Product } from "../types/Product";

const API_URL = "http://localhost:8080/products";

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
}

export async function createProduct(
    product: Omit<Product, "id">
): Promise<Product> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
}

export async function updateProduct(
    id: number,
    product: Omit<Product, "id">
): Promise<Product> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        let errorData;

        try {
            errorData = await response.json();
        } catch {
            throw new Error("Failed to delete product");
        }

        throw errorData;
    }
}
