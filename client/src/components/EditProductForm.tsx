import { useState, type FormEvent } from "react";
import type { Product } from "../types/Product";

type EditProductFormProps = {
    product: Product;
    onProductUpdated: (product: Product) => void;
    onCancel: () => void;
};

function EditProductForm({
                             product,
                             onProductUpdated,
                             onCancel,
                         }: EditProductFormProps) {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await fetch(
                `http://localhost:8080/products/${product.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        price: Number(price),
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();

                if (errorData.errors) {
                    setErrors(errorData.errors);
                    return;
                }

                throw new Error(errorData.message || "Failed to update product");
            }

            const updatedProduct: Product = await response.json();

            onProductUpdated(updatedProduct);
        } catch (error) {
            console.error("Error updating product:", error);

            setErrors({
                general: "Could not update product. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="edit-product-form">
            <div className="form-field">
                <label htmlFor={`name-${product.id}`}>Product name</label>

                <input
                    id={`name-${product.id}`}
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                {errors.name && (
                    <p className="field-error">{errors.name}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor={`price-${product.id}`}>Price</label>

                <input
                    id={`price-${product.id}`}
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                />

                {errors.price && (
                    <p className="field-error">{errors.price}</p>
                )}
            </div>

            {errors.general && (
                <p className="error-message">{errors.general}</p>
            )}

            <div className="form-actions">
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </button>

                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default EditProductForm;