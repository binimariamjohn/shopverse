import { useState } from "react";
import { deleteProduct } from "../api/products";
import type { Product } from "../types/Product";
import EditProductForm from "./EditProductForm";

type ProductCardProps = {
    product: Product;
    onDelete: (id: number) => void;
    onProductUpdated: (product: Product) => void;
};

function ProductCard({
                         product,
                         onDelete,
                         onProductUpdated,
                     }: ProductCardProps) {
    const [isEditing, setIsEditing] = useState(false);

    function handleProductUpdated(updatedProduct: Product) {
        onProductUpdated(updatedProduct);
        setIsEditing(false);
    }

    async function handleDelete() {
        try {
            await deleteProduct(product.id);

            onDelete(product.id);
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Could not delete product. Please try again.");
        }
    }

    return (
        <article className="product-card">
            {isEditing ? (
                <EditProductForm
                    product={product}
                    onProductUpdated={handleProductUpdated}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <>
                    <h3>{product.name}</h3>

                    <p className="product-price">
                        €{product.price}
                    </p>

                    <div className="product-actions">
                        <button onClick={() => setIsEditing(true)}>
                            Edit
                        </button>

                        <button onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </>
            )}
        </article>
    );
}

export default ProductCard;