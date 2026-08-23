import { useState, type FormEvent } from "react";
import type { Product } from "../types/Product";
import {updateProduct} from "../api/products";

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
            const updatedProduct = await         updateProduct(product.id, {
                name,
                price: Number(price),
            });

            onProductUpdated(updatedProduct);
        } catch (error) {
            console.error("Error updating product:", error);

            if (
                typeof error === "object" &&
                error !== null &&
                "errors" in error
            ) {
                setErrors((error as { errors: Record<string, string> }).errors);
                return;
            }

            if (
                typeof error === "object" &&
                error !== null &&
                "message" in error
            ) {
                setErrors({
                    general: String((error as { message: string }).message),
                });
                return;
            }

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