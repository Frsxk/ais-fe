const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiError {
  message: string;
  statusCode: number;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      message: res.statusText,
      statusCode: res.status,
    }));
    throw new Error(
      Array.isArray(error.message) ? error.message.join(", ") : error.message
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
