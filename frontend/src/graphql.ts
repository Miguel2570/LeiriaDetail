import { Cache } from "@/services/cachemanager";
import router from "@/router";

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4001/graphql";
const ERROR_ROUTE_NAME = "ErrorPage";

export const graphql = async <T>(
    query: string,
    variables?: Record<string, any>
): Promise<T> => {
    console.log("Sent to GraphQL:", JSON.stringify({ query, variables }));

    try {
        const response = await fetch(GRAPHQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Session-Key": Cache.Session?.value || localStorage.getItem('session_key') || ''
            },
            body: JSON.stringify({ query, variables })
        });

        console.log("Raw GraphQL response:", response.status);

        if (response.status >= 300) {
            let errorBody: any = null;
            try {
                errorBody = await response.json();
            } catch {
                errorBody = null;
            }

            const errorMessage =
                errorBody?.error ||
                errorBody?.message ||
                `HTTP ${response.status} ${response.statusText}`;

            const error: any = new Error(errorMessage);
            error.code = response.status;
            error.output = errorBody;
            throw error;
        }

        let output: any;
        try {
            output = await response.json();
        } catch {
            const error: any = new Error("Invalid or empty response from API.");
            error.code = "Internal_Server_Error";
            throw error;
        }

        console.log("GraphQL response:", output);

        if (output.errors?.length) {
            const graphQLError = output.errors[0];
            const error: any = new Error(graphQLError.message);
            error.code = graphQLError.extensions?.code || "GRAPHQL";
            error.output = output;
            error.errors = output.errors;
            throw error;
        }

        if (!output.data) {
            const error: any = new Error("GraphQL returned no data.");
            error.code = "GRAPHQL";
            error.output = output;
            throw error;
        }

        const responseData = Object.values(output.data)[0] as any;

        if (responseData == null && !query.includes('Mutation')) {
            const error: any = new Error("Database unavailable or no response data.");
            error.code = "DATABASE";
            error.output = output;
            throw error;
        }

        const apiErrors = getApiErrors(responseData);
        const technicalError = apiErrors.find((err: any) => isTechnicalError(err));

        if (technicalError) {
            const error: any = new Error(
                technicalError.message ||
                technicalError.Message ||
                "Error returned by the API."
            );
            error.code = technicalError.code || technicalError.Code || "API_ERROR";
            error.output = output;
            error.errors = apiErrors;
            throw error;
        }

        return output.data as T;

    } catch (error: any) {
        console.error("GraphQL error:", error);

        const errorMessage = String(error?.message || "").toLowerCase();

        // 🔥 Erro de rede
        const isNetworkError =
            error instanceof TypeError ||
            errorMessage.includes("failed to fetch") ||
            errorMessage.includes("networkerror") ||
            errorMessage.includes("load failed");

        if (isNetworkError) {
            await router.push({
                name: ERROR_ROUTE_NAME,
                state: {
                    layer: "NETWORK",
                    title: "Sem Ligação",
                    subTitle: "Erro de conexão",
                    message: "Não foi possível ligar ao servidor da LeiriaDetail.",
                    stacktrace: error?.stack || "",
                    statusCode: "503"
                }
            });
            throw error;
        }

        // 🔥 CORRIGIDO: Sessão expirada - redirecionar para página de erro (não login)
        const isAuthError =
            error?.code === 401 ||
            error?.code === 'UNAUTHENTICATED' ||
            errorMessage.includes("session expired") ||
            errorMessage.includes("invalid session") ||
            errorMessage.includes("missing session-key") ||
            errorMessage.includes("token is required") ||
            errorMessage.includes("token is not valid") ||
            errorMessage.includes("token inválido") ||
            errorMessage.includes("sessão expirada") ||
            errorMessage.includes("unauthorized");

        if (isAuthError) {
            // Limpar cache
            if (Cache.Session) Cache.Session.value = "";
            Cache.clearAuth?.();
            localStorage.removeItem('pending_booking');
            localStorage.removeItem('pending_booking_id');
            localStorage.removeItem('booking_state');
            
            // 🔥 Redirecionar para página de erro de sessão expirada
            await router.push({
                name: ERROR_ROUTE_NAME,
                query: {
                    code: '401',
                    message: 'Sessão expirada. Por favor, inicie sessão novamente.'
                },
                state: {
                    layer: "AUTH",
                    title: "Sessão Expirada",
                    subTitle: "A sua sessão expirou por inatividade ou foi terminada.",
                    message: "Por favor, inicie sessão novamente para continuar.",
                    statusCode: "401"
                }
            });
            throw error;
        }

        // Outros erros
        await router.push({
            name: ERROR_ROUTE_NAME,
            state: {
                layer: "GRAPHQL",
                title: error?.code || "Erro",
                subTitle: "Ocorreu um erro inesperado",
                message: error?.message || "Não foi possível processar o seu pedido.",
                stacktrace: error?.stack || "",
                statusCode: error?.code || "500"
            }
        });

        throw error;
    }
};

// Funções utilitárias (mantêm-se iguais)
function getApiErrors(responseData: any): any[] {
    if (Array.isArray(responseData?.errors)) return responseData.errors;
    if (responseData?.HasError && responseData?.Error) return [responseData.Error];
    return [];
}

function formatErrorValue(value: unknown): string {
    if (typeof value === "string") return value;
    try { return JSON.stringify(value, null, 2); } 
    catch { return String(value); }
}

function isTechnicalError(error: any): boolean {
    const code = String(error?.code || error?.Code || error?.field || error?.Field || error?.type || error?.Type || "").toLowerCase();
    const message = String(error?.message || error?.Message || error?.error || error?.Error || "").toLowerCase();

    return (
        code === "server" || code === "database" || code === "graphql" || code === "api_error" || code === "internal_server_error" ||
        code === "network" || code === "connection_refused" || code === "service_unavailable" ||
        message.includes("technical_error") || message.includes("erro de conexão com api") ||
        message.includes("internal server error") || message.includes("database connection") ||
        message.includes("database unavailable") || message.includes("graphql returned no data") ||
        message.includes("invalid or empty response from api") || message.includes("connection refused") ||
        message.includes("failed to connect")
    );
}

export default graphql;