import type { Product } from "../types/Product";
import type {Page} from "../types/Page";

const API_URL = "http://localhost:8080/products";

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

    const url = `${API_URL}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
}

export async function getProductById(id: number): Promise<Product> {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch product");
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
