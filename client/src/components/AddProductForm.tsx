import { useState, type FormEvent } from "react";
import type { Product } from "../types/Product";
import {createProduct} from "../api/products";

type AddProductFormProps = {
    onProductCreated: (product: Product) => void;
};

function AddProductForm({ onProductCreated }: AddProductFormProps) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrors({});
        setIsSubmitting(true);

        try {
            const createdProduct = await createProduct({
                name,
                price: Number(price),
            });

            onProductCreated(createdProduct);

            setName("");
            setPrice("");
        } catch (error) {
            console.error("Error creating product:", error);

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
                    general: String(
                        (error as { message: string }).message
                    ),
                });
                return;
            }

            setErrors({
                general: "Could not create product. Please try again.",
            });
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

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Product"}
            </button>
        </form>
    );
}

export default AddProductForm;