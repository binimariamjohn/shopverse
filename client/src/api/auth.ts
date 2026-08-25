import { apiFetch } from "./http";
import type { AuthResponse, AuthUser, UserRole } from "../types/Auth";

type AuthPayload = {
    email: string;
    password: string;
};

type RegisterPayload = AuthPayload & {
    role: UserRole;
};

export function register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

export function login(payload: AuthPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

export function getCurrentUser(token: string): Promise<AuthUser> {
    return apiFetch<AuthUser>("/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
