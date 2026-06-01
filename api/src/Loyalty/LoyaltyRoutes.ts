// api/src/Loyalty/LoyaltyRoutes.ts
import { Request, Response, Router } from "express";
import LoyaltyManager from "./LoyaltyManager";

const router = Router();

async function GetDashboard(request: Request, response: Response) {
    const sessionKey = request.headers['session-key'] as string;
    // Validar sessão e obter userId...
    const userId = 1; // TODO: obter da sessão
    const result = await LoyaltyManager.getDashboard(userId);
    response.status(200).json(result);
}

async function GetBalance(request: Request, response: Response) {
    const userId = 1; // TODO: obter da sessão
    const result = await LoyaltyManager.getBalance(userId);
    response.status(200).json(result);
}

async function GetRewards(request: Request, response: Response) {
    const result = await LoyaltyManager.getRewards();
    response.status(200).json(result);
}

async function RedeemReward(request: Request, response: Response) {
    const userId = 1; // TODO: obter da sessão
    const rewardId = parseInt(request.params.rewardId);
    const result = await LoyaltyManager.redeemReward(userId, rewardId);
    response.status(200).json(result);
}

async function GetHistory(request: Request, response: Response) {
    const userId = 1; // TODO: obter da sessão
    const result = await LoyaltyManager.getHistory(userId);
    response.status(200).json(result);
}

router.get("/Dashboard", GetDashboard);
router.get("/Balance", GetBalance);
router.get("/Rewards", GetRewards);
router.post("/Redeem/:rewardId", RedeemReward);
router.get("/History", GetHistory);

export default router;