import { swalError } from "./swal";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}

export async function apiFetch<T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const result = await res.json();

    if (!res.ok || result.code === 0) {
      swalError(result.message || "Terjadi kesalahan 😢");
      return null;
    }

    return result;
  } catch (err) {
    swalError("Network error 😭");
    return null;
  }
}