import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/orders";
import { useAuth } from "../auth/useAuth";
import type { Order } from "../types/Order";

function OrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadOrders() {
            if (!token) return;

            try {
                const data = await getOrders(token);
                setOrders(data.content);
            } catch {
                setError("Could not load orders.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadOrders();
    }, [token]);

    return (
        <main className="app" style={{ paddingTop: "2rem" }}>
            <Link to="/" className="back-link">← Back to products</Link>

            <div className="page-header">
                <h1>My Orders</h1>
                <p>Your full order history.</p>
            </div>

            {isLoading && <p className="status-text">Loading orders...</p>}

            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && orders.length === 0 && (
                <div className="empty-state">
                    <p>You haven't placed any orders yet.</p>
                    <Link
                        to="/"
                        className="add-product-link"
                        style={{ marginTop: "1rem", display: "inline-flex" }}
                    >
                        Browse products
                    </Link>
                </div>
            )}

            {!isLoading && !error && orders.length > 0 && (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <div>
                                    <p className="order-card-id">Order #{order.id}</p>
                                    <p className="order-card-date">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <span className={`order-status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                    <p className="order-card-total">€{order.total.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="order-card-items">
                                {order.items.map((item) => (
                                    <span key={item.productId} className="order-card-item-pill">
                                        {item.productName} ×{item.quantity}
                                    </span>
                                ))}
                            </div>

                            <p className="order-card-address">
                                📦 {order.shippingAddress}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default OrdersPage;
