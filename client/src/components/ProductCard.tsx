import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/Product";
import EditProductForm from "./EditProductForm";
import { deleteProduct } from "../api/products";
import { ApiError } from "../api/http";
import { useCart } from "../cart/useCart";
import { useAuth } from "../auth/useAuth";

type ProductCardProps = {
    product: Product;
    onDelete: () => void;
    onProductUpdated: (product: Product) => void;
    canEdit: boolean;
    canDelete: boolean;
};

function ProductCard({
                        product,
                        onDelete,
                        onProductUpdated,
                        canEdit,
                        canDelete,
                     }: ProductCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { isAuthenticated, token } = useAuth();

    function handleProductUpdated(updatedProduct: Product) {
        onProductUpdated(updatedProduct);
        setIsEditing(false);
        setError(null);
    }

    async function handleDelete() {
        try {
            if (!token) {
                setError("Please log in as admin to delete products.");
                return;
            }

            await deleteProduct(product.id, token);
            onDelete();
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("Could not delete product. Please try again.");
            }
        }
    }

    async function handleAddToCart() {
        try {
            await addItem(product.id, 1);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 1800);
        } catch {
            setError("Could not add to cart. Please try again.");
        }
    }

    function formatCategory(category: string | null) {
        if (!category) {
            return "Other";
        }

        return category.charAt(0) + category.slice(1).toLowerCase();
    }

    return (
        <article
            className={`product-card ${isEditing ? "editing" : ""}`}
            onClick={() => {
                if (!isEditing) {
                    navigate(`/products/${product.id}`);
                }
            }}
        >
            {isEditing ? (
                <EditProductForm
                    product={product}
                    onProductUpdated={handleProductUpdated}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <>
                    <h3>{product.name}</h3>

                    <p className="product-category">
                        {formatCategory(product.category)}
                    </p>

                    <p className="product-price">€{product.price.toFixed(2)}</p>

                    <div className="product-actions">
                        {isAuthenticated && (
                            <button
                                className={addedToCart ? "btn-success" : "btn-primary"}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    void handleAddToCart();
                                }}
                            >
                                {addedToCart ? "✓ Added" : "Add to Cart"}
                            </button>
                        )}

                        {canEdit && (
                            <button
                                className="btn-ghost"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setIsEditing(true);
                                    setError(null);
                                }}
                            >
                                Edit
                            </button>
                        )}

                        {canDelete && (
                            <button
                                className="btn-danger"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    void handleDelete();
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    {error && <p className="field-error">{error}</p>}
                </>
            )}
        </article>
    );
}

export default ProductCard;