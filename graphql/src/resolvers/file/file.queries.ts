// src/resolvers/file/file.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const fileQueries = {
    getFile: async (_: any, { id }: { id: string }, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/File/${id}`);
            
            if (data?.HasError) {
                return {
                    file: null,
                    errors: [{
                        field: data.Error?.Field || "file",
                        message: data.Error?.Message || "Error fetching file",
                        code: "400"
                    }]
                };
            }
            
            return {
                file: data?.File || null,
                errors: []
            };
        } catch (error: any) {
            console.error("getFile error:", error);
            return {
                file: null,
                errors: [{
                    field: "server",
                    message: error.message || "Failed to fetch file",
                    code: "500"
                }]
            };
        }
    },
    
    listFiles: async (_: any, { limit, offset, entityType, entityId }: any, context: any) => {
        try {
            let url = `/File?limit=${limit || 50}&offset=${offset || 0}`;
            if (entityType) url += `&entityType=${entityType}`;
            if (entityId) url += `&entityId=${entityId}`;
            
            const data: any = await API.GET<any>(context, url);
            
            if (data?.HasError) {
                return {
                    files: [],
                    errors: [{
                        field: data.Error?.Field || "files",
                        message: data.Error?.Message || "Error listing files",
                        code: "400"
                    }]
                };
            }
            
            return {
                files: data?.Files || [],
                errors: []
            };
        } catch (error: any) {
            console.error("listFiles error:", error);
            return {
                files: [],
                errors: [{
                    field: "server",
                    message: error.message || "Failed to list files",
                    code: "500"
                }]
            };
        }
    },
    
    getFilesByEntity: async (_: any, { entityType, entityId }: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/File/entity/${entityType}/${entityId}`);
            
            if (data?.HasError) {
                return {
                    files: [],
                    errors: [{
                        field: data.Error?.Field || "files",
                        message: data.Error?.Message || "Error fetching files",
                        code: "400"
                    }]
                };
            }
            
            return {
                files: data?.Files || [],
                errors: []
            };
        } catch (error: any) {
            console.error("getFilesByEntity error:", error);
            return {
                files: [],
                errors: [{
                    field: "server",
                    message: error.message || "Failed to fetch files",
                    code: "500"
                }]
            };
        }
    }
};