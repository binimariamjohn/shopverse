import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import type { Product } from "../types/Product";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function formatCategory(category: string | null) {
        if (!category) {
            return "Other";
        }

        return category.charAt(0) + category.slice(1).toLowerCase();
    }

    useEffect(() => {
        async function loadProduct() {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getProductById(Number(id));

                setProduct(data);
            } catch (error) {
                console.error("Error loading product:", error);
                setError("Could not load product.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadProduct();
    }, [id]);

    if (isLoading) {
        return (
            <main className="app" style={{ paddingTop: "2rem" }}>
                <p className="status-text">Loading product...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="app" style={{ paddingTop: "2rem" }}>
                <p className="error-message">{error}</p>
                <Link to="/" className="back-link">← Back to products</Link>
            </main>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <main className="app" style={{ paddingTop: "2rem" }}>
            <Link to="/" className="back-link">← Back to products</Link>

            <section className="product-details">
                <span className="product-category">
                    {formatCategory(product.category)}
                </span>

                <h1>{product.name}</h1>

                <p className="product-price">€{product.price.toFixed(2)}</p>
            </section>
        </main>
    );
}

export default ProductDetails;