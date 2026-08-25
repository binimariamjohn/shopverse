import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { getCurrentUser, login, register } from "../api/auth";
import type { AuthUser, UserRole } from "../types/Auth";

const AUTH_STORAGE_KEY = "kadaplatz.auth.token";

type AuthContextValue = {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loginUser: (email: string, password: string) => Promise<void>;
    registerUser: (
        email: string,
        password: string,
        role: UserRole
    ) => Promise<void>;
    logout: () => void;
    hasRole: (roles: UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem(AUTH_STORAGE_KEY)
    );
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCurrentUser() {
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser(token);
                setUser(currentUser);
            } catch {
                localStorage.removeItem(AUTH_STORAGE_KEY);
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        void loadCurrentUser();
    }, [token]);

    async function loginUser(email: string, password: string) {
        const authResponse = await login({ email, password });
        localStorage.setItem(AUTH_STORAGE_KEY, authResponse.token);
        setToken(authResponse.token);
        setUser(authResponse.user);
    }

    async function registerUser(
        email: string,
        password: string,
        role: UserRole
    ) {
        const authResponse = await register({ email, password, role });
        localStorage.setItem(AUTH_STORAGE_KEY, authResponse.token);
        setToken(authResponse.token);
        setUser(authResponse.user);
    }

    function logout() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setToken(null);
        setUser(null);
    }

    function hasRole(roles: UserRole[]) {
        if (!user) {
            return false;
        }

        return roles.includes(user.role);
    }

    const value: AuthContextValue = {
        user,
        token,
        isAuthenticated: token !== null && user !== null,
        isLoading,
        loginUser,
        registerUser,
        logout,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext };
