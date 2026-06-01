// src/resolvers/loyalty/loyalty.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const loyaltyQueries = {
    loyaltyDashboard: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Loyalty/Dashboard");
            
            if (data.HasError) {
                return {
                    balance: null,
                    rewards: [],
                    redemptions: [],
                    message: data.Error?.Message,
                    hasError: true,
                    error: { field: "loyalty", message: data.Error?.Message }
                };
            }
            
            return {
                balance: data.Balance ? {
                    totalEarned: data.Balance.total_earned,
                    availableCredits: data.Balance.available_credits
                } : null,
                rewards: (data.Rewards || []).map((r: any) => ({
                    id: r.id?.toString(),
                    name: r.name,
                    description: r.description,
                    serviceId: r.service_id,
                    requiredCredits: r.required_credits,
                    isActive: r.is_active,
                    imageUrl: r.image_url,
                    sortOrder: r.sort_order
                })),
                redemptions: (data.Redemptions || []).map((r: any) => ({
                    id: r.id?.toString(),
                    userId: r.user_id,
                    rewardId: r.reward_id,
                    rewardName: r.reward_name,
                    rewardDescription: r.reward_description,
                    creditsSpent: r.credits_spent,
                    status: r.status,
                    redemptionCode: r.redemption_code,
                    expiresAt: r.expires_at,
                    createdAt: r.created_at
                })),
                message: data.Message,
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                balance: null, rewards: [], redemptions: [],
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    loyaltyBalance: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Loyalty/Balance");
            return {
                totalEarned: data.total_earned || 0,
                availableCredits: data.available_credits || 0
            };
        } catch (error: any) {
            return { totalEarned: 0, availableCredits: 0 };
        }
    },

    loyaltyRewards: async (_: any, __: any, context: any) => {
        try {
            const data = await API.GET<any>(context, "/Loyalty/Rewards");
            return (data || []).map((r: any) => ({
                id: r.id?.toString(),
                name: r.name,
                description: r.description,
                serviceId: r.service_id,
                requiredCredits: r.required_credits,
                isActive: r.is_active,
                imageUrl: r.image_url,
                sortOrder: r.sort_order
            }));
        } catch (error: any) {
            return [];
        }
    },

    loyaltyHistory: async (_: any, __: any, context: any) => {
        try {
            const data = await API.GET<any>(context, "/Loyalty/History");
            return (data || []).map((t: any) => ({
                id: t.id?.toString(),
                userId: t.user_id,
                amount: t.amount,
                type: t.type,
                description: t.description,
                referenceType: t.reference_type,
                referenceId: t.reference_id,
                createdAt: t.created_at
            }));
        } catch (error: any) {
            return [];
        }
    },

    loyaltyRedemptions: async (_: any, __: any, context: any) => {
        try {
            const data = await API.GET<any>(context, "/Loyalty/Dashboard");
            return (data.Redemptions || []).map((r: any) => ({
                id: r.id?.toString(),
                userId: r.user_id,
                rewardId: r.reward_id,
                rewardName: r.reward_name,
                rewardDescription: r.reward_description,
                creditsSpent: r.credits_spent,
                status: r.status,
                redemptionCode: r.redemption_code,
                expiresAt: r.expires_at,
                createdAt: r.created_at
            }));
        } catch (error: any) {
            return [];
        }
    }
};