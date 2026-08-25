export class ApiError extends Error {
    status: number;
    errors?: Record<string, string>;

    constructor(
        status: number,
        message: string,
        errors?: Record<string, string>
    ) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
    }
}

const API_BASE_URL = "http://localhost:8080";

export function authHeader(token: string): { Authorization: string } {
    return { Authorization: `Bearer ${token}` };
}

function getErrorMessage(status: number) {
    if (status === 401) {
        return "Authentication is required";
    }

    if (status === 403) {
        return "You do not have permission to perform this action";
    }

    return "Request failed";
}

async function parseError(response: Response): Promise<ApiError> {
    try {
        const data = await response.json();
        const message =
            typeof data.message === "string"
                ? data.message
                : getErrorMessage(response.status);

        const errors =
            typeof data.errors === "object" && data.errors !== null
                ? (data.errors as Record<string, string>)
                : undefined;

        return new ApiError(response.status, message, errors);
    } catch {
        return new ApiError(
            response.status,
            getErrorMessage(response.status)
        );
    }
}

export async function apiFetch<T>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, init);

    if (!response.ok) {
        throw await parseError(response);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
