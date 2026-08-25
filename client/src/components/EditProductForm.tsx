import {useState, type FormEvent} from "react";
import type {Product} from "../types/Product";
import {updateProduct} from "../api/products";
import { ApiError } from "../api/http";
import { useAuth } from "../auth/useAuth";

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
    const { token } = useAuth();
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [category, setCategory] = useState(product.category);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrors({});
        setIsSubmitting(true);

        try {
            if (!token) {
                setErrors({ general: "You must be logged in to edit products." });
                return;
            }

            const updatedProduct = await updateProduct(product.id, {
                name,
                price: Number(price),
                category,
            }, token);

            onProductUpdated(updatedProduct);
        } catch (error) {
            if (error instanceof ApiError) {
                setErrors({
                    ...(error.errors ?? {}),
                    general: error.message,
                });
            } else {
                setErrors({
                    general: "Could not update product. Please try again.",
                });
            }
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
                <label htmlFor="category">Category</label>

                <select
                    id="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                >
                    <option value="">Select a category</option>
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="HOME">Home</option>
                    <option value="FASHION">Fashion</option>
                    <option value="SPORTS">Sports</option>
                    <option value="OTHER">Other</option>
                </select>

                {errors.category && (
                    <p className="field-error">{errors.category}</p>
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
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </button>

                <button type="button" className="btn-ghost" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default EditProductForm;