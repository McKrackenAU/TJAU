import { QueryClient, QueryFunction } from "@tanstack/react-query";

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
  // For mobile apps with custom domains, use the original Replit URL
  let baseUrl = window.location.origin;
  
  // If we're on a custom domain, use the Replit backend URL
  if (window.location.hostname !== 'localhost' && 
      !window.location.hostname.includes('replit.dev') &&
      !window.location.hostname.includes('spock.replit.dev')) {
    // This is likely a custom domain, use the Replit backend
    baseUrl = 'https://421bbc5c-ec80-4610-9e7c-cb65af501ba1-00-3m8a2xelw67r8.spock.replit.dev';
  }
  
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  console.log("Making API request to:", fullUrl);
  console.log("Current domain:", window.location.hostname);
  
  const res = await fetch(fullUrl, {
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
    // For mobile apps with custom domains, use the original Replit URL
    let baseUrl = window.location.origin;
    
    // If we're on a custom domain, use the Replit backend URL
    if (window.location.hostname !== 'localhost' && 
        !window.location.hostname.includes('replit.dev') &&
        !window.location.hostname.includes('spock.replit.dev')) {
      // This is likely a custom domain, use the Replit backend
      baseUrl = 'https://421bbc5c-ec80-4610-9e7c-cb65af501ba1-00-3m8a2xelw67r8.spock.replit.dev';
    }
    
    const url = queryKey[0] as string;
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    console.log("Making query request to:", fullUrl);
    console.log("Current domain:", window.location.hostname);
    
    const res = await fetch(fullUrl, {
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
