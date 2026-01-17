/**
 * Base API Client
 * Centralized HTTP client using fetch()
 * Change API_BASE_URL to point to real backend in production
 */

// Base URL for API calls - change this for production
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Response type for API calls
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// HTTP error type
export interface ApiError {
  status: number;
  statusText: string;
  data?: unknown;
  message: string;
}

// Create API error
function createApiError(
  status: number,
  statusText: string,
  data?: unknown
): ApiError {
  return {
    status,
    statusText,
    data,
    message: `API Error: ${status} ${statusText}`,
  };
}

// Base fetch wrapper with error handling
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw createApiError(response.status, response.statusText, errorData);
  }

  return response.json();
}

// HTTP methods
export const api = {
  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, { ...options, method: "DELETE" });
  },
};

export { API_BASE_URL };
