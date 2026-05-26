import { API } from '../../proxy/serviceproxy/api';

export const staffMutations = {
    updateStaffRole: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.PUT<any>(context, "/Staff/Role", input);

            return {
                hasError: data.HasError || false,
                message: data.HasError
                    ? data.Error?.Message
                    : data.Message || "Role atualizada com sucesso!"
            };
        } catch (error: any) {
            return {
                hasError: true,
                message: error.message || "Erro ao atualizar role"
            };
        }
    },

    removeStaff: async (_: any, { id }: any, context: any) => {
        try {
            const data: any = await API.DELETE<any>(context, `/Staff/${id}`);

            return {
                hasError: data.HasError || false,
                message: data.HasError
                    ? data.Error?.Message
                    : data.Message || "Staff removido com sucesso!"
            };
        } catch (error: any) {
            return {
                hasError: true,
                message: error.message || "Erro ao remover staff"
            };
        }
    }
};