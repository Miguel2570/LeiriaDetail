// api/src/Loyalty/LoyaltyManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { LoyaltyOutputModel, LoyaltyBalance, LoyaltyReward, CreditTransaction, RewardRedemption } from './LoyaltyModel';

class LoyaltyManager {

    // ✅ Dar créditos ao completar um serviço
    static async earnCredits(userId: number, bookingId: number, credits: number, description: string): Promise<void> {
        await server.query('BEGIN');
        try {
            await server.query(`
                INSERT INTO loyalty_credits (user_id, total_earned, available_credits)
                VALUES ($1, 0, 0)
                ON CONFLICT (user_id) DO NOTHING
            `, [userId]);

            await server.query(`
                INSERT INTO credit_transactions (user_id, amount, type, description, reference_type, reference_id)
                VALUES ($1, $2, 'EARN', $3, 'booking', $4)
            `, [userId, credits, description, bookingId]);

            await server.query(`
                UPDATE loyalty_credits SET total_earned = total_earned + $1, updated_at = NOW()
                WHERE user_id = $2
            `, [credits, userId]);

            await server.query('COMMIT');
        } catch (error) {
            await server.query('ROLLBACK');
            throw error;
        }
    }

    // ✅ Saldo do utilizador
    static async getBalance(userId: number): Promise<LoyaltyBalance> {
        const result = await server.query(`
            SELECT total_earned, available_credits FROM loyalty_credits WHERE user_id = $1
        `, [userId]);

        if (result.rows.length === 0) return { total_earned: 0, available_credits: 0 };

        return {
            total_earned: result.rows[0].total_earned,
            available_credits: result.rows[0].available_credits
        };
    }

    // ✅ Recompensas disponíveis
    static async getRewards(): Promise<LoyaltyReward[]> {
        const result = await server.query(`
            SELECT * FROM loyalty_rewards WHERE is_active = true ORDER BY sort_order ASC
        `);
        return result.rows;
    }

    // ✅ Pode resgatar?
    static async canRedeem(userId: number, rewardId: number): Promise<{ can: boolean; message: string; required_credits?: number; available?: number }> {
        const reward = await server.query('SELECT * FROM loyalty_rewards WHERE id = $1', [rewardId]);
        if (reward.rows.length === 0) return { can: false, message: 'Recompensa não encontrada.' };

        const balance = await this.getBalance(userId);
        const required = reward.rows[0].required_credits;

        if (balance.available_credits < required) {
            return {
                can: false,
                message: `Precisas de ${required} créditos. Tens ${balance.available_credits}.`,
                required_credits: required,
                available: balance.available_credits
            };
        }

        return { can: true, message: 'Podes resgatar!' };
    }

    // ✅ Resgatar recompensa
    static async redeemReward(userId: number, rewardId: number): Promise<LoyaltyOutputModel> {
        const { can, message } = await this.canRedeem(userId, rewardId);
        if (!can) return new LoyaltyOutputModel(undefined, undefined, undefined, undefined, undefined, message, { Field: "credits", Message: message });

        const reward = await server.query('SELECT * FROM loyalty_rewards WHERE id = $1', [rewardId]);
        const requiredCredits = reward.rows[0].required_credits;
        const code = `LEIRIA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 90);

        await server.query('BEGIN');
        try {
            await server.query(`
                INSERT INTO reward_redemptions (user_id, reward_id, credits_spent, redemption_code, expires_at)
                VALUES ($1, $2, $3, $4, $5)
            `, [userId, rewardId, requiredCredits, code, expiresAt]);

            await server.query(`
                INSERT INTO credit_transactions (user_id, amount, type, description, reference_type, reference_id)
                VALUES ($1, $2, 'REDEEM', $3, 'reward', $4)
            `, [userId, -requiredCredits, `Resgate: ${reward.rows[0].name}`, rewardId]);

            await server.query('COMMIT');
            return new LoyaltyOutputModel(
                undefined, undefined, undefined, undefined,
                code,
                'Recompensa resgatada com sucesso!'
            );
        } catch (error: any) {
            await server.query('ROLLBACK');
            return new LoyaltyOutputModel(undefined, undefined, undefined, undefined, undefined, undefined, { Field: "Server", Message: error.message });
        }
    }

    // ✅ Histórico de transações
    static async getHistory(userId: number): Promise<CreditTransaction[]> {
        const result = await server.query(`
            SELECT * FROM credit_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50
        `, [userId]);
        return result.rows;
    }

    // ✅ Cupões ativos
    static async getActiveRedemptions(userId: number): Promise<RewardRedemption[]> {
        const result = await server.query(`
            SELECT rr.*, lr.name as reward_name, lr.description as reward_description
            FROM reward_redemptions rr
            JOIN loyalty_rewards lr ON rr.reward_id = lr.id
            WHERE rr.user_id = $1 AND rr.status IN ('PENDING', 'APPROVED') AND rr.expires_at > NOW()
            ORDER BY rr.created_at DESC
        `, [userId]);
        return result.rows;
    }

    // ✅ Dashboard completo
    static async getDashboard(userId: number): Promise<LoyaltyOutputModel> {
        const balance = await this.getBalance(userId);
        const rewards = await this.getRewards();
        const redemptions = await this.getActiveRedemptions(userId);
        return new LoyaltyOutputModel(balance, rewards, undefined, redemptions, undefined, "Dashboard carregado.");
    }
}

export default LoyaltyManager;