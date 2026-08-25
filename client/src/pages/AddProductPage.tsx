import { Link, useNavigate } from "react-router-dom";
import AddProductForm from "../components/AddProductForm";
import type { Product } from "../types/Product";

function AddProductPage() {
    const navigate = useNavigate();

    function handleProductCreated(product: Product) {
        navigate(`/products/${product.id}`);
    }

    return (
        <main className="app" style={{ paddingTop: "2rem" }}>
            <Link to="/" className="back-link">← Back to products</Link>

            <div className="page-header">
                <h1>Add Product</h1>
                <p>List a new item on KadaPlatz.</p>
            </div>

            <AddProductForm onProductCreated={handleProductCreated} />
        </main>
    );
}

export default AddProductPage;