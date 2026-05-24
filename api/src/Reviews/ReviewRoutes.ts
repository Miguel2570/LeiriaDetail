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

router.get("/", GetApproved);
router.post("/Add", AddReview);

export default router;