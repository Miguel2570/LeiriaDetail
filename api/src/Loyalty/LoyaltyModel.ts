// api/src/Loyalty/LoyaltyModel.ts
import { ErrorModel } from "../Helpers/ErrorModel";

export interface LoyaltyBalance {
    total_earned: number;
    available_credits: number;
}

export interface CreditTransaction {
    id: number;
    user_id: number;
    amount: number;
    type: 'EARN' | 'REDEEM' | 'BONUS' | 'EXPIRED';
    description: string;
    reference_type: string;
    reference_id: number;
    created_at: Date;
}

export interface LoyaltyReward {
    id: number;
    name: string;
    description: string;
    service_id?: number;
    required_credits: number;
    is_active: boolean;
    image_url?: string;
    sort_order: number;
}

export interface RewardRedemption {
    id: number;
    user_id: number;
    reward_id: number;
    reward_name?: string;
    reward_description?: string;
    credits_spent: number;
    status: 'PENDING' | 'APPROVED' | 'USED' | 'EXPIRED' | 'CANCELLED';
    redemption_code: string;
    expires_at: Date;
    created_at: Date;
    used_at?: Date;
}

export class LoyaltyOutputModel {
    HasError: boolean;
    Message?: string;
    Error?: { Field: string; Message: string; HasError: boolean };
    Balance?: LoyaltyBalance;
    Rewards?: LoyaltyReward[];
    Transactions?: CreditTransaction[];
    Redemptions?: RewardRedemption[];
    RedemptionCode?: string;

    constructor(
        balance?: LoyaltyBalance,
        rewards?: LoyaltyReward[],
        transactions?: CreditTransaction[],
        redemptions?: RewardRedemption[],
        redemptionCode?: string,
        message?: string,
        error?: { Field: string; Message: string }
    ) {
        this.Balance = balance;
        this.Rewards = rewards;
        this.Transactions = transactions;
        this.Redemptions = redemptions;
        this.RedemptionCode = redemptionCode;
        this.Message = message;
        this.Error = error ? { ...error, HasError: true } : undefined;
        this.HasError = error ? true : false;
    }
}