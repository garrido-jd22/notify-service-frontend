// src/services/http.client.ts
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined | (string | number | boolean)[]
>;

export type RequestOptions = {
  method?: HttpMethod;
  path: string;                // "/universities"
  baseURL?: string;            // opcional (por defecto env)
  query?: QueryParams;         // ?a=1&b=2
  body?: any;                  // JSON | FormData | etc
  headers?: Record<string, string>;
  apiKey?: string | null;      // sobrescribe si lo pasas
  signal?: AbortSignal;
  cache?: RequestCache;        // "no-store" recomendado para dashboard
};

export class ApiError extends Error {
  status: number;
  data;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function buildQuery(query?: QueryParams) {
  if (!query) return "";
  const sp = new URLSearchParams();

  for (const [k, v] of Object.entries(query)) {
    if (v === null || v === undefined) continue;

    if (Array.isArray(v)) {
      v.forEach((item) => sp.append(k, String(item)));
    } else {
      sp.set(k, String(v));
    }
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function getBaseURL(custom?: string) {
  return custom ?? process.env.NEXT_PUBLIC_API_BASE_URL_DEMO ?? "";
  // return custom ?? process.env.NEXT_PUBLIC_API_BASE_URL_PROD ?? "";
}

function defaultApiKeyGetter(): string | null {
  // Ajusta esto a tu estrategia real:
  // localStorage, cookie, zustand, etc.
  // OJO: localStorage solo disponible en client components.
  if (typeof window === "undefined") return null;
  return localStorage.getItem("api_key");
}

export async function httpRequest<T>(opts: RequestOptions): Promise<T> {
  const {
    method = "GET",
    path,
    baseURL,
    query,
    body,
    headers,
    apiKey,
    signal,
    cache = "no-store",
  } = opts;

  const url = `${getBaseURL(baseURL)}${path}${buildQuery(query)}`;

  const key = apiKey ?? defaultApiKeyGetter();

  const finalHeaders: Record<string, string> = {
    ...(headers ?? {}),
  };

  // Si NO es FormData => enviamos JSON
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData) {
    finalHeaders["Content-Type"] = finalHeaders["Content-Type"] ?? "application/json";
  }

  if (key) {
    // Usa el header que tu backend espere
    // ejemplos: "x-api-key", "Authorization: Bearer <key>", etc.
    finalHeaders["x-api-key"] = key;
    finalHeaders["API_KEY"] = key;
    finalHeaders["Authorization"] = `Bearer  ${key}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    signal,
    cache,
  });

  // Intentar parsear respuesta
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `HTTP ${res.status} - ${res.statusText}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}
