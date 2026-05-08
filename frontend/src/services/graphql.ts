import { Cache } from "@/CacheManagement/cachemanager"
import router from "@/router"

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL 

export const graphql = async <T>(
    query: string,
    variables?: Record<string, any>
): Promise<T> => {

    if (import.meta.env.DEV) {
        console.log('%c[GraphQL Request]', 'color: #3B82F6; font-weight: bold', { query, variables })
    }

    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json", 
                // Envia a chave da cache ou '1234' por defeito
                'Session-Key': Cache.Session.value || '1234' 
            },
            body: JSON.stringify({
                query,
                variables
            })
        })

        if (response.status === 401 || response.status === 403) {
            // Se a sessão expirar, limpa a cache e manda para o login
            Cache.clearAll()
            router.push('/login')
            throw new Error('Sessão expirada')
        }

        if (response.status >= 500) {
            // router.push('/page_not_found')
            throw new Error('Erro interno do servidor')
        }

        const output = await response.json()

        // O GraphQL pode devolver 200 mas ter erros no corpo da resposta
        if (output.errors) {
            console.error('[GraphQL Errors]:', output.errors)
            throw new Error(output.errors[0].message)
        }

        if (import.meta.env.DEV) {
            console.log('%c[GraphQL Response]', 'color: #06B6D4; font-weight: bold', output.data)
        }

        return output.data as T

    } catch (error) {
        console.error('%c[GraphQL Fetch Error]', 'color: #ef4444; font-weight: bold', error)
        throw error
    }
}

export default graphql