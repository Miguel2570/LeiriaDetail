// frontend/src/services/apiInterceptor.ts
import { Cache } from "@/services/cachemanager";
import router from "@/router";

// Interceta erros 401 em chamadas fetch diretas (não GraphQL)
const originalFetch = window.fetch;

window.fetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
    const response = await originalFetch(...args);
    
    if (response.status === 401) {
        try {
            const body = await response.clone().json();
            const message = String(body?.Error?.Message || body?.message || "").toLowerCase();
            
            if (
                message.includes("session expired") ||
                message.includes("invalid session") ||
                message.includes("session key is required") ||
                message.includes("token is required")
            ) {
                Cache.Session.value = "";
                router.push("/login");
            }
        } catch {
            // Se não der para ler o body, assume logout
            Cache.Session.value = "";
            router.push("/login");
        }
    }
    
    return response;
};