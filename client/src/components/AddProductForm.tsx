import { useState, type FormEvent } from "react";
import type { Product } from "../types/Product";
import {createProduct} from "../api/products";
import { useAuth } from "../auth/useAuth";
import { ApiError } from "../api/http";

type AddProductFormProps = {
    onProductCreated: (product: Product) => void;
};

function AddProductForm({ onProductCreated }: AddProductFormProps) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token } = useAuth();


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrors({});
        setIsSubmitting(true);

        try {
            if (!token) {
                setErrors({
                    general: "Please log in to create products.",
                });
                return;
            }

            const createdProduct = await createProduct({
                name,
                price: Number(price),
                category,
            }, token);

            onProductCreated(createdProduct);

            setName("");
            setPrice("");
            setCategory("");
        } catch (error) {
            if (error instanceof ApiError) {
                setErrors({
                    ...(error.errors ?? {}),
                    general: error.message,
                });
            } else {
                setErrors({
                    general: "Could not create product. Please try again.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="add-product-form">
            <h2>Add Product</h2>

            {errors.general && (
                <p className="error-message">{errors.general}</p>
            )}

            <div className="form-field">
                <label htmlFor="name">Product name</label>

                <input
                    id="name"
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
                <label htmlFor="price">Price</label>

                <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                />

                {errors.price && (
                    <p className="field-error">{errors.price}</p>
                )}
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Product"}
            </button>
        </form>
    );
}

export default AddProductForm;