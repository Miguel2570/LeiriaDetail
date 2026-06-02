// api/src/Reviews/ReviewRoutes.ts
import { Request, Response, Router } from "express";
import ReviewManager from "./ReviewManager";

const router = Router();

async function GetApproved(request: Request, response: Response) {
    const result = await ReviewManager.GetApproved();
    response.status(200).send(result);
}

async function AddReview(request: Request, response: Response) {
    const result = await ReviewManager.Add(request.body);
    response.status(200).send(result);
}

// ✅ Criar convite de review
async function CreateInvite(request: Request, response: Response) {
    const { bookingId, userId, userName, car } = request.body;
    const result = await ReviewManager.CreateReviewInvite(bookingId, userId, userName, car);
    response.status(200).send(result);
}

// ✅ Submeter review por token (página pública)
async function SubmitByToken(request: Request, response: Response) {
    const { token } = request.params;
    const { text, rating } = request.body;
    const result = await ReviewManager.SubmitByToken(token, text, rating);
    response.status(200).send(result);
}

// ✅ Obter review por token
async function GetByToken(request: Request, response: Response) {
    const { token } = request.params;
    const result = await ReviewManager.GetByToken(token);
    response.status(200).send(result);
}

router.get("/", GetApproved);
router.post("/Add", AddReview);
router.post("/invite", CreateInvite);
router.get("/token/:token", GetByToken);
router.post("/token/:token/submit", SubmitByToken);

export default router;