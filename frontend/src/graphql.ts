import { Cache } from "@/services/cachemanager";
import router from "@/router";

// Vai buscar o URL da API ao ficheiro .env (ex: http://localhost:4001/graphql)
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4001/graphql";

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
                // Passa a chave de sessão se existir, senão passa um valor default (podes ajustar futuramente)
                ...(Cache.Session?.value && Cache.Session.value !== '1234' && { "Session-Key": Cache.Session.value })
            },
            body: JSON.stringify({ query, variables })
        });

        console.log("Raw GraphQL response:", response.status);

        // Trata erros 400, 401, 500, etc.
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

        // Mesmo com HTTP 200, a resposta pode não ser JSON válido
        try {
            output = await response.json();
        } catch {
            const error: any = new Error("Invalid or empty response from API.");
            error.code = "Internal_Server_Error";
            throw error;
        }

        console.log("GraphQL response:", output);

        // Trata erros específicos do GraphQL
        if (output.errors?.length) {
            const graphQLError = output.errors[0];

            const error: any = new Error(graphQLError.message);
            error.code = graphQLError.extensions?.code || "GRAPHQL";
            error.output = output;
            error.errors = output.errors;

            throw error;
        }

        // Se a resposta não tiver data, considera erro técnico
        if (!output.data) {
            const error: any = new Error("GraphQL returned no data.");
            error.code = "GRAPHQL";
            error.output = output;

            throw error;
        }

        const responseData = Object.values(output.data)[0] as any;

        // Se o primeiro campo da data vier null, considera falha na BD
        if (responseData == null && !query.includes('Mutation')) {
            const error: any = new Error("Database unavailable or no response data.");
            error.code = "DATABASE";
            error.output = output;

            throw error;
        }

        const apiErrors = getApiErrors(responseData);
        const technicalError = apiErrors.find((err: any) => isTechnicalError(err));

        // Só envia para a página de erro se for erro técnico
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

        // Deteta erros de rede (ex: servidor do backend desligado)
        const isNetworkError =
            error instanceof TypeError ||
            errorMessage.includes("failed to fetch") ||
            errorMessage.includes("networkerror") ||
            errorMessage.includes("load failed");

        if (isNetworkError) {
            await router.push({
                name: "error",
                state: {
                    layer: "NETWORK",
                    title: "NETWORK",
                    subTitle: "Connection error",
                    message: "Não foi possível ligar ao servidor da LeiriaDetail.",
                    details: error?.message || "O servidor pode estar em baixo.",
                    stacktrace: error?.stack || "",
                    statusCode: "NETWORK"
                }
            });

            throw error;
        }

        // Deteta erros de autenticação (ex: sessão expirada)
        const isAuthError =
            error?.code === 401 &&
            (
                errorMessage.includes("session expired") ||
                errorMessage.includes("invalid session") ||
                errorMessage.includes("missing session-key") ||
                errorMessage.includes("token is required") ||
                errorMessage.includes("token is not valid") ||
                errorMessage.includes("unauthorized")
            );

        if (isAuthError) {
            if (Cache.Session) Cache.Session.value = "";
            await router.push("/login");
            throw error;
        }

        // Qualquer outro erro técnico vai para a página de erro global
        await router.push({
            name: "error",
            state: {
                layer: "GRAPHQL",
                title: error?.code || "GRAPHQL",
                subTitle: "Ocorreu um erro inesperado",
                message: error?.message || "Não foi possível processar o seu pedido.",
                details: error?.message || formatErrorDetails(error),
                stacktrace: error?.stack || "",
                statusCode: error?.code || "9999"
            }
        });

        throw error;
    }
};

// Funções utilitárias de tratamento de erros
function getApiErrors(responseData: any): any[] {
    if (Array.isArray(responseData?.errors)) return responseData.errors;
    if (responseData?.HasError && responseData?.Error) return [responseData.Error];
    return [];
}

function formatErrorDetails(error: any): string {
    const parts: string[] = [];
    if (error?.output) parts.push(formatErrorValue(error.output));
    if (error?.errors) parts.push(formatErrorValue(error.errors));
    return parts.join("\n\n");
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