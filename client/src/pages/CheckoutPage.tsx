import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkout } from "../api/orders";
import { useAuth } from "../auth/useAuth";
import { useCart } from "../cart/useCart";
import { ApiError } from "../api/http";

function CheckoutPage() {
    const [shippingAddress, setShippingAddress] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { token } = useAuth();
    const { cart, reset } = useCart();
    const navigate = useNavigate();

    const isEmpty = !cart || cart.items.length === 0;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!token) return;

        setError(null);
        setIsSubmitting(true);

        try {
            const order = await checkout(token, shippingAddress, cardNumber);
            reset();
            navigate(`/orders/confirmation/${order.id}`);
        } catch (exception) {
            if (exception instanceof ApiError) {
                setError(exception.message);
            } else {
                setError("Checkout failed. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isEmpty) {
        return (
            <main className="app" style={{ paddingTop: "2rem" }}>
                <p className="status-text">Your cart is empty.</p>
                <Link to="/" className="back-link">← Browse products</Link>
            </main>
        );
    }

    return (
        <main className="app" style={{ paddingTop: "2rem" }}>
            <Link to="/cart" className="back-link">← Back to cart</Link>

            <div className="page-header">
                <h1>Checkout</h1>
                <p>Review your order and complete your purchase.</p>
            </div>

            <div className="checkout-layout">
                <form onSubmit={handleSubmit} className="checkout-form">
                    {error && <p className="error-message">{error}</p>}

                    <h2 className="checkout-section-title">Shipping</h2>

                    <div className="form-field">
                        <label htmlFor="address">Delivery address</label>
                        <input
                            id="address"
                            type="text"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="123 Main St, City, Country"
                            required
                        />
                    </div>

                    <h2 className="checkout-section-title">Payment</h2>

                    <div className="mock-payment-note">
                        🔒 Mock payment — no real charge will be made.
                    </div>

                    <div className="form-field">
                        <label htmlFor="card">Card number</label>
                        <input
                            id="card"
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            maxLength={19}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center" }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Processing..." : `Pay €${cart?.total.toFixed(2)}`}
                    </button>
                </form>

                <div className="checkout-order-summary">
                    <h2 className="checkout-section-title">Order summary</h2>

                    {cart?.items.map((item) => (
                        <div key={item.productId} className="checkout-item-row">
                            <div>
                                <p className="checkout-item-name">{item.productName}</p>
                                <p className="checkout-item-qty">Qty: {item.quantity}</p>
                            </div>
                            <p className="checkout-item-price">€{item.subtotal.toFixed(2)}</p>
                        </div>
                    ))}

                    <div className="checkout-total-row">
                        <span>Total</span>
                        <span>€{cart?.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default CheckoutPage;
