import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../api/http";
import { useAuth } from "../auth/useAuth";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { loginUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath =
        typeof location.state?.from === "string"
            ? location.state.from
            : "/";

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await loginUser(email, password);
            navigate(redirectPath, { replace: true });
        } catch (exception) {
            if (exception instanceof ApiError) {
                setError(exception.message);
            } else {
                setError("Could not log in. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card-header">
                    <div className="auth-card-logo">KadaPlatz</div>
                    <h1>Welcome back</h1>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}

                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center" }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="auth-footer">
                    New here? <Link to="/register">Create an account</Link>.
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
