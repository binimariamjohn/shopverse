import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../api/orders";
import { useAuth } from "../auth/useAuth";
import type { Order } from "../types/Order";

function OrderConfirmationPage() {
    const { id } = useParams();
    const { token } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadOrder() {
            if (!token || !id) return;

            try {
                const data = await getOrderById(token, Number(id));
                setOrder(data);
            } catch {
                setError("Could not load order details.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadOrder();
    }, [id, token]);

    if (isLoading) {
        return (
            <main className="app" style={{ paddingTop: "2rem" }}>
                <p className="status-text">Loading order...</p>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="app" style={{ paddingTop: "2rem" }}>
                <p className="error-message">{error ?? "Order not found."}</p>
                <Link to="/" className="back-link">← Back to products</Link>
            </main>
        );
    }

    return (
        <main className="app" style={{ paddingTop: "2rem" }}>
            <div className="confirmation-banner">
                <div className="confirmation-icon">✓</div>
                <h1>Order confirmed!</h1>
                <p>Order <strong>#{order.id}</strong> has been placed successfully.</p>
            </div>

            <div className="order-detail-card">
                <div className="order-detail-meta">
                    <div>
                        <p className="order-meta-label">Status</p>
                        <span className={`order-status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                        </span>
                    </div>
                    <div>
                        <p className="order-meta-label">Shipping to</p>
                        <p className="order-meta-value">{order.shippingAddress}</p>
                    </div>
                    <div>
                        <p className="order-meta-label">Date</p>
                        <p className="order-meta-value">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="order-items-list">
                    {order.items.map((item) => (
                        <div key={item.productId} className="checkout-item-row">
                            <div>
                                <p className="checkout-item-name">{item.productName}</p>
                                <p className="checkout-item-qty">Qty: {item.quantity}</p>
                            </div>
                            <p className="checkout-item-price">€{item.subtotal.toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <div className="checkout-total-row">
                    <span>Total paid</span>
                    <span>€{order.total.toFixed(2)}</span>
                </div>
            </div>

            <div className="confirmation-actions">
                <Link to="/orders" className="btn-ghost">View all orders</Link>
                <Link to="/" className="add-product-link">Continue shopping</Link>
            </div>
        </main>
    );
}

export default OrderConfirmationPage;
