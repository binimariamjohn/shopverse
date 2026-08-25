import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../cart/useCart";

function CartPage() {
    const { cart, isLoading, updateItem, removeItem } = useCart();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <main className="app" style={{ paddingTop: "2rem" }}>
                <p className="status-text">Loading cart...</p>
            </main>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <main className="app" style={{ paddingTop: "2rem" }}>
            <Link to="/" className="back-link">← Back to products</Link>

            <div className="page-header">
                <h1>Your Cart</h1>
                {!isEmpty && (
                    <p>{cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""}</p>
                )}
            </div>

            {isEmpty ? (
                <div className="empty-state">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="add-product-link" style={{ marginTop: "1rem", display: "inline-flex" }}>
                        Browse products
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.items.map((item) => (
                            <div key={item.productId} className="cart-item-row">
                                <div className="cart-item-info">
                                    <p className="cart-item-name">{item.productName}</p>
                                    <p className="cart-item-price">€{item.price.toFixed(2)} each</p>
                                </div>

                                <div className="cart-item-controls">
                                    <button
                                        className="btn-ghost qty-btn"
                                        onClick={() =>
                                            void updateItem(
                                                item.productId,
                                                Math.max(1, item.quantity - 1)
                                            )
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>

                                    <span className="qty-value">{item.quantity}</span>

                                    <button
                                        className="btn-ghost qty-btn"
                                        onClick={() =>
                                            void updateItem(
                                                item.productId,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="cart-item-subtotal">
                                    €{item.subtotal.toFixed(2)}
                                </p>

                                <button
                                    className="btn-danger"
                                    onClick={() => void removeItem(item.productId)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2 className="cart-summary-title">Summary</h2>

                        <div className="cart-summary-row">
                            <span>Subtotal</span>
                            <span>€{cart.total.toFixed(2)}</span>
                        </div>

                        <div className="cart-summary-row">
                            <span>Shipping</span>
                            <span className="cart-free">Free</span>
                        </div>

                        <div className="cart-summary-total">
                            <span>Total</span>
                            <span>€{cart.total.toFixed(2)}</span>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: "100%", justifyContent: "center", marginTop: "1.25rem" }}
                            onClick={() => navigate("/checkout")}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

export default CartPage;
