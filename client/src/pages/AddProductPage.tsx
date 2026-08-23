import { useNavigate } from "react-router-dom";
import AddProductForm from "../components/AddProductForm";
import type { Product } from "../types/Product";

function AddProductPage() {
    const navigate = useNavigate();

    function handleProductCreated(product: Product) {
        navigate(`/products/${product.id}`);
    }

    return (
        <main className="app">
            <header className="header">
                <h1>Add Product</h1>
                <p>Add a new item to KadaPlatz.</p>
            </header>

            <AddProductForm
                onProductCreated={handleProductCreated}
            />
        </main>
    );
}

export default AddProductPage;