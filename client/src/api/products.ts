import type { Product } from "../types/Product";
import type {Page} from "../types/Page";
import { apiFetch, authHeader } from "./http";

export async function getProducts(
    search?: string,
    sort: string = "NEWEST",
    page: number = 0,
    size: number = 6
): Promise<Page<Product>> {
    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    params.set("sort", sort);
    params.set("page", page.toString());
    params.set("size", size.toString());

    return apiFetch<Page<Product>>(`/products?${params.toString()}`);
}

export async function getProductById(id: number): Promise<Product> {
    return apiFetch<Product>(`/products/${id}`);
}

export async function createProduct(
    product: Omit<Product, "id">,
    token: string
): Promise<Product> {
    return apiFetch<Product>("/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(token),
        },
        body: JSON.stringify(product),
    });
}

export async function updateProduct(
    id: number,
    product: Omit<Product, "id">,
    token: string
): Promise<Product> {
    return apiFetch<Product>(`/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(token),
        },
        body: JSON.stringify(product),
    });
}

export async function deleteProduct(id: number, token: string): Promise<void> {
    await apiFetch<void>(`/products/${id}`, {
        method: "DELETE",
        headers: {
            ...authHeader(token),
        },
    });
}
