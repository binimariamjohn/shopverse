import { useEffect, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductControls from "../components/ProductControls";
import Pagination from "../components/Pagination";
import { getProducts } from "../api/products";
import type { Product } from "../types/Product";

function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("NEWEST");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    async function loadProducts(
        searchTerm: string,
        sortValue: string,
        pageNumber: number
    ) {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getProducts(
                searchTerm,
                sortValue,
                pageNumber,
                6
            );

            setProducts(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);

            return data;
        } catch (error) {
            console.error("Error loading products:", error);
            setError("Could not load products. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
        setPage(0);
    }

    async function handleDeleteProduct() {
        const data = await loadProducts(search, sort, page);

        if (
            data &&
            data.content.length === 0 &&
            data.totalPages > 0 &&
            page >= data.totalPages
        ) {
            setPage(data.totalPages - 1);
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
        const timeoutId = setTimeout(() => {
            void loadProducts(search, sort, page);
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [search, sort, page]);

    return (
        <main className="app">
            <header className="header">
                <h1>KadaPlatz</h1>
                <p>Your marketplace, built for discovery.</p>

                <Link
                    to="/products/new"
                    className="add-product-link"
                >
                    + Add Product
                </Link>
            </header>

            <section>
                <h2>Products ({totalElements})</h2>

                <ProductControls
                    search={search}
                    sort={sort}
                    onSearchChange={handleSearchChange}
                    onSortChange={(value) => {
                        setSort(value);
                        setPage(0);
                    }}
                />

                {isLoading && <p>Loading products...</p>}

                {error && <p>{error}</p>}

                {!isLoading && !error && products.length === 0 && (
                    <div className="empty-state">
                        <p>No products found.</p>
                    </div>
                )}

                {!isLoading && !error && products.length > 0 && (
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

                {!isLoading && !error && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPrevious={() =>
                            setPage(
                                (currentPage) => currentPage - 1
                            )
                        }
                        onNext={() =>
                            setPage(
                                (currentPage) => currentPage + 1
                            )
                        }
                    />
                )}
            </section>
        </main>
    );
}

export default HomePage;