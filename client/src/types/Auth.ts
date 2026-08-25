export type UserRole = "ADMIN" | "SELLER" | "BUYER";

export type AuthUser = {
    id: number;
    email: string;
    role: UserRole;
};

export type AuthResponse = {
    token: string;
    user: AuthUser;
};
