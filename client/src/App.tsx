import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import AddProductPage from "./pages/AddProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrdersPage from "./pages/OrdersPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import Navigation from "./components/Navigation";

function App() {
    return (
        <>
            <Navigation />
            <div className="app">
                <Routes>
                    <Route path="/" element={<HomePage />} />

                    <Route element={<ProtectedRoute allowedRoles={["SELLER", "ADMIN"]} />}>
                        <Route path="/products/new" element={<AddProductPage />} />
                    </Route>

                    <Route path="/products/:id" element={<ProductDetails />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/orders/confirmation/:id" element={<OrderConfirmationPage />} />
                    </Route>
                </Routes>
            </div>
        </>
    );
}

export default App;