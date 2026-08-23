import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/Product";
import EditProductForm from "./EditProductForm";
import { deleteProduct } from "../api/products";

type ProductCardProps = {
    product: Product;
    onDelete: () => void;
    onProductUpdated: (product: Product) => void;
};

function ProductCard({
                         product,
                         onDelete,
                         onProductUpdated,
                     }: ProductCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    function handleProductUpdated(updatedProduct: Product) {
        onProductUpdated(updatedProduct);
        setIsEditing(false);
    }

    async function handleDelete() {
        try {
            await deleteProduct(product.id);
            onDelete();
        } catch (error) {
            console.error("Error deleting product:", error);
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

                    <p className={"product-category"}>
                        {formatCategory(product.category)}
                    </p>

                    <p className="product-price">
                        €{product.price}
                    </p>

                    <div className="product-actions">
                        <button
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsEditing(true);
                            }}
                        >
                            Edit
                        </button>

                        <button
                            onClick={(event) => {
                                event.stopPropagation();
                                void  handleDelete();
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </article>
    );
}

export default ProductCard;