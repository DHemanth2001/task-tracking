'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'taskzen-auth-token';

let token: string | null = null;

// On initial client-side load, try to get the token from localStorage
if (typeof window !== 'undefined') {
  token = localStorage.getItem(TOKEN_KEY);
}

export const setToken = (newToken: string) => {
  token = newToken;
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, newToken);
  }
};

export const clearToken = () => {
  token = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const url = `${API_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      // If the error is 401 Unauthorized, clear the token and redirect
      if (response.status === 401) {
        clearToken();
        // Check for window to ensure this code runs only on the client
        if (typeof window !== 'undefined') {
           window.location.href = '/login';
        }
      }
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error('Error body:', errorBody);
      return null;
    }
    
    // Handle cases with no response body
    if (response.status === 204) {
      return null;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error('Network or other error:', error);
    return null;
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  put: <T>(endpoint: string, body: unknown) => request<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  delete: <T>(endpoint: string) => request<T>(endpoint, {
    method: 'DELETE',
  }),
};
