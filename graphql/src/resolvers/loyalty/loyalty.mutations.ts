// src/resolvers/loyalty/loyalty.mutations.ts
import { API } from '../../proxy/serviceproxy/api';

export const loyaltyMutations = {
    redeemLoyaltyReward: async (_: any, { rewardId }: { rewardId: number }, context: any) => {
        try {
            const data: any = await API.POST<any>(context, `/Loyalty/Redeem/${rewardId}`, {});
            
            if (data.HasError) {
                return {
                    success: false,
                    redemptionCode: null,
                    message: data.Error?.Message || "Erro ao resgatar recompensa",
                    hasError: true,
                    error: { field: "loyalty", message: data.Error?.Message }
                };
            }
            
            return {
                success: true,
                redemptionCode: data.RedemptionCode || null,
                message: data.Message || "Recompensa resgatada!",
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                success: false,
                redemptionCode: null,
                message: error.message,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};