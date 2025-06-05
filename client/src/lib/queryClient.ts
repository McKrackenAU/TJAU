import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/api-config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: RequestInit,
): Promise<Response> {
  // Resolve API URL for mobile vs web
  const resolvedUrl = url.startsWith('/api') ? `${API_CONFIG.baseURL}${url}` : url;
  
  const res = await fetch(resolvedUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    ...options, // Allow additional fetch options like signal for AbortController
  });

  // Only check for ok status if the request wasn't aborted
  if (!options?.signal || !(options.signal as AbortSignal).aborted) {
    await throwIfResNotOk(res);
  }
  
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    // Resolve API URL for mobile vs web
    const resolvedUrl = url.startsWith('/api') ? `${API_CONFIG.baseURL}${url}` : url;
    
    const res = await fetch(resolvedUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
