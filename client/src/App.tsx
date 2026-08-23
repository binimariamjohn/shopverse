import { useEffect, useState } from "react";
import "./App.css";
import ProductCard from "./components/ProductCard";
import type { Product } from "./types/Product";
import AddProductForm from "./components/AddProductForm";
import {getProducts} from "./api/products";

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadProducts() {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getProducts();

            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
            setError("Could not load products. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleProductCreated(product: Product) {
        setProducts((currentProducts) => [...currentProducts, product]);
    }

    function handleDeleteProduct(id: number) {
        setProducts((currentProducts) =>
            currentProducts.filter((product) => product.id !== id)
        );
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
        loadProducts();
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