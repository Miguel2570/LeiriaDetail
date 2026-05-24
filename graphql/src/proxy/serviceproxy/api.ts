const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

class ApiFunctionalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ApiFunctionalError";
    }
}

class ApiTechnicalError extends Error {
    constructor(message: string) {
        super(`TECHNICAL_ERROR: ${message}`);
        this.name = "ApiTechnicalError";
    }
}

const API_BASE_CALL = async <T>(
    context: any,
    method: string,
    url: string,
    variables?: Record<string, any>
): Promise<T> => {

    try {
        // Tenta obter session-key do contexto (GraphQL context)
        const sessionKey = context?.req?.headers?.['session-key'] || 
                          context?.headers?.['session-key'] ||
                          context?.sessionKey;
        
        console.log(`📡 ${method} ${API_BASE_URL}${url}`);
        console.log(`🔑 Session Key: ${sessionKey ? 'present' : 'missing'}`);

        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: method,
            headers: { 
                "Content-Type": "application/json", 
                ...(sessionKey && { 'Session-Key': sessionKey })
            },
            body: variables ? JSON.stringify(variables) : undefined
        });
        
        let json: any = null;

        try {
            json = await response.json();
        } catch {
            if (!response.ok) {
                throw new ApiTechnicalError(`API returned invalid JSON with status ${response.status}`);
            }
            throw new ApiTechnicalError("API returned invalid or empty JSON");
        }

        if (!response.ok) {
            if (response.status >= 500) {
                throw new ApiTechnicalError(json.error || json.message || `API error ${response.status}`);
            }
            throw new ApiFunctionalError(json.error || json.message || `API error ${response.status}`);
        }

        return json;

    } catch (error) {
        if (error instanceof ApiFunctionalError || error instanceof ApiTechnicalError) {
            throw error;
        }
        throw new ApiTechnicalError(
            `Failed to call API: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

export const API = {
    GET: async <T>(
        context: any,
        url: string
    ): Promise<T> => {
        return await API_BASE_CALL(context, "GET", url);
    },

    POST: async <T>(
        context: any,
        url: string,
        variables?: Record<string, any>
    ): Promise<T> => {
        return await API_BASE_CALL(context, "POST", url, variables);
    },

    PUT: async <T>(
        context: any,
        url: string,
        variables?: Record<string, any>
    ): Promise<T> => {
        return await API_BASE_CALL(context, "PUT", url, variables);
    },

    PATCH: async <T>(
        context: any,
        url: string,
        variables?: Record<string, any>
    ): Promise<T> => {
        return await API_BASE_CALL(context, "PATCH", url, variables);
    },

    DELETE: async <T>(
        context: any,
        url: string,
        variables?: Record<string, any>
    ): Promise<T> => {
        return await API_BASE_CALL(context, "DELETE", url, variables);
    }
};