import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ApiError } from "../api/http";
import { useAuth } from "../auth/useAuth";
import type { UserRole } from "../types/Auth";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("BUYER");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { registerUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            await registerUser(email, password, role);
            navigate("/", { replace: true });
        } catch (exception) {
            if (exception instanceof ApiError) {
                setErrors({
                    ...exception.errors,
                    general: exception.message,
                });
            } else {
                setErrors({
                    general: "Could not create account. Please try again.",
                });
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
                    <h1>Create an account</h1>
                    <p>Join as a buyer or seller</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {errors.general && (
                        <p className="error-message">{errors.general}</p>
                    )}

                    <div className="form-field">
                        <label htmlFor="register-email">Email</label>
                        <input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        {errors.email && (
                            <p className="field-error">{errors.email}</p>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="register-password">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Min. 8 characters"
                            required
                        />
                        {errors.password && (
                            <p className="field-error">{errors.password}</p>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="register-role">I want to</label>
                        <select
                            id="register-role"
                            value={role}
                            onChange={(event) =>
                                setRole(event.target.value as UserRole)
                            }
                        >
                            <option value="BUYER">Buy products</option>
                            <option value="SELLER">Sell products</option>
                        </select>
                        {errors.role && (
                            <p className="field-error">{errors.role}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center" }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already registered? <Link to="/login">Sign in</Link>.
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
