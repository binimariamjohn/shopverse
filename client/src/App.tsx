import { useEffect, useState } from "react";
import "./App.css";
import ProductCard from "./components/ProductCard";
import type { Product } from "./types/Product";
import AddProductForm from "./components/AppProductForm";

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function handleProductCreated(product: Product) {
        setProducts((currentProducts) => [...currentProducts, product]);
    }

    async function handleDeleteProduct(id: number) {
        try {
            const response = await fetch(
                `http://localhost:8080/products/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            setProducts((currentProducts) =>
                currentProducts.filter((product) => product.id !== id)
            );
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }

    function handleProductUpdated(updatedProduct: Product) {
        setProducts((currentProducts) =>
            currentProducts.map((product) =>
                product.id === updatedProduct.id
                    ? updatedProduct
                    : product
            )
        );
    }

    useEffect(() => {
        fetch("http://localhost:8080/products")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load products");
                }

                return response.json();
            })
            .then((data: Product[]) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error("Error loading products:", error);
                setError("Could not load products. Please try again later.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <main className="app">
            <header className="header">
                <h1>KadaPlatz</h1>
                <p>Your marketplace, built for discovery.</p>
            </header>

            <AddProductForm onProductCreated={handleProductCreated} />

            <section>
                <h2>Products</h2>

                {isLoading && <p>Loading products...</p>}

                {error && <p>{error}</p>}

                {!isLoading && !error && (
                    <div className="product-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onDelete={handleDeleteProduct}
                                onProductUpdated={handleProductUpdated}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default App;