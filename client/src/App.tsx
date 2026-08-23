import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import AddProductPage from "./pages/AddProductPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
                path="/products/new"
                element={<AddProductPage />}
            />

            <Route
                path="/products/:id"
                element={<ProductDetails />}
            />
        </Routes>
    );
}

export default App;