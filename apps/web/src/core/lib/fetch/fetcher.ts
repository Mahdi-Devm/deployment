import { HttpMethod, OptionsFetch } from "@/core/assets/types/fetch";

export async function req<T>(
  method: HttpMethod,
  url: string,
  options?: OptionsFetch,
): Promise<T> {
  const res = await fetch(`${url}`, {
    method,
    ...options,
    headers: {
      ...(options?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error("req failed");
  }
  const data = (await res.json()) as T;
  return data;
}
export const api = {
  get<T>(url: string, options?: OptionsFetch) {
    return req<T>("GET", url, options);
  },

  post<T>(url: string, body: unknown, options?: OptionsFetch) {
    return req<T>("POST", url, {
      ...options,
      body: JSON.stringify(body),
    });
  },

  patch<T>(url: string, body: unknown, options?: OptionsFetch) {
    return req<T>("PATCH", url, {
      ...options,
      body: JSON.stringify(body),
    });
  },

  put<T>(url: string, body: unknown, options?: OptionsFetch) {
    return req<T>("PUT", url, {
      ...options,
      body: JSON.stringify(body),
    });
  },

  delete<T>(url: string, options?: OptionsFetch) {
    return req<T>("DELETE", url, options);
  },
};
