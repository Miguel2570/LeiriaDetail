// src/resolvers/file/file.mutations.ts
import { API } from '../../proxy/serviceproxy/api';

export const fileMutations = {
    createFile: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/File", input);
            
            if (data?.HasError) {
                return {
                    file: null,
                    errors: [{
                        field: data.Error?.Field || "file",
                        message: data.Error?.Message || "Error creating file",
                        code: "400"
                    }]
                };
            }
            
            return {
                file: data?.File || null,
                errors: []
            };
        } catch (error: any) {
            console.error("createFile error:", error);
            return {
                file: null,
                errors: [{
                    field: "server",
                    message: error.message || "Failed to create file",
                    code: "500"
                }]
            };
        }
    },
    
    updateFile: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.PUT<any>(context, `/File/${input.id}`, input);
            
            if (data?.HasError) {
                return {
                    file: null,
                    errors: [{
                        field: data.Error?.Field || "file",
                        message: data.Error?.Message || "Error updating file",
                        code: "400"
                    }]
                };
            }
            
            return {
                file: data?.File || null,
                errors: []
            };
        } catch (error: any) {
            console.error("updateFile error:", error);
            return {
                file: null,
                errors: [{
                    field: "server",
                    message: error.message || "Failed to update file",
                    code: "500"
                }]
            };
        }
    },
    
    deleteFile: async (_: any, { id }: { id: string }, context: any) => {
        try {
            const data: any = await API.DELETE<any>(context, `/File/${id}`);
            
            if (data?.HasError) {
                return {
                    success: false,
                    errors: [{
                        field: data.Error?.Field || "file",
                        message: data.Error?.Message || "Error deleting file",
                        code: "400"
                    }]
                };
            }
            
            return {
                success: data?.isSuccess || true,
                errors: []
            };
        } catch (error: any) {
            console.error("deleteFile error:", error);
            return {
                success: false,
                errors: [{
                    field: "server",
                    message: error.message || "Failed to delete file",
                    code: "500"
                }]
            };
        }
    }
};