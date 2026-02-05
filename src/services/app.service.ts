// src/services/app.service.ts
import { httpRequest, QueryParams } from "./http.client";

export const AppService = {
    get: <T>(path: string, query?: QueryParams) =>
        httpRequest<T>({ method: "GET", path, query }),

    post: <T>(path: string, body?: any, query?: QueryParams) =>
        httpRequest<T>({ method: "POST", path, body, query }),

    put: <T>(path: string, body?: any, query?: QueryParams) =>
        httpRequest<T>({ method: "PUT", path, body, query }),

    patch: <T>(path: string, body?: any, query?: QueryParams) =>
        httpRequest<T>({ method: "PATCH", path, body, query }),

    delete: <T>(path: string, query?: QueryParams) =>
        httpRequest<T>({ method: "DELETE", path, query }),

    // Ejemplo: subir archivo (FormData)
    upload: <T>(path: string, form: FormData, query?: QueryParams) =>
        httpRequest<T>({ method: "POST", path, body: form, query }),
};
