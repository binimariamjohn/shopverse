import { useAuth } from "../auth/useAuth";
import { useCart } from "../cart/useCart";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navigation() {
    const { user, isAuthenticated, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const cartItemCount = cart?.items.reduce(
        (total, item) => total + item.quantity,
        0
    ) || 0;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isLinkActive = (path: string) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                {/* Logo/Brand */}
                <Link to="/" className="navbar-brand">
                    <span className="navbar-brand-name">ShopVerse</span>
                    <span className="navbar-brand-tagline">Marketplace</span>
                </Link>

                {/* Navigation Links */}
                <div className="navbar-links">
                    <Link to="/" className={`nav-link ${isLinkActive("/")}`}>
                        Home
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link to="/orders" className={`nav-link ${isLinkActive("/orders")}`}>
                                Orders
                            </Link>
                            {(user?.role === "SELLER" || user?.role === "ADMIN") && (
                                <Link to="/products/new" className={`nav-link ${isLinkActive("/products/new")}`}>
                                    Add Product
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="navbar-actions">
                    {/* Cart Link */}
                    {isAuthenticated && (
                        <Link to="/cart" className="cart-icon-link" title="Shopping Cart">
                            🛒
                            {cartItemCount > 0 && (
                                <span className="cart-badge">{cartItemCount}</span>
                            )}
                        </Link>
                    )}

                    {/* User Menu */}
                    {isAuthenticated && user ? (
                        <div className="navbar-user-menu">
                            <div className="navbar-user">
                                <span className={`role-badge ${user.role.toLowerCase()}`}>
                                    {user.role}
                                </span>
                                <span className="user-email">{user.email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-ghost"
                                title="Logout"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="navbar-auth-actions">
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}



